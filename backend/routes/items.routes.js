const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { Item, ItemPhoto, Rating, UserPoints } = require('../db/models');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de multer para subir imágenes a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'trash2treasure',
    format: async (req, file) => {
      // Determinar formato desde el MIME type
      const ext = path.extname(file.originalname).toLowerCase();
      return ext === '.png' ? 'png' : 'jpg';
    },
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `item-${uniqueSuffix}`;
    },
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// Middleware de autenticación opcional
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  const jwt = require('jsonwebtoken');
  const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

// Obtener items (con filtros opcional)
router.get('/', optionalAuth, async (req, res) => {
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

    if (type === 'claimed' && req.user) {
      // Items reclamados por el usuario + Items del usuario que fueron reclamados por otros
      filter.$or = [
        { claimed_by: req.user.id },
        { user_id: req.user.id, claimed_by: { $exists: true, $ne: null } }
      ];
    } else if (type === 'mine' && req.user) {
      // Solo items reportados por el usuario
      filter.user_id = req.user.id;
    }

    // Obtener items con datos del usuario y fotos
    const items = await Item.find(filter)
      .populate('user_id', 'name email')
      .populate('claimed_by', 'name email')
      .populate({
        path: 'photos',
        select: 'image_url cloudinary_public_id created_at'
      })
      .sort({ created_at: -1 });

    // Convertir _id a id para compatibilidad con el frontend
    const itemsWithId = items.map(item => {
      const obj = item.toObject();
      obj.id = obj._id;
      return obj;
    });

    res.json(itemsWithId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener item por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('claimed_by', 'name email')
      .populate({
        path: 'photos',
        select: 'image_url cloudinary_public_id created_at'
      });

    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    // Convertir _id a id para compatibilidad con el frontend
    const itemWithId = item.toObject();
    itemWithId.id = itemWithId._id;
    
    res.json(itemWithId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear item (requiere auth)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, latitude, longitude } = req.body;
    
    if (!title || latitude == null || longitude == null) {
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
    
    // Convertir _id a id para compatibilidad con el frontend
    const itemWithId = newItem.toObject();
    itemWithId.id = itemWithId._id;
    
    res.json(itemWithId);
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
    if (item.user_id?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Cloudinary devuelve la URL en req.file.path
    const imageUrl = req.file.path;
    const publicId = req.file.filename; // Cloudinary public_id
    
    // Guardar en ItemPhoto con el public_id para poder borrar después
    const itemPhoto = new ItemPhoto({
      item_id: item._id,
      image_url: imageUrl,
      cloudinary_public_id: publicId  // Nuevo campo para poder borrar
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

    // Verificar distancia (50 metros)
    const { userLat, userLng } = req.body;
    if (userLat && userLng && item.latitude && item.longitude) {
      const R = 6371000; // Radio de la Tierra en metros
      const deg2rad = (deg) => deg * (Math.PI / 180);
      const dLat = deg2rad(item.latitude - userLat);
      const dLon = deg2rad(item.longitude - userLng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(item.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance > 50) {
        return res.status(400).json({ 
          error: `Debes estar a menos de 50m para reclamar este tesoro. Estás a ${Math.round(distance)}m.` 
        });
      }
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

    if (item.user_id?.toString() !== req.user.id) {
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

    if (item.user_id?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Restar puntos del item (1 punto normal, 4 si es categoría crítica)
    const CRITICAL_CATEGORIES = ['batteries', 'electronics', 'construction', 'furniture'];
    const points = CRITICAL_CATEGORIES.includes(item.category) ? 4 : 1;
    
    const userPoints = await UserPoints.findOne({ user_id: item.user_id });
    if (userPoints) {
      userPoints.total_points = Math.max(0, (userPoints.total_points || 0) - points);
      userPoints.report_points = Math.max(0, (userPoints.report_points || 0) - points);
      userPoints.total_reports = Math.max(0, (userPoints.total_reports || 0) - 1);
      userPoints.markModified('category_points');
      await userPoints.save();
    }

    // Obtener todas las fotos del item
    const photos = await ItemPhoto.find({ item_id: req.params.id });
    
    // Borrar cada foto de Cloudinary
    for (const photo of photos) {
      if (photo.cloudinary_public_id) {
        try {
          await cloudinary.uploader.destroy(photo.cloudinary_public_id);
        } catch (cloudinaryError) {
          console.error('Error deleting photo from Cloudinary:', cloudinaryError);
        }
      }
    }

    // Borrar fotos de la base de datos
    await ItemPhoto.deleteMany({ item_id: req.params.id });
    
    // Borrar el item
    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
