const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  verification_code: { type: String },
  reset_token: { type: String },
  reset_token_expiry: { type: Date },
  must_change_password: { type: Boolean, default: false },
  profile_image: { type: String }, // URL de la foto de perfil (Cloudinary)
  cloudinary_public_id: { type: String }, // Para poder borrar de Cloudinary
  country: { type: String },
  state: { type: String },
  city: { type: String },
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
  
  // Contadores temporales (desafíos)
  daily_reports: { type: Number, default: 0 },
  daily_collected: { type: Number, default: 0 },
  weekly_reports: { type: Number, default: 0 },
  weekly_collected: { type: Number, default: 0 },
  weekly_reports_prev: { type: Number, default: 0 },
  weekly_collected_prev: { type: Number, default: 0 },
  monthly_reports: { type: Number, default: 0 },
  monthly_collected: { type: Number, default: 0 },
  last_weekly_reset: { type: Date },
  last_monthly_reset: { type: Date },
  
  // Familias y categorías temporales
  daily_family_reports: {
    type: Map,
    of: Number,
    default: {}
  },
  daily_category_reports: {
    type: Map,
    of: Number,
    default: {}
  },
  weekly_family_reports: {
    type: Map,
    of: Number,
    default: {}
  },
  weekly_category_reports: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Contadores por familia (acumulados)
  eco_reports: { type: Number, default: 0 },
  tech_reports: { type: Number, default: 0 },
  heavy_reports: { type: Number, default: 0 },
  packaging_reports: { type: Number, default: 0 },
  reuse_reports: { type: Number, default: 0 },
  special_reports: { type: Number, default: 0 },
  
  weekly_eco_reports: { type: Number, default: 0 },
  weekly_tech_reports: { type: Number, default: 0 },
  weekly_heavy_reports: { type: Number, default: 0 },
  weekly_packaging_reports: { type: Number, default: 0 },
  weekly_reuse_reports: { type: Number, default: 0 },
  
  monthly_eco_reports: { type: Number, default: 0 },
  monthly_tech_reports: { type: Number, default: 0 },
  monthly_heavy_reports: { type: Number, default: 0 },
  monthly_packaging_reports: { type: Number, default: 0 },
  monthly_reuse_reports: { type: Number, default: 0 },
  
  // Fechas de último reseteo
  last_daily_reset: { type: Date },
  last_weekly_reset: { type: Date },
  last_monthly_reset: { type: Date },
  
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
  
  // Progreso de desafíos
  challenges: {
    type: Map,
    of: new mongoose.Schema({
      completed: { type: Number, default: 0 },
      trophies: { type: Number, default: 0 }
    }, { _id: false }),
    default: {}
  },
  
  // Fechas de último reseteo de desafíos (separado para mejor control)
  challenge_last_reset: {
    type: Map,
    of: Date,
    default: {}
  },
  
  last_sync: { type: Date },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Achievement Schema - Logros (permanentes, se desbloquean una vez)
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

// ChallengeDefinition Schema - Define todos los desafíos
const challengeDefinitionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'annual'], required: true },
  category: { type: String }, // reports, collected, families, categories, streak, eco, tech, heavy, etc.
  target: { type: Number, required: true },
  reward: { type: Number, default: 0 },
  max_stars: { type: Number, default: 7 },
  active: { type: Boolean, default: true }
});

// UserChallengeProgress Schema - Progreso de cada usuario en cada desafío
const userChallengeProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge_id: { type: String, required: true },
  period_start: { type: Date, required: true },
  period_type: { type: String, enum: ['daily', 'weekly', 'monthly', 'annual'], required: true },
  current_progress: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  trophies: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  last_updated: { type: Date, default: Date.now }
});

userChallengeProgressSchema.index({ user_id: 1, challenge_id: 1, period_start: 1 }, { unique: true });
userChallengeProgressSchema.index({ user_id: 1, period_type: 1 });

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
itemSchema.index({ user_id: 1, created_at: -1 }); // Compound index para stats por período

// Índices para UserPoints
userPointsSchema.index({ total_points: -1 }); // Para ranking

ratingSchema.index({ item_id: 1, user_id: 1 }, { unique: true });

// Crear modelos
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const ItemPhoto = mongoose.model('ItemPhoto', itemPhotoSchema);
const Rating = mongoose.model('Rating', ratingSchema);
const UserPoints = mongoose.model('UserPoints', userPointsSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);
const ChallengeDefinition = mongoose.model('ChallengeDefinition', challengeDefinitionSchema);
const UserChallengeProgress = mongoose.model('UserChallengeProgress', userChallengeProgressSchema);

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

// Definición de desafíos
const CHALLENGE_DEFINITIONS = [
  // DIARIOS
  { id: 'daily_report_3', name: 'Reportero Diario', description: 'Reporta 3 items', icon: '📸', type: 'daily', category: 'reports', target: 3, reward: 4, max_stars: 7 },
  { id: 'daily_report_5', name: 'Reportero Intenso', description: 'Reporta 5 items', icon: '📸', type: 'daily', category: 'reports', target: 5, reward: 7, max_stars: 7 },
  { id: 'daily_collect_3', name: 'Recolector Diario', description: 'Recolecta 3 items', icon: '♻️', type: 'daily', category: 'collected', target: 3, reward: 7, max_stars: 7 },
  { id: 'daily_collect_5', name: 'Recolector Intenso', description: 'Recolecta 5 items', icon: '♻️', type: 'daily', category: 'collected', target: 5, reward: 12, max_stars: 7 },
  { id: 'daily_families_2', name: 'Diversidad Diaria', description: 'Usa 2 familias', icon: '🌈', type: 'daily', category: 'families', target: 2, reward: 10, max_stars: 7 },
  { id: 'daily_families_3', name: 'Multifamilia', description: 'Usa 3 familias', icon: '🌈', type: 'daily', category: 'families', target: 3, reward: 20, max_stars: 7 },
  { id: 'daily_eco_2', name: 'Eco Diario', description: 'Reporta 2 items ECO', icon: '🌱', type: 'daily', category: 'eco', target: 2, reward: 4, max_stars: 7 },
  { id: 'daily_tech_1', name: 'Tech Diario', description: 'Reporta 1 item TECH', icon: '⚡', type: 'daily', category: 'tech', target: 1, reward: 4, max_stars: 7 },
  { id: 'daily_heavy_1', name: 'Heavy Diario', description: 'Reporta 1 item HEAVY', icon: '🏗️', type: 'daily', category: 'heavy', target: 1, reward: 5, max_stars: 7 },
  { id: 'daily_packaging_2', name: 'Packaging Diario', description: 'Reporta 2 items PACKAGING', icon: '📦', type: 'daily', category: 'packaging', target: 2, reward: 4, max_stars: 7 },
  { id: 'daily_reuse_1', name: 'Reuse Diario', description: 'Reporta 1 item REUSE', icon: '👕', type: 'daily', category: 'reuse', target: 1, reward: 4, max_stars: 7 },
  // SEMANALES
  { id: 'weekly_report_10', name: 'Reportero Semanal', description: '10 items esta semana', icon: '📸', type: 'weekly', category: 'reports', target: 10, reward: 30, max_stars: 4 },
  { id: 'weekly_collect_10', name: 'Recolector Semanal', description: '10 items esta semana', icon: '♻️', type: 'weekly', category: 'collected', target: 10, reward: 30, max_stars: 4 },
  { id: 'weekly_families_4', name: 'Multifamilia Semanal', description: '4 familias esta semana', icon: '🌈', type: 'weekly', category: 'families', target: 4, reward: 50, max_stars: 4 },
  { id: 'weekly_streak_5', name: 'Racha de 5', description: '5 días activo en la semana', icon: '🔥', type: 'weekly', category: 'streak', target: 5, reward: 10, max_stars: 4 },
  { id: 'weekly_eco_5', name: 'Semana Verde', description: 'Reporta 5 items ECO', icon: '🌱', type: 'weekly', category: 'eco', target: 5, reward: 15, max_stars: 4 },
  { id: 'weekly_tech_3', name: 'Semana Tech', description: 'Reporta 3 items TECH', icon: '⚡', type: 'weekly', category: 'tech', target: 3, reward: 15, max_stars: 4 },
  { id: 'weekly_heavy_2', name: 'Semana Pesada', description: 'Reporta 2 items HEAVY', icon: '🏗️', type: 'weekly', category: 'heavy', target: 2, reward: 15, max_stars: 4 },
  // MENSUALES
  { id: 'monthly_report_50', name: 'Reportero Mensual', description: '50 items este mes', icon: '📸', type: 'monthly', category: 'reports', target: 50, reward: 50, max_stars: 12 },
  { id: 'monthly_collect_50', name: 'Recolector Mensual', description: '50 items este mes', icon: '♻️', type: 'monthly', category: 'collected', target: 50, reward: 100, max_stars: 12 },
  { id: 'monthly_families_5', name: 'Versatilidad', description: 'Usa 5 familias este mes', icon: '🌍', type: 'monthly', category: 'families', target: 5, reward: 400, max_stars: 12 },
  { id: 'monthly_streak_15', name: 'Racha de 15', description: '15 días activo en el mes', icon: '🔥', type: 'monthly', category: 'streak', target: 15, reward: 30, max_stars: 12 },
  // ANUALES
  { id: 'annual_eco_200', name: 'Eco Impact', description: '200 items ECO', icon: '🌱', type: 'annual', category: 'eco', target: 200, reward: 1000, max_stars: 10 },
  { id: 'annual_tech_100', name: 'Tech Guardian', description: '100 items TECH', icon: '⚡', type: 'annual', category: 'tech', target: 100, reward: 1200, max_stars: 10 },
  { id: 'annual_heavy_80', name: 'City Cleaner', description: '80 items HEAVY', icon: '🏗️', type: 'annual', category: 'heavy', target: 80, reward: 1200, max_stars: 10 },
];

// Función para inicializar definiciones de desafíos en la DB
const initializeChallengeDefinitions = async () => {
  for (const def of CHALLENGE_DEFINITIONS) {
    await ChallengeDefinition.findOneAndUpdate(
      { id: def.id },
      def,
      { upsert: true, new: true }
    );
  }
};

module.exports = { 
  User, Item, ItemPhoto, Rating, UserPoints, Achievement, 
  ChallengeDefinition, UserChallengeProgress, ACHIEVEMENTS, CHALLENGE_DEFINITIONS,
  initializeChallengeDefinitions 
};
