const express = require('express');
const jwt = require('jsonwebtoken');
const { User, UserPoints, Achievement, Item, ChallengeDefinition, UserChallengeProgress, ACHIEVEMENTS, CHALLENGE_DEFINITIONS, initializeChallengeDefinitions } = require('../db/models');

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

// Obtener inicio del período según el tipo
const getPeriodStart = (type) => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  switch (type) {
    case 'daily':
      return today;
    case 'weekly': {
      const currentDay = now.getDay();
      const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - mondayOffset);
      return weekStart;
    }
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'annual':
      return new Date(now.getFullYear(), 0, 1);
    default:
      return today;
  }
};

// Obtener o crear UserPoints
const getOrCreateUserPoints = async (userId) => {
  let userPoints = await UserPoints.findOne({ user_id: userId });
  if (!userPoints) {
    userPoints = new UserPoints({ user_id: userId });
    await userPoints.save();
  }
  
  if (userPoints.daily_reports === undefined) userPoints.daily_reports = 0;
  if (userPoints.daily_collected === undefined) userPoints.daily_collected = 0;
  if (userPoints.family_reports === undefined) userPoints.family_reports = {};
  if (userPoints.daily_family_reports === undefined) userPoints.daily_family_reports = {};
  if (userPoints.daily_category_reports === undefined) userPoints.daily_category_reports = {};
  
  return userPoints;
};

// Calcular estadísticas del usuario para un período
const calculateUserStats = async (userId, periodStart, periodEnd) => {
  const items = await Item.find({
    user_id: userId,
    created_at: { $gte: periodStart, $lt: periodEnd }
  });
  
  const reports = items.length;
  const familiesSet = new Set();
  const familiesCount = {};
  
  for (const item of items) {
    const family = CATEGORY_FAMILIES[item.category] || 'special';
    familiesSet.add(family);
    familiesCount[family] = (familiesCount[family] || 0) + 1;
  }
  
  return {
    reports,
    families: familiesSet.size,
    familiesCount,
    categories: new Set(items.map(i => i.category)).size
  };
};

// Obtener o crear progreso de desafío
const getOrCreateChallengeProgress = async (userId, challenge, periodStart) => {
  let progress = await UserChallengeProgress.findOne({
    user_id: userId,
    challenge_id: challenge.id,
    period_start: periodStart
  });
  
  if (!progress) {
    progress = new UserChallengeProgress({
      user_id: userId,
      challenge_id: challenge.id,
      period_start: periodStart,
      period_type: challenge.type,
      current_progress: 0,
      stars: 0,
      trophies: 0,
      completed: false
    });
    await progress.save();
  }
  
  return progress;
};

// Actualizar progreso de un desafío
const updateChallengeProgress = async (userId, challenge, periodStart, newProgress) => {
  let progress = await getOrCreateChallengeProgress(userId, challenge, periodStart);
  
  progress.current_progress = newProgress;
  progress.last_updated = new Date();
  
  if (newProgress >= challenge.target && !progress.completed) {
    progress.stars += 1;
    
    if (progress.stars >= challenge.max_stars) {
      progress.trophies += 1;
      progress.stars = 0;
      progress.completed = true;
    }
  }
  
  await progress.save();
  return progress;
};

// Inicializar desafíos al iniciar el servidor
const initializeChallenges = async () => {
  try {
    await initializeChallengeDefinitions();
    console.log('Challenge definitions initialized');
  } catch (error) {
    console.error('Error initializing challenges:', error);
  }
};

// Llamar inicialización
initializeChallenges();

// Obtener puntos del usuario actual
router.get('/my-points', authenticateToken, async (req, res) => {
  try {
    const userPoints = await getOrCreateUserPoints(req.user.id);
    
    // Calcular división actual
    let division = 'Curioso Verde';
    for (const div of DIVISIONS) {
      if (userPoints.total_points >= div.minPoints && userPoints.total_points < div.maxPoints) {
        division = div.name;
        break;
      }
    }
    
    // Obtener logros del usuario
    const achievements = await Achievement.find({ user_id: req.user.id });
    const unlockedAchievementIds = achievements.map(a => a.achievement_id);
    
    const allAchievements = ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: unlockedAchievementIds.includes(ach.id),
      unlocked_at: achievements.find(a => a.achievement_id === ach.id)?.unlocked_at
    }));
    
    // Calcular y actualizar progreso de desafíos desde los items reales
    const now = new Date();
    const todayStart = getPeriodStart('daily');
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    const weekStart = getPeriodStart('weekly');
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const monthStart = getPeriodStart('monthly');
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    
    const yearStart = getPeriodStart('annual');
    const yearEnd = new Date(yearStart);
    yearEnd.setFullYear(yearEnd.getFullYear() + 1);
    
    // Calcular estadísticas de cada período
    const dailyStats = await calculateUserStats(req.user.id, todayStart, todayEnd);
    const weeklyStats = await calculateUserStats(req.user.id, weekStart, weekEnd);
    const monthlyStats = await calculateUserStats(req.user.id, monthStart, monthEnd);
    const yearStats = await calculateUserStats(req.user.id, yearStart, yearEnd);
    
    const challengeProgress = {};
    
    for (const challenge of CHALLENGE_DEFINITIONS) {
      let stats, progress = 0;
      let periodStart;
      
      switch (challenge.type) {
        case 'daily':
          stats = dailyStats;
          periodStart = todayStart;
          break;
        case 'weekly':
          stats = weeklyStats;
          periodStart = weekStart;
          break;
        case 'monthly':
          stats = monthlyStats;
          periodStart = monthStart;
          break;
        case 'annual':
          stats = yearStats;
          periodStart = yearStart;
          break;
        default:
          stats = dailyStats;
          periodStart = todayStart;
      }
      
      // Calcular progreso según la categoría
      switch (challenge.category) {
        case 'reports':
          progress = stats.reports;
          break;
        case 'collected':
          // Para collected usamos los contadores de userPoints
          if (challenge.type === 'daily') progress = userPoints.daily_collected || 0;
          else if (challenge.type === 'weekly') progress = userPoints.weekly_collected || 0;
          else if (challenge.type === 'monthly') progress = userPoints.monthly_collected || 0;
          else progress = userPoints.total_collected || 0;
          break;
        case 'families':
          progress = stats.families;
          break;
        case 'categories':
          progress = stats.categories;
          break;
        case 'eco':
          progress = stats.familiesCount['eco'] || 0;
          break;
        case 'tech':
          progress = stats.familiesCount['tech'] || 0;
          break;
        case 'heavy':
          progress = stats.familiesCount['heavy'] || 0;
          break;
        case 'packaging':
          progress = stats.familiesCount['packaging'] || 0;
          break;
        case 'reuse':
          progress = stats.familiesCount['reuse'] || 0;
          break;
        case 'streak':
          if (challenge.type === 'monthly') progress = userPoints.max_streak || 0;
          else progress = userPoints.current_streak || 0;
          break;
        default:
          progress = stats.reports;
      }
      
      // Actualizar progreso en la DB
      const userProgress = await getOrCreateChallengeProgress(req.user.id, challenge, periodStart);
      userProgress.current_progress = progress;
      userProgress.last_updated = now;
      
      // Si cumple el objetivo y no estaba completado, sumar estrella
      if (progress >= challenge.target && !userProgress.completed) {
        userProgress.stars += 1;
        
        // Si llegó al máximo de estrellas, dar copa y resetear
        if (userProgress.stars >= challenge.max_stars) {
          userProgress.trophies += 1;
          userProgress.stars = 0;
          userProgress.completed = true;
        }
      }
      
      await userProgress.save();
      
      challengeProgress[challenge.id] = {
        current_progress: progress,
        stars: userProgress.stars,
        trophies: userProgress.trophies,
        completed_this_period: progress >= challenge.target,
        max_stars: challenge.max_stars,
        target: challenge.target,
        type: challenge.type
      };
    }
    
    res.json({
      points: userPoints,
      division,
      achievements: allAchievements,
      challengeProgress,
      challenges: CHALLENGE_DEFINITIONS.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        icon: c.icon,
        type: c.type,
        target: c.target,
        reward: c.reward,
        max_stars: c.max_stars
      }))
    });
  } catch (error) {
    console.error('Error in my-points:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener ranking de usuarios
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
    
    const userInRanking = ranking.find(r => r.user_id.toString() === req.user.id);
    
    if (!userInRanking) {
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
    
    let points = 1;
    if (CRITICAL_CATEGORIES.includes(category)) {
      points += 3;
    }
    
    userPoints.total_points += points;
    userPoints.report_points += points;
    userPoints.total_reports += 1;
    userPoints.daily_reports += 1;
    userPoints.weekly_reports += 1;
    userPoints.monthly_reports += 1;
    
    const family = CATEGORY_FAMILIES[category] || 'special';
    userPoints.family_reports[family] = (userPoints.family_reports[family] || 0) + 1;
    
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
    
    for (const div of DIVISIONS) {
      if (userPoints.total_points >= div.minPoints && userPoints.total_points < div.maxPoints) {
        userPoints.division = div.name;
        break;
      }
    }
    
    await userPoints.save();
    checkAchievements(req.user.id, userPoints);
    
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
        points += 3;
      } else if (hoursDiff < 3) {
        points += 1;
      }
    }
    
    // Actualizar contadores
    userPoints.total_points += points;
    userPoints.collect_points += points;
    userPoints.total_collected += 1;
    userPoints.daily_collected += 1;
    userPoints.weekly_collected += 1;
    userPoints.monthly_collected += 1;
    
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
    
    // Actualizar desafíos de collected
    const todayStart = getPeriodStart('daily');
    const weekStart = getPeriodStart('weekly');
    const monthStart = getPeriodStart('monthly');
    
    const dailyCollected = userPoints.daily_collected || 0;
    const weeklyCollected = userPoints.weekly_collected || 0;
    const monthlyCollected = userPoints.monthly_collected || 0;
    
    for (const challenge of CHALLENGE_DEFINITIONS.filter(c => c.type === 'daily' && c.category === 'collected')) {
      await updateChallengeProgress(req.user.id, challenge, todayStart, dailyCollected);
    }
    
    for (const challenge of CHALLENGE_DEFINITIONS.filter(c => c.type === 'weekly' && c.category === 'collected')) {
      await updateChallengeProgress(req.user.id, challenge, weekStart, weeklyCollected);
    }
    
    for (const challenge of CHALLENGE_DEFINITIONS.filter(c => c.type === 'monthly' && c.category === 'collected')) {
      await updateChallengeProgress(req.user.id, challenge, monthStart, monthlyCollected);
    }
    
    // Verificar logros
    await checkAchievements(req.user.id, userPoints);
    
    res.json({ 
      message: 'Puntos agregados', 
      points_added: points, 
      total_points: userPoints.total_points 
    });
  } catch (error) {
    console.error('Error in add-collect:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar y desbloquear logros
async function checkAchievements(userId, userPoints) {
  const unlockedAchievements = await Achievement.find({ user_id: userId });
  const unlockedIds = unlockedAchievements.map(a => a.achievement_id);
  
  if (userPoints.total_reports >= 1 && !unlockedIds.includes('first_report')) {
    await unlockAchievement(userId, 'first_report');
  }
  
  if (userPoints.total_collected >= 1 && !unlockedIds.includes('first_collect')) {
    await unlockAchievement(userId, 'first_collect');
  }
  
  if (userPoints.total_reports >= 10 && !unlockedIds.includes('reporter_10')) {
    await unlockAchievement(userId, 'reporter_10');
  }
  
  if (userPoints.total_reports >= 50 && !unlockedIds.includes('reporter_50')) {
    await unlockAchievement(userId, 'reporter_50');
  }
  
  if (userPoints.total_reports >= 100 && !unlockedIds.includes('reporter_100')) {
    await unlockAchievement(userId, 'reporter_100');
  }
  
  if (userPoints.total_collected >= 10 && !unlockedIds.includes('collector_10')) {
    await unlockAchievement(userId, 'collector_10');
  }
  
  if (userPoints.total_collected >= 50 && !unlockedIds.includes('collector_50')) {
    await unlockAchievement(userId, 'collector_50');
  }
  
  if (userPoints.total_collected >= 100 && !unlockedIds.includes('collector_100')) {
    await unlockAchievement(userId, 'collector_100');
  }
  
  if (userPoints.current_streak >= 3 && !unlockedIds.includes('streak_3')) {
    await unlockAchievement(userId, 'streak_3');
  }
  
  if (userPoints.current_streak >= 5 && !unlockedIds.includes('streak_5')) {
    await unlockAchievement(userId, 'streak_5');
  }
  
  if (userPoints.current_streak >= 10 && !unlockedIds.includes('streak_10')) {
    await unlockAchievement(userId, 'streak_10');
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
  
  try {
    const achievement = new Achievement({
      user_id: userId,
      achievement_id: achievementId,
      name: achievementDef.name,
      description: achievementDef.description,
      icon: achievementDef.icon,
      points_earned: achievementDef.points
    });
    
    await achievement.save();
    
    await UserPoints.findOneAndUpdate(
      { user_id: userId },
      { $inc: { total_points: achievementDef.points } }
    );
  } catch (error) {
    // Achievement ya existe, ignorar
  }
}

module.exports = router;
