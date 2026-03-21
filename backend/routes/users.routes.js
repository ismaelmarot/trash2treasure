const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { User } = require('../db/models');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de multer para subir imágenes de perfil a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'trash2treasure/profiles',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `profile-${uniqueSuffix}`;
    },
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  },
});

const upload = multer({ storage });

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'id name email created_at');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    let hash = null;
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      password_hash: hash,
      verification_code: verificationCode,
      is_verified: false
    });

    await newUser.save();

    // Enviar email con SendGrid
    const msg = {
      to: email,
      from: {
        email: 'trash2tresure.app@gmail.com',
        name: 'Trash2Treasure'
      },
      subject: 'Código de verificación - Trash2Treasure',
      text: `Hola ${name},\n\nTu código de verificación es: ${verificationCode}\n\nEste código expira en 10 minutos.\n\nSaludos,\nEquipo Trash2Treasure`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d1d1f;">¡Bienvenido a Trash2Treasure!</h2>
          <p>Hola ${name},</p>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f5f5f7; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 8px; color: #1d1d1f; margin: 0;">${verificationCode}</h1>
          </div>
          <p>Este código expira en 10 minutos.</p>
          <p>Saludos,<br>Equipo Trash2Treasure</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Email de verificación enviado a ${email}`);
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallamos el registro solo porque falló el email
    }
    
    res.json({ 
      id: newUser._id, 
      name: newUser.name, 
      email: newUser.email, 
      message: 'Usuario registrado. Por favor verifica tu email.' 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Account not verified', needsVerification: true });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar código
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.verification_code === code) {
      user.is_verified = true;
      user.verification_code = null;
      await user.save();
      res.json({ message: 'Account verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de autenticación social (si las usas)
const passport = require('../config/passport.config');

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: req.user });
  }
);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Obtener perfil del usuario actual
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'name email profile_image created_at');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar si el nombre de usuario ya existe
router.get('/check-name/:name', authenticateToken, async (req, res) => {
  try {
    const { name } = req.params;
    const existingUser = await User.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.user.id }
    });
    res.json({ exists: !!existingUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar perfil del usuario
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verificar si el nombre ya existe
    if (name && name !== user.name) {
      const existingUser = await User.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Este nombre de usuario ya está en uso' });
      }
      user.name = name;
    }

    await user.save();
    res.json({ message: 'Perfil actualizado correctamente', user: { name: user.name, email: user.email, profile_image: user.profile_image } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subir foto de perfil
router.post('/profile/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Eliminar imagen anterior de Cloudinary si existe
    if (user.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(user.cloudinary_public_id);
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
    }

    // Guardar nueva imagen
    user.profile_image = req.file.path;
    user.cloudinary_public_id = req.file.filename;
    await user.save();

    res.json({ message: 'Imagen de perfil actualizada', profile_image: user.profile_image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
