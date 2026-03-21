const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  verification_code: { type: String },
  profile_image: { type: String }, // URL de la foto de perfil (Cloudinary)
  cloudinary_public_id: { type: String }, // Para poder borrar de Cloudinary
  created_at: { type: Date, default: Date.now },
});

// UserPoints Schema - Sistema de puntos
const userPointsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  total_points: { type: Number, default: 0 },
  
  // Puntos por acción
  report_points: { type: Number, default: 0 },
  collect_points: { type: Number, default: 0 },
  
  // Contadores
  total_reports: { type: Number, default: 0 },
  total_collected: { type: Number, default: 0 },
  
  // Puntos por categoría
  category_points: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Contadores por categoría
  category_reports: {
    type: Map,
    of: Number,
    default: {}
  },
  category_collected: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Contadores por familia
  family_reports: {
    eco: { type: Number, default: 0 },
    tech: { type: Number, default: 0 },
    heavy: { type: Number, default: 0 },
    packaging: { type: Number, default: 0 },
    reuse: { type: Number, default: 0 },
    special: { type: Number, default: 0 }
  },
  family_collected: {
    eco: { type: Number, default: 0 },
    tech: { type: Number, default: 0 },
    heavy: { type: Number, default: 0 },
    packaging: { type: Number, default: 0 },
    reuse: { type: Number, default: 0 },
    special: { type: Number, default: 0 }
  },
  
  // Streaks
  current_streak: { type: Number, default: 0 },
  max_streak: { type: Number, default: 0 },
  last_activity_date: { type: Date },
  
  // Combo tracking
  last_category: { type: String },
  combo_same_category: { type: Number, default: 0 },
  categories_today: [String],
  items_today: { type: Number, default: 0 },
  
  // Ranking
  weekly_points: { type: Number, default: 0 },
  monthly_points: { type: Number, default: 0 },
  
  // División
  division: { type: String, default: 'Curioso Verde' },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Achievement Schema - Logros
const achievementSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievement_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  points_earned: { type: Number, default: 0 },
  unlocked_at: { type: Date, default: Date.now }
});

achievementSchema.index({ user_id: 1, achievement_id: 1 }, { unique: true });

// Definición de logros disponibles
const ACHIEVEMENTS = [
  { id: 'first_report', name: 'Primer Reporte', description: 'Reporta tu primer item', icon: '📸', points: 5 },
  { id: 'first_collect', name: 'Primera Recolección', description: 'Recolecta tu primer item', icon: '♻️', points: 10 },
  { id: 'eco_master', name: 'Eco Master', description: '5 items ECO en 1 día', icon: '🌱', points: 10 },
  { id: 'tech_hunter', name: 'Tech Hunter', description: '3 items TECH en 1 día', icon: '⚡', points: 10 },
  { id: 'heavy_duty', name: 'Heavy Duty', description: '2 items HEAVY en 1 día', icon: '🏗️', points: 10 },
  { id: 'balanced_cleaner', name: 'Balanced Cleaner', description: '1 de cada familia en 1 día', icon: '🌍', points: 20 },
  { id: 'streak_3', name: 'Racha de 3', description: '3 días seguidos activo', icon: '🔥', points: 4 },
  { id: 'streak_5', name: 'Racha de 5', description: '5 días seguidos activo', icon: '🔥', points: 6 },
  { id: 'streak_10', name: 'Racha de 10', description: '10 días seguidos activo', icon: '🔥', points: 15 },
  { id: 'reporter_10', name: 'Reportero', description: '10 items reportados', icon: '📸', points: 10 },
  { id: 'reporter_50', name: 'Reportero Pro', description: '50 items reportados', icon: '📸', points: 25 },
  { id: 'reporter_100', name: 'Reportero Master', description: '100 items reportados', icon: '📸', points: 50 },
  { id: 'collector_10', name: 'Recolector', description: '10 items recolectados', icon: '♻️', points: 15 },
  { id: 'collector_50', name: 'Recolector Pro', description: '50 items recolectados', icon: '♻️', points: 30 },
  { id: 'collector_100', name: 'Recolector Master', description: '100 items recolectados', icon: '♻️', points: 60 },
  { id: 'first_of_day', name: 'Primero del Día', description: 'Primer reporte del día', icon: '🥇', points: 5 },
  { id: 'speed_collector', name: 'Recolector Rápido', description: 'Recolecta en menos de 1 hora', icon: '⚡', points: 3 },
  { id: 'family_diverse', name: 'Diversidad', description: 'Usa 4 familias distintas', icon: '🌈', points: 10 }
];

// Índices para mejorar la búsqueda
userPointsSchema.index({ total_points: -1 });
userPointsSchema.index({ weekly_points: -1 });
userPointsSchema.index({ monthly_points: -1 });

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
const UserPoints = mongoose.model('UserPoints', userPointsSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = { User, Item, ItemPhoto, Rating, UserPoints, Achievement, ACHIEVEMENTS };
