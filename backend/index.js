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
const { Item, ItemPhoto } = require('./db/models');
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
  
  // Tarea de limpieza: Borrar items expirados cada hora
  setInterval(async () => {
    try {
      console.log('Ejecutando limpieza de items expirados...');
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Obtener TODOS los items expirados (reclamados o no)
      const itemsToDelete = await Item.find({ 
        created_at: { $lt: twentyFourHoursAgo }
      }).select('_id');
      
      // Para cada item, obtener sus fotos y borrarlas de Cloudinary
      for (const item of itemsToDelete) {
        const photos = await ItemPhoto.find({ item_id: item._id });
        for (const photo of photos) {
          if (photo.cloudinary_public_id) {
            try {
              await cloudinary.uploader.destroy(photo.cloudinary_public_id);
              console.log(`Foto ${photo.cloudinary_public_id} borrada de Cloudinary`);
            } catch (err) {
              console.error('Error borrando foto de Cloudinary:', err.message);
            }
          }
        }
        // Borrar fotos de la base de datos
        await ItemPhoto.deleteMany({ item_id: item._id });
      }
      
      // Borrar los items
      const result = await Item.deleteMany({ 
        created_at: { $lt: twentyFourHoursAgo }
      });
      
      console.log(`Limpieza completada. Items eliminados: ${result.deletedCount}`);
    } catch (err) {
      console.error('Error en la limpieza de items:', err.message);
    }
  }, 60 * 60 * 1000); // 1 hora
});
