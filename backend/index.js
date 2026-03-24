require('dotenv').config();
// Manejo global de errores

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./db/mongodb');
const { Item, ItemPhoto, UserPoints } = require('./db/models');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 5001;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
connectDB();

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Trash2Treasure API running on MongoDB' });
});

// Rutas
const usersRoutes = require('./routes/users.routes');
const itemsRoutes = require('./routes/items.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const pointsRoutes = require('./routes/points.routes');

app.use('/api/users', usersRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/points', pointsRoutes);

// Servir archivos estáticos (fotos de items)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Arrancar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Tarea de limpieza: Marcar items expirados y luego borrarlos
  setInterval(async () => {
    try {
      console.log('Ejecutando limpieza de items...');
      const now = new Date();
      
      // 1. Marcar como expirados y acreditar puntos
      const CRITICAL_CATEGORIES = ['batteries', 'electronics', 'construction', 'furniture'];
      const CATEGORY_FAMILIES = {
        organic: 'eco', garden: 'eco', recycle: 'eco',
        electronics: 'tech', batteries: 'tech',
        construction: 'heavy', furniture: 'heavy', wood: 'heavy',
        cardboard: 'packaging', paper: 'packaging', plastic: 'packaging', bottle: 'packaging', glass: 'packaging',
        clothes: 'reuse', books: 'reuse',
        star: 'special', sparkles: 'special',
        carton: 'packaging', botellas: 'packaging', mixto: 'special', otros: 'special'
      };
      
      const expiredItems = await Item.find({
        expires_at: { $lt: now },
        claimed_by: null,
        is_expired: { $ne: true }
      });
      
      console.log(`Items a expirar: ${expiredItems.length}`);
      
      for (const item of expiredItems) {
        // Los puntos ya fueron acreditados cuando se reportó el item
        // Solo marcar como expirado
        item.is_expired = true;
        await item.save();
      }
      
      // 2. Borrar items que están marcados como expirados hace más de 1 hora
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const toDelete = await Item.find({ 
        is_expired: true,
        expires_at: { $lt: oneHourAgo }
      }).select('_id');
      
      for (const item of toDelete) {
        const photos = await ItemPhoto.find({ item_id: item._id });
        for (const photo of photos) {
          if (photo.cloudinary_public_id) {
            try {
              await cloudinary.uploader.destroy(photo.cloudinary_public_id);
            } catch (err) {
              console.error('Error borrando foto de Cloudinary:', err.message);
            }
          }
        }
        await ItemPhoto.deleteMany({ item_id: item._id });
      }
      
      const deleteResult = await Item.deleteMany({ 
        is_expired: true,
        expires_at: { $lt: oneHourAgo }
      });
      console.log(`Items eliminados: ${deleteResult.deletedCount}`);
    } catch (err) {
      console.error('Error en la limpieza de items:', err.message);
    }
  }, 60 * 60 * 1000); // 1 hora
});
