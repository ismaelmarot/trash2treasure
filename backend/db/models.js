const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  verification_code: { type: String },
  created_at: { type: Date, default: Date.now },
});

// Item Schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  main_image: { type: String }, // URL de la imagen principal
});

// Virtual para popular las fotos del item
itemSchema.virtual('photos', {
  ref: 'ItemPhoto',
  localField: '_id',
  foreignField: 'item_id'
});

// Asegurar que los virtuals se incluyan en toJSON y toObject
itemSchema.set('toObject', { virtuals: true });
itemSchema.set('toJSON', { virtuals: true });

// ItemPhoto Schema
const itemPhotoSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  image_url: { type: String, required: true },
  cloudinary_public_id: { type: String }, // Para poder borrar de Cloudinary
  created_at: { type: Date, default: Date.now },
});

// Rating Schema
const ratingSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
});

// Crear índices para mejorar la búsqueda
itemSchema.index({ category: 1 });
itemSchema.index({ user_id: 1 });
itemSchema.index({ claimed_by: 1 });
itemSchema.index({ latitude: 1, longitude: 1 });
itemSchema.index({ created_at: -1 });

ratingSchema.index({ item_id: 1, user_id: 1 }, { unique: true });

// Crear modelos
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const ItemPhoto = mongoose.model('ItemPhoto', itemPhotoSchema);
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = { User, Item, ItemPhoto, Rating };
