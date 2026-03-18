const express = require('express');
const multer = require('multer');
const path = require('path');
const { Item, ItemPhoto, Rating } = require('../db/models');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Obtener items (con filtros opcional)
router.get('/', async (req, res) => {
  try {
    const { category, search, type } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (type === 'claimed') {
      filter.claimed_by = { $exists: true };
    }

    // Obtener items con datos del usuario
    const items = await Item.find(filter)
      .populate('user_id', 'name email')
      .populate('claimed_by', 'name email')
      .sort({ created_at: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener item por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('claimed_by', 'name email');

    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear item (requiere auth)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, latitude, longitude } = req.body;
    
    if (!title || !latitude || !longitude) {
      return res.status(400).json({ error: 'Title, latitude and longitude are required' });
    }

    const newItem = new Item({
      title,
      description,
      category,
      latitude,
      longitude,
      user_id: req.user.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    });

    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subir foto a un item
router.post('/:id/photos', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Verificar que el usuario es el dueño
    if (item.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Guardar en ItemPhoto
    const itemPhoto = new ItemPhoto({
      item_id: item._id,
      image_url: imageUrl
    });
    await itemPhoto.save();

    // Actualizar imagen principal del item si no tiene
    if (!item.main_image) {
      item.main_image = imageUrl;
      await item.save();
    }

    res.json({ message: 'Image uploaded successfully', image_url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reclamar item
router.post('/:id/claim', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.claimed_by) {
      return res.status(400).json({ error: 'Item already claimed' });
    }

    if (item.user_id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot claim your own item' });
    }

    item.claimed_by = req.user.id;
    await item.save();

    res.json({ message: 'Item claimed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Liberar item
router.post('/:id/unclaim', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.claimed_by?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    item.claimed_by = null;
    await item.save();

    res.json({ message: 'Item released successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, category, latitude, longitude } = req.body;
    
    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (latitude) item.latitude = latitude;
    if (longitude) item.longitude = longitude;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);
    await ItemPhoto.deleteMany({ item_id: req.params.id });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
