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
const { Item } = require('./db/models');

const app = express();
const PORT = process.env.PORT || 5001;

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

app.use('/api/users', usersRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/ratings', ratingsRoutes);

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
  
  // Tarea de limpieza: Borrar items de más de 24h cada hora
  setInterval(async () => {
    try {
      console.log('Ejecutando limpieza de items expirados...');
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await Item.deleteMany({ 
        created_at: { $lt: twentyFourHoursAgo },
        claimed_by: { $exists: false }
      });
      
      console.log(`Limpieza completada. Items eliminados: ${result.deletedCount}`);
    } catch (err) {
      console.error('Error en la limpieza de items:', err.message);
    }
  }, 60 * 60 * 1000); // 1 hora
});
