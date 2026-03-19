const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { User } = require('../db/models');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

module.exports = router;
