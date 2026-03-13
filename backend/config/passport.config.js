const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
// Apple strategy usually requires a more complex setup (AppleStrategy from 'passport-apple')
const AppleStrategy = require('passport-apple');
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'dummy',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy',
    callbackURL: "/api/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    // Lógica para buscar o crear usuario
    const email = profile.emails ? profile.emails[0].value : null;
    db.get('SELECT * FROM users WHERE facebook_id = ? OR email = ?', [profile.id, email], (err, user) => {
      if (err) return done(err);
      if (user) {
        if (!user.facebook_id) {
          db.run('UPDATE users SET facebook_id = ? WHERE id = ?', [profile.id, user.id]);
        }
        return done(null, user);
      } else {
        db.run('INSERT INTO users (name, email, facebook_id) VALUES (?, ?, ?)', [profile.displayName, email, profile.id], function(err) {
          if (err) return done(err);
          db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
            done(err, newUser);
          });
        });
      }
    });
  }
));

// Configuración básica para Apple (requiere llaves .p8 y más configuración)
/*
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: path.join(__dirname, 'apple-private-key.p8'),
    callbackURL: "/api/users/auth/apple/callback"
  }, ...));
*/

module.exports = passport;
