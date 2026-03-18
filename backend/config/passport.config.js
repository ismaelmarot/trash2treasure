const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
// Apple strategy usually requires a more complex setup (AppleStrategy from 'passport-apple')
const AppleStrategy = require('passport-apple');
const { User } = require('../db/models');
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
    
    try {
      // Buscar usuario por facebook_id o email
      let user = await User.findOne({
        $or: [
          { facebook_id: profile.id },
          { email: email }
        ]
      });

      if (user) {
        // Si el usuario existe pero no tiene facebook_id, lo agregamos
        if (!user.facebook_id) {
          user.facebook_id = profile.id;
          await user.save();
        }
        return done(null, user);
      } else {
        // Crear nuevo usuario
        const newUser = new User({
          name: profile.displayName,
          email: email,
          facebook_id: profile.id,
          is_verified: true // Los usuarios de Facebook ya verifican su email
        });
        await newUser.save();
        done(null, newUser);
      }
    } catch (err) {
      done(err);
    }
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
