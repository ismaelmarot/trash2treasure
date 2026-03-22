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

// Obtener o crear UserPoints
const getOrCreateUserPoints = async (userId) => {
  let userPoints = await UserPoints.findOne({ user_id: userId });
  if (!userPoints) {
    userPoints = new UserPoints({ user_id: userId });
    await userPoints.save();
  }
  return userPoints;
};

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
    
    // Configuración de desafíos con sus objetivos
    const challengeConfig = {
      // Diarios (7 estrellas)
      daily_report_3: { type: 'daily', stars: 7, getValue: () => Math.min(userPoints.daily_reports || 0, 3), target: 3 },
      daily_report_5: { type: 'daily', stars: 7, getValue: () => Math.min(userPoints.daily_reports || 0, 5), target: 5 },
      daily_collect_3: { type: 'daily', stars: 7, getValue: () => Math.min(userPoints.daily_collected || 0, 3), target: 3 },
      daily_collect_5: { type: 'daily', stars: 7, getValue: () => Math.min(userPoints.daily_collected || 0, 5), target: 5 },
      daily_families_2: { type: 'daily', stars: 7, getValue: () => Math.min(Object.values(userPoints.family_reports || {}).filter(v => v > 0).length, 2), target: 2 },
      daily_families_3: { type: 'daily', stars: 7, getValue: () => Math.min(Object.values(userPoints.family_reports || {}).filter(v => v > 0).length, 3), target: 3 },
      daily_speed: { type: 'daily', stars: 7, getValue: () => Math.min(userPoints.daily_collected || 0, 3), target: 3 },
      
      // Semanales (4 estrellas)
      weekly_report_10: { type: 'weekly', stars: 4, getValue: () => Math.min(Math.floor((userPoints.weekly_reports || 0) / 2.5), 4), target: 10 },
      weekly_collect_10: { type: 'weekly', stars: 4, getValue: () => Math.min(Math.floor((userPoints.weekly_collected || 0) / 2.5), 4), target: 10 },
      weekly_categories_5: { type: 'weekly', stars: 4, getValue: () => Math.min(Object.keys(userPoints.category_reports || {}).length, 5), target: 5 },
      weekly_families_4: { type: 'weekly', stars: 4, getValue: () => Math.min(Object.values(userPoints.family_reports || {}).filter(v => v > 0).length, 4), target: 4 },
      weekly_streak: { type: 'weekly', stars: 4, getValue: () => Math.min(userPoints.current_streak || 0, 7), target: 7 },
      
      // Mensuales (12 estrellas - 2 filas de 6)
      monthly_report_50: { type: 'monthly', stars: 12, getValue: () => Math.min(Math.floor((userPoints.total_reports || 0) / 4.17), 12), target: 50 },
      monthly_report_100: { type: 'monthly', stars: 12, getValue: () => Math.min(Math.floor((userPoints.total_reports || 0) / 8.33), 12), target: 100 },
      monthly_collect_50: { type: 'monthly', stars: 12, getValue: () => Math.min(Math.floor((userPoints.total_collected || 0) / 4.17), 12), target: 50 },
      monthly_collect_100: { type: 'monthly', stars: 12, getValue: () => Math.min(Math.floor((userPoints.total_collected || 0) / 8.33), 12), target: 100 },
      monthly_families_5: { type: 'monthly', stars: 12, getValue: () => Math.min(Math.floor((userPoints.total_reports || 0) / 4.17), 12), target: 50 },
      
      // Anuales (10 estrellas - 2 filas de 5)
      annual_eco_200: { type: 'annual', stars: 10, getValue: () => Math.min(Math.floor(((userPoints.family_reports && userPoints.family_reports.eco) || 0) / 20), 10), target: 200 },
      annual_tech_100: { type: 'annual', stars: 10, getValue: () => Math.min(Math.floor(((userPoints.family_reports && userPoints.family_reports.tech) || 0) / 10), 10), target: 100 },
      annual_heavy_80: { type: 'annual', stars: 10, getValue: () => Math.min(Math.floor(((userPoints.family_reports && userPoints.family_reports.heavy) || 0) / 8), 10), target: 80 },
      annual_all_500: { type: 'annual', stars: 10, getValue: () => Math.min(Math.floor((userPoints.total_reports || 0) / 50), 10), target: 500 }
    };
    
    // Calcular progreso de cada desafío
    for (const [challengeId, config] of Object.entries(challengeConfig)) {
      const progress = config.getValue();
      const challengeData = userPoints.challenges?.get(challengeId) || { completed: 0, trophies: 0 };
      
      // Si el progreso es igual al máximo de estrellas, marcar como completado
      if (progress >= config.stars) {
        completedChallenges.push(challengeId);
        challengeData.completed = config.stars;
        
        // Incrementar copas si es la primera vez que se completa
        if (challengeData.trophies === 0) {
          challengeData.trophies = 1;
        }
      } else {
        challengeData.completed = progress;
      }
      
      challengeProgress[challengeId] = {
        completed: challengeData.completed,
        stars: config.stars,
        trophies: challengeData.trophies,
        type: config.type,
        progress: progress,
        target: config.target
      };
    }
    
    res.json({
      points: userPoints,
      division,
      achievements: allAchievements,
      completedChallenges,
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
    const topUsers = await UserPoints.find()
      .sort({ total_points: -1 })
      .limit(15)
      .populate('user_id', 'name profile_image');
    
    const ranking = topUsers.map((up, index) => ({
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
    
    // Actualizar por categoría
    const currentCatPoints = userPoints.category_points.get(category) || 0;
    userPoints.category_points.set(category, currentCatPoints + points);
    
    const currentCatReports = userPoints.category_reports.get(category) || 0;
    userPoints.category_reports.set(category, currentCatReports + 1);
    
    // Actualizar por familia
    const family = CATEGORY_FAMILIES[category] || 'special';
    userPoints.family_reports[family] = (userPoints.family_reports[family] || 0) + 1;
    
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
    
    // Actualizar por categoría
    const currentCatPoints = userPoints.category_points.get(category) || 0;
    userPoints.category_points.set(category, currentCatPoints + points);
    
    const currentCatCollected = userPoints.category_collected.get(category) || 0;
    userPoints.category_collected.set(category, currentCatCollected + 1);
    
    // Actualizar por familia
    const family = CATEGORY_FAMILIES[category] || 'special';
    userPoints.family_collected[family] = (userPoints.family_collected[family] || 0) + 1;
    
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
