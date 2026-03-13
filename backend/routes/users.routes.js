const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const db = require('../db/database');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

// Configuración de nodemailer (Mock/Ethereal para desarrollo)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'test@ethereal.email', // Sustituir por credenciales reales en prod
    pass: 'password'
  }
});

router.get('/', (req, res) => {

  db.all('SELECT id, name, email, created_at FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  try {
    let hash = null;
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    db.run(
      'INSERT INTO users (name, email, password_hash, verification_code) VALUES (?, ?, ?, ?)',
      [name, email, hash, verificationCode],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        
        console.log(`[EMAIL MOCK] Código de verificación para ${email}: ${verificationCode}`);
        
        res.json({ 
          id: this.lastID, 
          name, 
          email, 
          message: 'Usuario registrado. Por favor verifica tu email.' 
        });
      }
    );

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Account not verified', needsVerification: true });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

router.post('/verify', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.verification_code === code) {
      db.run('UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?', [user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Account verified successfully' });
      });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  });
});


const passport = require('../config/passport.config');

// Rutas de autenticación social
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, SECRET_KEY, { expiresIn: '7d' });
    // En una app real, podrías redirigir al frontend con el token
    res.json({ token, user: req.user });
  }
);

module.exports = router;