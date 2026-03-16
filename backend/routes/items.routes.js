const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const authenticateToken = require('../middleware/auth.middleware');

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const router = express.Router();

// Configuración de Multer para fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Listar todos los items (opcionalmente por categoría o usuario) con su primera foto
router.get('/', (req, res) => {
  const { category, type, search } = req.query;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      userId = decoded.id;
    } catch (e) { /* ignore auth for public list */ }
  }

  let query = `
    SELECT i.*, 
    (SELECT image_url FROM item_photos WHERE item_id = i.id LIMIT 1) as main_image
    FROM items i
  `;
   const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let conditions = ['i.created_at > ?'];
  let params = [twentyFourHoursAgo];

  if (category && category !== 'todos') {
    conditions.push('i.category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('(i.title LIKE ? OR i.description LIKE ?)');
    params.push(`%${search}%`);
    params.push(`%${search}%`);
  }

  if (type === 'mine' && userId) {
    conditions.push('i.user_id = ?');
    params.push(userId);
  } else if (type === 'others' && userId) {
    conditions.push('i.user_id != ?');
    params.push(userId);
  } else if (type === 'claimed' && userId) {
    conditions.push('i.claimed_by = ?');
    params.push(userId);
  }


  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }


  query += ' ORDER BY i.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener conteo por categorías (opcionalmente filtrado por tipo)
router.get('/stats/categories', (req, res) => {
  const { type } = req.query;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      userId = decoded.id;
    } catch (e) { /* ignore auth */ }
  }

  let query = 'SELECT category, COUNT(*) as count FROM items';
  let params = [];

  if (userId) {
    if (type === 'mine') {
      query += ' WHERE user_id = ?';
      params.push(userId);
    } else if (type === 'others') {
      query += ' WHERE user_id != ?';
      params.push(userId);
    }
  }

  query += ' GROUP BY category';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Detalle de un item con sus fotos
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM items WHERE id = ?', [id], (err, item) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    db.all('SELECT * FROM item_photos WHERE item_id = ?', [id], (err, photos) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...item, photos });
    });
  });
});

// Crear item
router.post('/', authenticateToken, (req, res) => {
  const { title, description, category, latitude, longitude } = req.body;
  const user_id = req.user.id; // Tomado del token
  if (!title || !latitude || !longitude) return res.status(400).json({ error: 'Missing required fields' });

  db.run(
    'INSERT INTO items (title, description, category, latitude, longitude, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, category, latitude, longitude, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, description, category, latitude, longitude, user_id });
    }
  );
});

// Reclamar un item
router.post('/:id/claim', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Verificar si ya está reclamado
  db.get('SELECT claimed_by FROM items WHERE id = ?', [id], (err, item) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    if (item.claimed_by) return res.status(400).json({ error: 'Este item ya ha sido reclamado' });

    db.run('UPDATE items SET claimed_by = ? WHERE id = ?', [userId, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item reclamado con éxito' });
    });
  });
});

// Dejar de reclamar un item (Unclaim)
router.post('/:id/unclaim', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Verificar que el usuario actual es quien lo tiene reclamado
  db.get('SELECT claimed_by FROM items WHERE id = ?', [id], (err, item) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    
    if (item.claimed_by !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para liberar este item' });
    }

    db.run('UPDATE items SET claimed_by = NULL WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Has dejado de reclamar el item' });
    });
  });
});
// Subir fotos para un item
router.post('/:id/photos', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const imageUrl = `/uploads/${req.file.filename}`;
  db.run(
    'INSERT INTO item_photos (item_id, image_url) VALUES (?, ?)',
    [id, imageUrl],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, item_id: id, image_url: imageUrl });
    }
  );
});
// Subir fotos para un item


// Actualizar item
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, category, latitude, longitude } = req.body;

  db.run(
    'UPDATE items SET title = ?, description = ?, category = ?, latitude = ?, longitude = ? WHERE id = ?',
    [title, description, category, latitude, longitude, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item updated', id });
    }
  );
});

// Borrar item
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Verificar que el usuario sea el dueño
  db.get('SELECT user_id FROM items WHERE id = ?', [id], (err, item) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });

    if (item.user_id !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este tesoro' });
    }

    db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Tesoro eliminado con éxito', id });
    });
  });
});


module.exports = router;