const express = require('express');
const jwt = require('jsonwebtoken');
const { User, UserPoints, Achievement, ACHIEVEMENTS, Item } = require('../db/models');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

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

// Mapeo de categorías a familias
const CATEGORY_FAMILIES = {
  organic: 'eco', garden: 'eco', recycle: 'eco',
  electronics: 'tech', batteries: 'tech',
  construction: 'heavy', furniture: 'heavy', wood: 'heavy',
  cardboard: 'packaging', paper: 'packaging', plastic: 'packaging', bottle: 'packaging', glass: 'packaging',
  clothes: 'reuse', books: 'reuse',
  star: 'special', sparkles: 'special',
  carton: 'packaging', botellas: 'packaging', mixto: 'special', otros: 'special'
};

// Categorías críticas (bonus fijo)
const CRITICAL_CATEGORIES = ['batteries', 'electronics', 'construction', 'furniture'];

// Divisions
const DIVISIONS = [
  { name: 'Curioso Verde', minPoints: 0, maxPoints: 100 },
  { name: 'Recolector Novato', minPoints: 100, maxPoints: 200 },
  { name: 'Semilla', minPoints: 200, maxPoints: 400 },
  { name: 'Eco Aprendiz', minPoints: 400, maxPoints: 700 },
  { name: 'Separador Serial', minPoints: 700, maxPoints: 1000 },
  { name: 'Guardián del Bosque', minPoints: 1000, maxPoints: 1500 },
  { name: 'Maestro del Reciclaje', minPoints: 1500, maxPoints: 2000 },
  { name: 'Defensor del Planeta', minPoints: 2000, maxPoints: 2500 },
  { name: 'Titán Verde', minPoints: 2500, maxPoints: 3000 },
  { name: 'Gaia Ascendido', minPoints: 3000, maxPoints: Infinity }
];

// Verificar y resetear contadores temporales si es necesario
const resetCountersIfNeeded = (userPoints) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Reset diario
  const lastDaily = userPoints.last_daily_reset ? new Date(userPoints.last_daily_reset) : null;
  if (!lastDaily || lastDaily < now) {
    userPoints.daily_reports = 0;
    userPoints.daily_collected = 0;
    userPoints.daily_family_reports = {};
    userPoints.daily_category_reports = {};
    userPoints.last_daily_reset = now;
  }
  
  // Reset semanal (lunes)
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;
  const lastMonday = new Date(now);
  lastMonday.setDate(now.getDate() - mondayOffset);
  lastMonday.setHours(0, 0, 0, 0);
  
  const lastWeekly = userPoints.last_weekly_reset ? new Date(userPoints.last_weekly_reset) : null;
  if (!lastWeekly || lastWeekly < lastMonday) {
    userPoints.weekly_reports = 0;
    userPoints.weekly_collected = 0;
    userPoints.weekly_family_reports = {};
    userPoints.weekly_category_reports = {};
    userPoints.weekly_eco_reports = 0;
    userPoints.weekly_tech_reports = 0;
    userPoints.weekly_heavy_reports = 0;
    userPoints.weekly_packaging_reports = 0;
    userPoints.weekly_reuse_reports = 0;
    userPoints.last_weekly_reset = lastMonday;
  }
  
  // Reset mensual (día 1)
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthly = userPoints.last_monthly_reset ? new Date(userPoints.last_monthly_reset) : null;
  if (!lastMonthly || lastMonthly < firstOfMonth) {
    userPoints.monthly_reports = 0;
    userPoints.monthly_collected = 0;
    userPoints.monthly_eco_reports = 0;
    userPoints.monthly_tech_reports = 0;
    userPoints.monthly_heavy_reports = 0;
    userPoints.monthly_packaging_reports = 0;
    userPoints.monthly_reuse_reports = 0;
    userPoints.last_monthly_reset = firstOfMonth;
  }
};

// Obtener o crear UserPoints
const getOrCreateUserPoints = async (userId) => {
  let userPoints = await UserPoints.findOne({ user_id: userId });
  if (!userPoints) {
    userPoints = new UserPoints({ user_id: userId });
    await userPoints.save();
  }
  
  // Inicializar campos que no existen (compatibilidad con documentos antiguos)
  if (userPoints.daily_reports === undefined) userPoints.daily_reports = 0;
  if (userPoints.daily_collected === undefined) userPoints.daily_collected = 0;
  if (userPoints.weekly_reports === undefined) userPoints.weekly_reports = 0;
  if (userPoints.weekly_collected === undefined) userPoints.weekly_collected = 0;
  if (userPoints.monthly_reports === undefined) userPoints.monthly_reports = 0;
  if (userPoints.monthly_collected === undefined) userPoints.monthly_collected = 0;
  if (!userPoints.daily_family_reports) userPoints.daily_family_reports = {};
  if (!userPoints.daily_category_reports) userPoints.daily_category_reports = {};
  if (!userPoints.weekly_family_reports) userPoints.weekly_family_reports = {};
  if (!userPoints.weekly_category_reports) userPoints.weekly_category_reports = {};
  if (userPoints.eco_reports === undefined) userPoints.eco_reports = 0;
  if (userPoints.tech_reports === undefined) userPoints.tech_reports = 0;
  if (userPoints.heavy_reports === undefined) userPoints.heavy_reports = 0;
  if (userPoints.packaging_reports === undefined) userPoints.packaging_reports = 0;
  if (userPoints.reuse_reports === undefined) userPoints.reuse_reports = 0;
  if (userPoints.weekly_eco_reports === undefined) userPoints.weekly_eco_reports = 0;
  if (userPoints.weekly_tech_reports === undefined) userPoints.weekly_tech_reports = 0;
  if (userPoints.weekly_heavy_reports === undefined) userPoints.weekly_heavy_reports = 0;
  if (userPoints.weekly_packaging_reports === undefined) userPoints.weekly_packaging_reports = 0;
  if (userPoints.weekly_reuse_reports === undefined) userPoints.weekly_reuse_reports = 0;
  if (userPoints.monthly_eco_reports === undefined) userPoints.monthly_eco_reports = 0;
  if (userPoints.monthly_tech_reports === undefined) userPoints.monthly_tech_reports = 0;
  if (userPoints.monthly_heavy_reports === undefined) userPoints.monthly_heavy_reports = 0;
  if (userPoints.monthly_packaging_reports === undefined) userPoints.monthly_packaging_reports = 0;
  if (userPoints.monthly_reuse_reports === undefined) userPoints.monthly_reuse_reports = 0;
  if (!userPoints.challenge_last_reset) userPoints.challenge_last_reset = {};
  
  return userPoints;
};

// Obtener puntos del usuario actual
router.get('/my-points', authenticateToken, async (req, res) => {
  try {
    const userPoints = await getOrCreateUserPoints(req.user.id);
    
    // Resetear contadores temporales si es necesario
    resetCountersIfNeeded(userPoints);
    await userPoints.save();
    
    // Calcular división actual
    let division = 'Curioso Verde';
    for (const div of DIVISIONS) {
      if (userPoints.total_points >= div.minPoints && userPoints.total_points < div.maxPoints) {
        division = div.name;
        break;
      }
    }
    
    // Actualizar división si cambió
    if (userPoints.division !== division) {
      userPoints.division = division;
      await userPoints.save();
    }
    
    // Obtener logros del usuario
    const achievements = await Achievement.find({ user_id: req.user.id });
    const unlockedAchievementIds = achievements.map(a => a.achievement_id);
    
    // Marcar logros como desbloqueados o no
    const allAchievements = ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: unlockedAchievementIds.includes(ach.id),
      unlocked_at: achievements.find(a => a.achievement_id === ach.id)?.unlocked_at
    }));

    // Verificar desafíos completados y calcular progreso
    const completedChallenges = [];
    const challengeProgress = {};
    let challengesChanged = false;
    
    // Configuración de desafíos: verificar si se completan en el período actual
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    // Inicio de semana (lunes)
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - mondayOffset);
    
    // Inicio de mes
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Inicio de año
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    // Función para obtener el inicio del período según el tipo
    const getPeriodStart = (type) => {
      switch (type) {
        case 'daily': return today;
        case 'weekly': return weekStart;
        case 'monthly': return monthStart;
        case 'annual': return yearStart;
        default: return today;
      }
    };
    
    // Función para verificar si ya se contó en este período
    const wasAlreadyCounted = (challengeId, periodStart) => {
      const lastReset = userPoints.challenge_last_reset?.get(challengeId);
      if (!lastReset) return false;
      const lastResetDate = new Date(lastReset);
      lastResetDate.setHours(0, 0, 0, 0);
      return lastResetDate.getTime() >= periodStart.getTime();
    };
    
    // Función para verificar desafío y actualizar progreso
    const checkChallenge = (challengeId, config, isComplete) => {
      const challengeData = userPoints.challenges?.get(challengeId) || { completed: 0, trophies: 0 };
      const periodStart = getPeriodStart(config.type);
      const alreadyCounted = wasAlreadyCounted(challengeId, periodStart);
      
      // Verificar si se completó en el período actual
      const completedThisPeriod = isComplete;
      
      if (isComplete && !alreadyCounted) {
        // Primera vez que se completa en este período
        challengeData.completed += 1;
        userPoints.challenge_last_reset.set(challengeId, now);
        challengesChanged = true;
        
        // Si llegó al máximo de estrellas, incrementar copa y resetear estrellas
        if (challengeData.completed >= config.stars) {
          challengeData.trophies += 1;
          challengeData.completed = 0;
        }
      }
      
      // Guardar cambios en el mapa
      userPoints.challenges.set(challengeId, { completed: challengeData.completed, trophies: challengeData.trophies });
      
      // Marcar como completado este período para la card verde
      if (completedThisPeriod) {
        completedChallenges.push(challengeId);
      }
      
      challengeProgress[challengeId] = {
        completed: challengeData.completed,
        stars: config.stars,
        trophies: challengeData.trophies,
        type: config.type,
        completed_this_period: completedThisPeriod
      };
    };
    
    // === DESAFÍOS DIARIOS ===
    const dailyReports = userPoints.daily_reports || 0;
    const dailyCollected = userPoints.daily_collected || 0;
    const dailyFamilies = Object.values(userPoints.daily_family_reports || {}).filter(v => v > 0).length;
    const dailyCategories = Object.keys(userPoints.daily_category_reports || {}).length;
    const dailyBoth = Math.min(dailyReports, dailyCollected);
    const dailyEco = userPoints.daily_family_reports?.eco || 0;
    const dailyTech = userPoints.daily_family_reports?.tech || 0;
    const dailyHeavy = userPoints.daily_family_reports?.heavy || 0;
    
    checkChallenge('daily_report_3', { type: 'daily', stars: 7 }, dailyReports >= 3);
    checkChallenge('daily_report_5', { type: 'daily', stars: 7 }, dailyReports >= 5);
    checkChallenge('daily_collect_3', { type: 'daily', stars: 7 }, dailyCollected >= 3);
    checkChallenge('daily_collect_5', { type: 'daily', stars: 7 }, dailyCollected >= 5);
    checkChallenge('daily_families_2', { type: 'daily', stars: 7 }, dailyFamilies >= 2);
    checkChallenge('daily_families_3', { type: 'daily', stars: 7 }, dailyFamilies >= 3);
    checkChallenge('daily_speed', { type: 'daily', stars: 7 }, dailyCollected >= 3);
    checkChallenge('daily_variety', { type: 'daily', stars: 7 }, dailyCategories >= 2);
    checkChallenge('daily_both', { type: 'daily', stars: 7 }, dailyBoth >= 1);
    checkChallenge('daily_eco', { type: 'daily', stars: 7 }, dailyEco >= 2);
    checkChallenge('daily_tech', { type: 'daily', stars: 7 }, dailyTech >= 1);
    checkChallenge('daily_heavy', { type: 'daily', stars: 7 }, dailyHeavy >= 1);
    
    // === DESAFÍOS SEMANALES ===
    const weeklyReports = userPoints.weekly_reports || 0;
    const weeklyCollected = userPoints.weekly_collected || 0;
    const weeklyCategories = Object.keys(userPoints.weekly_category_reports || {}).length;
    const weeklyFamilies = Object.values(userPoints.weekly_family_reports || {}).filter(v => v > 0).length;
    const streak = userPoints.current_streak || 0;
    
    checkChallenge('weekly_report_10', { type: 'weekly', stars: 4 }, weeklyReports >= 10);
    checkChallenge('weekly_collect_10', { type: 'weekly', stars: 4 }, weeklyCollected >= 10);
    checkChallenge('weekly_categories_5', { type: 'weekly', stars: 4 }, weeklyCategories >= 5);
    checkChallenge('weekly_families_4', { type: 'weekly', stars: 4 }, weeklyFamilies >= 4);
    checkChallenge('weekly_streak', { type: 'weekly', stars: 4 }, streak >= 7);
    checkChallenge('weekly_eco_5', { type: 'weekly', stars: 4 }, (userPoints.weekly_eco_reports || 0) >= 5);
    checkChallenge('weekly_tech_3', { type: 'weekly', stars: 4 }, (userPoints.weekly_tech_reports || 0) >= 3);
    checkChallenge('weekly_heavy_2', { type: 'weekly', stars: 4 }, (userPoints.weekly_heavy_reports || 0) >= 2);
    checkChallenge('weekly_packaging_5', { type: 'weekly', stars: 4 }, (userPoints.weekly_packaging_reports || 0) >= 5);
    checkChallenge('weekly_reuse_3', { type: 'weekly', stars: 4 }, (userPoints.weekly_reuse_reports || 0) >= 3);
    checkChallenge('weekly_variety', { type: 'weekly', stars: 4 }, weeklyFamilies >= 3);
    checkChallenge('weekly_streak_5', { type: 'weekly', stars: 4 }, streak >= 5);
    checkChallenge('weekly_collect_5', { type: 'weekly', stars: 4 }, weeklyCollected >= 5);
    checkChallenge('weekly_speed', { type: 'weekly', stars: 4 }, weeklyCollected >= 3);
    
    // === DESAFÍOS MENSUALES ===
    const totalReports = userPoints.total_reports || 0;
    const totalCollected = userPoints.total_collected || 0;
    const familiesUsed = Object.values(userPoints.family_reports || {}).filter(v => v > 0).length;
    const maxStreak = userPoints.max_streak || 0;
    
    checkChallenge('monthly_report_50', { type: 'monthly', stars: 12 }, totalReports >= 50);
    checkChallenge('monthly_report_100', { type: 'monthly', stars: 12 }, totalReports >= 100);
    checkChallenge('monthly_collect_50', { type: 'monthly', stars: 12 }, totalCollected >= 50);
    checkChallenge('monthly_collect_100', { type: 'monthly', stars: 12 }, totalCollected >= 100);
    checkChallenge('monthly_families_5', { type: 'monthly', stars: 12 }, familiesUsed >= 5);
    checkChallenge('monthly_eco_15', { type: 'monthly', stars: 12 }, (userPoints.monthly_eco_reports || 0) >= 15);
    checkChallenge('monthly_tech_10', { type: 'monthly', stars: 12 }, (userPoints.monthly_tech_reports || 0) >= 10);
    checkChallenge('monthly_heavy_5', { type: 'monthly', stars: 12 }, (userPoints.monthly_heavy_reports || 0) >= 5);
    checkChallenge('monthly_packaging_15', { type: 'monthly', stars: 12 }, (userPoints.monthly_packaging_reports || 0) >= 15);
    checkChallenge('monthly_reuse_10', { type: 'monthly', stars: 12 }, (userPoints.monthly_reuse_reports || 0) >= 10);
    checkChallenge('monthly_variety', { type: 'monthly', stars: 12 }, familiesUsed >= 4);
    checkChallenge('monthly_streak_15', { type: 'monthly', stars: 12 }, maxStreak >= 15);
    checkChallenge('monthly_collect_15', { type: 'monthly', stars: 12 }, totalCollected >= 15);
    checkChallenge('monthly_speed', { type: 'monthly', stars: 12 }, totalCollected >= 10);
    checkChallenge('monthly_all_families', { type: 'monthly', stars: 12 }, familiesUsed >= 6);
    
    // === DESAFÍOS ANUALES ===
    const ecoReports = (userPoints.family_reports && userPoints.family_reports.eco) || 0;
    const techReports = (userPoints.family_reports && userPoints.family_reports.tech) || 0;
    const heavyReports = (userPoints.family_reports && userPoints.family_reports.heavy) || 0;
    
    checkChallenge('annual_eco_200', { type: 'annual', stars: 10 }, ecoReports >= 200);
    checkChallenge('annual_tech_100', { type: 'annual', stars: 10 }, techReports >= 100);
    checkChallenge('annual_heavy_80', { type: 'annual', stars: 10 }, heavyReports >= 80);
    checkChallenge('annual_all_500', { type: 'annual', stars: 10 }, totalReports >= 500);
    
    // Guardar si hubo cambios en desafíos
    if (challengesChanged) {
      userPoints.markModified('challenges');
      userPoints.markModified('challenge_last_reset');
      await userPoints.save();
    }
    
    res.json({
      points: userPoints,
      division,
      achievements: allAchievements,
      challengeProgress,
      divisions: DIVISIONS
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ranking de usuarios (top 15)
router.get('/ranking', authenticateToken, async (req, res) => {
  try {
    const topUsers = await UserPoints.find({ user_id: { $ne: null } })
      .sort({ total_points: -1 })
      .limit(15)
      .populate('user_id', 'name profile_image');
    
    const ranking = topUsers
      .filter(up => up.user_id)
      .map((up, index) => ({
        position: index + 1,
        user_id: up.user_id._id,
        name: up.user_id.name,
        profile_image: up.user_id.profile_image,
        total_points: up.total_points,
        division: up.division
      }));
    
    // Verificar si el usuario actual está en el ranking
    const userInRanking = ranking.find(r => r.user_id.toString() === req.user.id);
    
    if (!userInRanking) {
      // Obtener la posición del usuario actual
      const userPoints = await UserPoints.findOne({ user_id: req.user.id });
      const position = await UserPoints.countDocuments({ total_points: { $gt: userPoints.total_points } }) + 1;
      const user = await User.findById(req.user.id, 'name profile_image');
      
      ranking.push({
        position,
        user_id: req.user.id,
        name: user.name,
        profile_image: user.profile_image,
        total_points: userPoints.total_points,
        division: userPoints.division,
        isCurrentUser: true
      });
    }
    
    res.json({ ranking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar puntos por reportar
router.post('/add-report', authenticateToken, async (req, res) => {
  try {
    const { category, itemId } = req.body;
    const userPoints = await getOrCreateUserPoints(req.user.id);
    
    // Resetear contadores si es necesario
    resetCountersIfNeeded(userPoints);
    
    // Puntos base
    let points = 1;
    
    // Bonus por categoría crítica
    if (CRITICAL_CATEGORIES.includes(category)) {
      points += 3;
    }
    
    // Actualizar contadores
    userPoints.total_points += points;
    userPoints.report_points += points;
    userPoints.total_reports += 1;
    
    // Contadores temporales
    userPoints.daily_reports += 1;
    userPoints.weekly_reports += 1;
    userPoints.monthly_reports += 1;
    
    // Actualizar por categoría
    const currentCatPoints = userPoints.category_points.get(category) || 0;
    userPoints.category_points.set(category, currentCatPoints + points);
    
    const currentCatReports = userPoints.category_reports.get(category) || 0;
    userPoints.category_reports.set(category, currentCatReports + 1);
    
    // Actualizar por familia
    const family = CATEGORY_FAMILIES[category] || 'special';
    userPoints.family_reports[family] = (userPoints.family_reports[family] || 0) + 1;
    
    // Actualizar contadores por familia
    if (family === 'eco') userPoints.eco_reports += 1;
    if (family === 'tech') userPoints.tech_reports += 1;
    if (family === 'heavy') userPoints.heavy_reports += 1;
    if (family === 'packaging') userPoints.packaging_reports += 1;
    if (family === 'reuse') userPoints.reuse_reports += 1;
    
    // Actualizar contadores temporales de familia
    const currentDailyFamily = userPoints.daily_family_reports.get(family) || 0;
    userPoints.daily_family_reports.set(family, currentDailyFamily + 1);
    const currentWeeklyFamily = userPoints.weekly_family_reports.get(family) || 0;
    userPoints.weekly_family_reports.set(family, currentWeeklyFamily + 1);
    
    // Actualizar contadores semanales por familia
    if (family === 'eco') userPoints.weekly_eco_reports += 1;
    if (family === 'tech') userPoints.weekly_tech_reports += 1;
    if (family === 'heavy') userPoints.weekly_heavy_reports += 1;
    if (family === 'packaging') userPoints.weekly_packaging_reports += 1;
    if (family === 'reuse') userPoints.weekly_reuse_reports += 1;
    
    // Actualizar contadores mensuales por familia
    if (family === 'eco') userPoints.monthly_eco_reports += 1;
    if (family === 'tech') userPoints.monthly_tech_reports += 1;
    if (family === 'heavy') userPoints.monthly_heavy_reports += 1;
    if (family === 'packaging') userPoints.monthly_packaging_reports += 1;
    if (family === 'reuse') userPoints.monthly_reuse_reports += 1;
    
    // Actualizar contadores temporales de categoría
    const currentDailyCat = userPoints.daily_category_reports.get(category) || 0;
    userPoints.daily_category_reports.set(category, currentDailyCat + 1);
    const currentWeeklyCat = userPoints.weekly_category_reports.get(category) || 0;
    userPoints.weekly_category_reports.set(category, currentWeeklyCat + 1);
    
    // Actualizar streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = userPoints.last_activity_date ? new Date(userPoints.last_activity_date) : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        userPoints.current_streak += 1;
      } else if (diffDays > 1) {
        userPoints.current_streak = 1;
      }
    } else {
      userPoints.current_streak = 1;
    }
    
    if (userPoints.current_streak > userPoints.max_streak) {
      userPoints.max_streak = userPoints.current_streak;
    }
    
    userPoints.last_activity_date = new Date();
    userPoints.updated_at = new Date();
    
    // Actualizar división
    for (const div of DIVISIONS) {
      if (userPoints.total_points >= div.minPoints && userPoints.total_points < div.maxPoints) {
        userPoints.division = div.name;
        break;
      }
    }
    
    await userPoints.save();
    
    // Verificar logros
    await checkAchievements(req.user.id, userPoints);
    
    res.json({ 
      message: 'Puntos agregados', 
      points_added: points, 
      total_points: userPoints.total_points 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar puntos por recolectar
router.post('/add-collect', authenticateToken, async (req, res) => {
  try {
    const { category, itemId, createdAt } = req.body;
    const userPoints = await getOrCreateUserPoints(req.user.id);
    
    // Resetear contadores si es necesario
    resetCountersIfNeeded(userPoints);
    
    // Puntos base
    let points = 3;
    
    // Bonus por categoría crítica
    if (CRITICAL_CATEGORIES.includes(category)) {
      points += 3;
    }
    
    // Bonus por tiempo
    if (createdAt) {
      const itemDate = new Date(createdAt);
      const now = new Date();
      const hoursDiff = (now - itemDate) / (1000 * 60 * 60);
      
      if (hoursDiff < 1) {
        points += 3; // < 1h
      } else if (hoursDiff < 3) {
        points += 1; // < 3h
      } else if (hoursDiff < 6) {
        points += 2; // < 6h (bonus por rapidez)
      }
    }
    
    // Actualizar contadores
    userPoints.total_points += points;
    userPoints.collect_points += points;
    userPoints.total_collected += 1;
    
    // Contadores temporales
    userPoints.daily_collected += 1;
    userPoints.weekly_collected += 1;
    userPoints.monthly_collected += 1;
    
    // Actualizar por categoría
    const currentCatPoints = userPoints.category_points.get(category) || 0;
    userPoints.category_points.set(category, currentCatPoints + points);
    
    const currentCatCollected = userPoints.category_collected.get(category) || 0;
    userPoints.category_collected.set(category, currentCatCollected + 1);
    
    // Actualizar por familia
    const family = CATEGORY_FAMILIES[category] || 'special';
    userPoints.family_collected[family] = (userPoints.family_collected[family] || 0) + 1;
    
    // Actualizar contadores por familia
    if (family === 'eco') userPoints.eco_reports += 1;
    if (family === 'tech') userPoints.tech_reports += 1;
    if (family === 'heavy') userPoints.heavy_reports += 1;
    if (family === 'packaging') userPoints.packaging_reports += 1;
    if (family === 'reuse') userPoints.reuse_reports += 1;
    
    // Actualizar contadores temporales de familia
    const currentDailyFamily = userPoints.daily_family_reports.get(family) || 0;
    userPoints.daily_family_reports.set(family, currentDailyFamily + 1);
    const currentWeeklyFamily = userPoints.weekly_family_reports.get(family) || 0;
    userPoints.weekly_family_reports.set(family, currentWeeklyFamily + 1);
    
    // Actualizar contadores semanales por familia
    if (family === 'eco') userPoints.weekly_eco_reports += 1;
    if (family === 'tech') userPoints.weekly_tech_reports += 1;
    if (family === 'heavy') userPoints.weekly_heavy_reports += 1;
    if (family === 'packaging') userPoints.weekly_packaging_reports += 1;
    if (family === 'reuse') userPoints.weekly_reuse_reports += 1;
    
    // Actualizar contadores mensuales por familia
    if (family === 'eco') userPoints.monthly_eco_reports += 1;
    if (family === 'tech') userPoints.monthly_tech_reports += 1;
    if (family === 'heavy') userPoints.monthly_heavy_reports += 1;
    if (family === 'packaging') userPoints.monthly_packaging_reports += 1;
    if (family === 'reuse') userPoints.monthly_reuse_reports += 1;
    
    // Actualizar contadores temporales de categoría
    const currentDailyCat = userPoints.daily_category_reports.get(category) || 0;
    userPoints.daily_category_reports.set(category, currentDailyCat + 1);
    const currentWeeklyCat = userPoints.weekly_category_reports.get(category) || 0;
    userPoints.weekly_category_reports.set(category, currentWeeklyCat + 1);
    
    // Actualizar streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = userPoints.last_activity_date ? new Date(userPoints.last_activity_date) : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        userPoints.current_streak += 1;
      } else if (diffDays > 1) {
        userPoints.current_streak = 1;
      }
    } else {
      userPoints.current_streak = 1;
    }
    
    if (userPoints.current_streak > userPoints.max_streak) {
      userPoints.max_streak = userPoints.current_streak;
    }
    
    userPoints.last_activity_date = new Date();
    userPoints.updated_at = new Date();
    
    // Actualizar división
    for (const div of DIVISIONS) {
      if (userPoints.total_points >= div.minPoints && userPoints.total_points < div.maxPoints) {
        userPoints.division = div.name;
        break;
      }
    }
    
    await userPoints.save();
    
    // Verificar logros
    await checkAchievements(req.user.id, userPoints);
    
    res.json({ 
      message: 'Puntos agregados', 
      points_added: points, 
      total_points: userPoints.total_points 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar y desbloquear logros
async function checkAchievements(userId, userPoints) {
  const unlockedAchievements = await Achievement.find({ user_id: userId });
  const unlockedIds = unlockedAchievements.map(a => a.achievement_id);
  
  // Primer reporte
  if (userPoints.total_reports >= 1 && !unlockedIds.includes('first_report')) {
    await unlockAchievement(userId, 'first_report');
  }
  
  // Primera recolección
  if (userPoints.total_collected >= 1 && !unlockedIds.includes('first_collect')) {
    await unlockAchievement(userId, 'first_collect');
  }
  
  // Reportes
  if (userPoints.total_reports >= 10 && !unlockedIds.includes('reporter_10')) {
    await unlockAchievement(userId, 'reporter_10');
  }
  if (userPoints.total_reports >= 50 && !unlockedIds.includes('reporter_50')) {
    await unlockAchievement(userId, 'reporter_50');
  }
  if (userPoints.total_reports >= 100 && !unlockedIds.includes('reporter_100')) {
    await unlockAchievement(userId, 'reporter_100');
  }
  
  // Recolecciones
  if (userPoints.total_collected >= 10 && !unlockedIds.includes('collector_10')) {
    await unlockAchievement(userId, 'collector_10');
  }
  if (userPoints.total_collected >= 50 && !unlockedIds.includes('collector_50')) {
    await unlockAchievement(userId, 'collector_50');
  }
  if (userPoints.total_collected >= 100 && !unlockedIds.includes('collector_100')) {
    await unlockAchievement(userId, 'collector_100');
  }
  
  // Streaks
  if (userPoints.current_streak >= 3 && !unlockedIds.includes('streak_3')) {
    await unlockAchievement(userId, 'streak_3');
  }
  if (userPoints.current_streak >= 5 && !unlockedIds.includes('streak_5')) {
    await unlockAchievement(userId, 'streak_5');
  }
  if (userPoints.current_streak >= 10 && !unlockedIds.includes('streak_10')) {
    await unlockAchievement(userId, 'streak_10');
  }
  
  // Familia diversa
  const familiesUsed = Object.values(userPoints.family_reports).filter(v => v > 0).length;
  if (familiesUsed >= 4 && !unlockedIds.includes('family_diverse')) {
    await unlockAchievement(userId, 'family_diverse');
  }
  
  // Primero del día
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDailyReset = userPoints.last_daily_reset ? new Date(userPoints.last_daily_reset) : null;
  const isFirstOfDay = !lastDailyReset || lastDailyReset < today;
  if (isFirstOfDay && userPoints.daily_reports >= 1 && !unlockedIds.includes('first_of_day')) {
    await unlockAchievement(userId, 'first_of_day');
  }
}

async function unlockAchievement(userId, achievementId) {
  const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievementDef) return;
  
  const achievement = new Achievement({
    user_id: userId,
    achievement_id: achievementId,
    name: achievementDef.name,
    description: achievementDef.description,
    icon: achievementDef.icon,
    points_earned: achievementDef.points
  });
  
  await achievement.save();
  
  // Agregar puntos del logro
  await UserPoints.findOneAndUpdate(
    { user_id: userId },
    { $inc: { total_points: achievementDef.points } }
  );
}

module.exports = router;
