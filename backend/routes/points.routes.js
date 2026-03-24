const express = require('express');
const jwt = require('jsonwebtoken');
const { User, UserPoints, Item, Achievement, ChallengeDefinition, UserChallengeProgress, ACHIEVEMENTS, CHALLENGE_DEFINITIONS, initializeChallengeDefinitions } = require('../db/models');

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

// Helper para actualizar historial de gráficas
function updateHistory(userPoints, type, points) {
  const now = new Date();
  const dayKey = now.toISOString().split('T')[0]; // "2026-03-23"
  const weekKey = `${now.getFullYear()}-W${String(Math.ceil((now.getDate() - now.getDay() + 1) / 7)).padStart(2, '0')}`;
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // "2026-03"

  // Daily
  let dayEntry = userPoints.daily_history.find(e => e.period === dayKey);
  if (!dayEntry) {
    dayEntry = { period: dayKey, reports: 0, collected: 0, points: 0 };
    userPoints.daily_history.push(dayEntry);
  }
  dayEntry[type] += 1;
  dayEntry.points += points;
  // Mantener solo últimos 30 días
  if (userPoints.daily_history.length > 30) {
    userPoints.daily_history = userPoints.daily_history.slice(-30);
  }

  // Weekly
  let weekEntry = userPoints.weekly_history.find(e => e.period === weekKey);
  if (!weekEntry) {
    weekEntry = { period: weekKey, reports: 0, collected: 0, points: 0 };
    userPoints.weekly_history.push(weekEntry);
  }
  weekEntry[type] += 1;
  weekEntry.points += points;
  // Mantener solo últimas 12 semanas
  if (userPoints.weekly_history.length > 12) {
    userPoints.weekly_history = userPoints.weekly_history.slice(-12);
  }

  // Monthly
  let monthEntry = userPoints.monthly_history.find(e => e.period === monthKey);
  if (!monthEntry) {
    monthEntry = { period: monthKey, reports: 0, collected: 0, points: 0 };
    userPoints.monthly_history.push(monthEntry);
  }
  monthEntry[type] += 1;
  monthEntry.points += points;
  // Mantener solo últimos 12 meses
  if (userPoints.monthly_history.length > 12) {
    userPoints.monthly_history = userPoints.monthly_history.slice(-12);
  }
}

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
  try {
    let userPoints = await UserPoints.findOne({ user_id: userId });
    if (!userPoints) {
      userPoints = new UserPoints({ user_id: userId });
      await userPoints.save();
    }
    
    // Inicializar campos con defaults si no existen
    let needsSave = false;
    if (userPoints.daily_reports === undefined) { userPoints.daily_reports = 0; needsSave = true; }
    if (userPoints.daily_collected === undefined) { userPoints.daily_collected = 0; needsSave = true; }
    // No sobreescribir family_reports si ya tiene valores
    if (!userPoints.family_reports) { userPoints.family_reports = { eco: 0, tech: 0, heavy: 0, packaging: 0, reuse: 0, special: 0 }; needsSave = true; }
    if (!userPoints.category_points) { userPoints.category_points = {}; needsSave = true; }
    if (!userPoints.daily_family_reports) { userPoints.daily_family_reports = {}; needsSave = true; }
    if (!userPoints.daily_category_reports) { userPoints.daily_category_reports = {}; needsSave = true; }
    if (userPoints.weekly_reports === undefined) { userPoints.weekly_reports = 0; needsSave = true; }
    if (userPoints.weekly_collected === undefined) { userPoints.weekly_collected = 0; needsSave = true; }
    if (userPoints.weekly_reports_prev === undefined) { userPoints.weekly_reports_prev = 0; needsSave = true; }
    if (userPoints.weekly_collected_prev === undefined) { userPoints.weekly_collected_prev = 0; needsSave = true; }
    if (userPoints.weekly_report_points === undefined) { userPoints.weekly_report_points = 0; needsSave = true; }
    if (userPoints.weekly_collect_points === undefined) { userPoints.weekly_collect_points = 0; needsSave = true; }
    if (userPoints.weekly_report_points_prev === undefined) { userPoints.weekly_report_points_prev = 0; needsSave = true; }
    if (userPoints.weekly_collect_points_prev === undefined) { userPoints.weekly_collect_points_prev = 0; needsSave = true; }
    
    // Resetear contadores semanales si es nueva semana
    const weekStart = getPeriodStart('weekly');
    const lastWeekReset = userPoints.last_weekly_reset ? new Date(userPoints.last_weekly_reset) : null;
    
    if (!lastWeekReset || weekStart > lastWeekReset) {
      userPoints.weekly_reports_prev = userPoints.weekly_reports || 0;
      userPoints.weekly_collected_prev = userPoints.weekly_collected || 0;
      userPoints.weekly_report_points_prev = userPoints.weekly_report_points || 0;
      userPoints.weekly_collect_points_prev = userPoints.weekly_collect_points || 0;
      userPoints.weekly_reports = 0;
      userPoints.weekly_collected = 0;
      userPoints.weekly_report_points = 0;
      userPoints.weekly_collect_points = 0;
      userPoints.last_weekly_reset = weekStart;
      needsSave = true;
    }
    
    // Resetear contadores mensuales si es nuevo mes
    const monthStart = getPeriodStart('monthly');
    const lastMonthReset = userPoints.last_monthly_reset ? new Date(userPoints.last_monthly_reset) : null;
    
    if (!lastMonthReset || monthStart > lastMonthReset) {
      userPoints.monthly_reports = 0;
      userPoints.monthly_collected = 0;
      userPoints.last_monthly_reset = monthStart;
      needsSave = true;
    }
    
    if (needsSave) {
      await userPoints.save();
    }
    
    return userPoints;
  } catch (error) {
    console.error('Error in getOrCreateUserPoints:', error);
    throw error;
  }
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

// Obtener puntos del usuario actual (endpoint rápido)
router.get('/my-points', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Queries en paralelo
    const [userPoints, userItems] = await Promise.all([
      getOrCreateUserPoints(userId),
      Item.find({ user_id: userId }, 'category')
    ]);
    
    // Calcular puntos desde items
    const categoryPoints = {};
    let totalReportPoints = 0;
    const familyReports = { eco: 0, tech: 0, heavy: 0, packaging: 0, reuse: 0, special: 0 };
    
    userItems.forEach(item => {
      const pts = CRITICAL_CATEGORIES.includes(item.category) ? 4 : 1;
      categoryPoints[item.category] = (categoryPoints[item.category] || 0) + pts;
      totalReportPoints += pts;
      const family = CATEGORY_FAMILIES[item.category] || 'special';
      familyReports[family] = (familyReports[family] || 0) + 1;
    });
    
    const totalPoints = totalReportPoints + (userPoints.collect_points || 0);
    
    // División
    let division = 'Curioso Verde';
    for (const div of DIVISIONS) {
      if (totalPoints >= div.minPoints && totalPoints < div.maxPoints) {
        division = div.name;
        break;
      }
    }
    
    // Calcular weekly score desde el historial (que persiste aunque los items se borren)
    const now = new Date();
    const currentWeekKey = `${now.getFullYear()}-W${String(Math.ceil((now.getDate() - now.getDay() + 1) / 7)).padStart(2, '0')}`;
    const prevWeekStart = new Date(now);
    prevWeekStart.setDate(now.getDate() - now.getDay() - 6);
    const prevWeekKey = `${prevWeekStart.getFullYear()}-W${String(Math.ceil((prevWeekStart.getDate() - prevWeekStart.getDay() + 1) / 7)).padStart(2, '0')}`;
    
    const weeklyHistory = userPoints.weekly_history || [];
    const thisWeekEntry = weeklyHistory.find(e => e.period === currentWeekKey);
    const prevWeekEntry = weeklyHistory.find(e => e.period === prevWeekKey);
    
    const weeklyScore = (thisWeekEntry?.points || 0) + (userPoints.weekly_collect_points || 0);
    const prevWeeklyScore = (prevWeekEntry?.points || 0) + (userPoints.weekly_collect_points_prev || 0);
    const scoreChange = weeklyScore - prevWeeklyScore;
    
    let grade, gradeColor, gradeMessage;
    if (weeklyScore >= 50) { grade = 'A+++'; gradeColor = '#27ae60'; gradeMessage = 'Maestro del reciclaje'; }
    else if (weeklyScore >= 40) { grade = 'A++'; gradeColor = '#2ecc71'; gradeMessage = 'Reciclador experto'; }
    else if (weeklyScore >= 30) { grade = 'A+'; gradeColor = '#58d68d'; gradeMessage = 'Reciclador avanzado'; }
    else if (weeklyScore >= 20) { grade = 'A'; gradeColor = '#82e0aa'; gradeMessage = 'Reciclador activo'; }
    else if (weeklyScore >= 15) { grade = 'B'; gradeColor = '#f9e79f'; gradeMessage = 'Reciclador aprendiz'; }
    else if (weeklyScore >= 10) { grade = 'C'; gradeColor = '#f5b041'; gradeMessage = 'Reciclador principiante'; }
    else if (weeklyScore >= 5) { grade = 'D'; gradeColor = '#eb984e'; gradeMessage = 'Empezando a reciclar'; }
    else if (weeklyScore >= 2) { grade = 'E'; gradeColor = '#e74c3c'; gradeMessage = 'Novato verde'; }
    else if (weeklyScore >= 1) { grade = 'F'; gradeColor = '#c0392b'; gradeMessage = 'Primeros pasos'; }
    else { grade = 'G'; gradeColor = '#922b21'; gradeMessage = 'Aun no empiezas'; }
    
    res.json({
      points: {
        total_points: totalPoints,
        report_points: totalReportPoints,
        collect_points: userPoints.collect_points || 0,
        total_reports: userItems.length,
        total_collected: userPoints.total_collected || 0,
        category_points: categoryPoints,
        family_reports: familyReports,
        weekly_report_points: thisWeekEntry?.points || 0,
        weekly_collect_points: userPoints.weekly_collect_points || 0,
        weekly_reports: userPoints.weekly_reports || 0,
        weekly_collected: userPoints.weekly_collected || 0,
        current_streak: userPoints.current_streak || 0,
      },
      division,
      ecoScore: { grade, gradeColor, weeklyScore, prevWeeklyScore, scoreChange, trend: scoreChange > 0 ? 'up' : scoreChange < 0 ? 'down' : 'same', message: gradeMessage },
      history: {
        daily: userPoints.daily_history || [],
        weekly: userPoints.weekly_history || [],
        monthly: userPoints.monthly_history || []
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener logros y desafíos (endpoint separado, más lento)
router.get('/achievements-challenges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [userPoints, achievements] = await Promise.all([
      getOrCreateUserPoints(userId),
      Achievement.find({ user_id: userId })
    ]);
    
    const unlockedAchievementIds = achievements.map(a => a.achievement_id);
    const allAchievements = ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: unlockedAchievementIds.includes(ach.id),
      unlocked_at: achievements.find(a => a.achievement_id === ach.id)?.unlocked_at
    }));
    
    // Desafíos
    const dailyStart = getPeriodStart('daily');
    const weeklyStart = getPeriodStart('weekly');
    const monthlyStart = getPeriodStart('monthly');
    const annualStart = getPeriodStart('annual');
    const now = new Date();
    
    const challengeProgress = {};
    for (const challenge of CHALLENGE_DEFINITIONS) {
      let progress = 0;
      switch (challenge.category) {
        case 'reports': progress = challenge.type === 'daily' ? (userPoints.daily_reports || 0) : challenge.type === 'weekly' ? (userPoints.weekly_reports || 0) : challenge.type === 'monthly' ? (userPoints.monthly_reports || 0) : (userPoints.total_reports || 0); break;
        case 'collected': progress = challenge.type === 'daily' ? (userPoints.daily_collected || 0) : challenge.type === 'weekly' ? (userPoints.weekly_collected || 0) : challenge.type === 'monthly' ? (userPoints.monthly_collected || 0) : (userPoints.total_collected || 0); break;
        case 'streak': progress = userPoints.current_streak || 0; break;
        default: progress = 0;
      }
      
      const periodStart = challenge.type === 'daily' ? dailyStart : challenge.type === 'weekly' ? weeklyStart : challenge.type === 'monthly' ? monthlyStart : annualStart;
      const userProgress = await getOrCreateChallengeProgress(userId, challenge, periodStart);
      userProgress.current_progress = progress;
      userProgress.last_updated = now;
      if (progress >= challenge.target && !userProgress.completed) {
        userProgress.stars += 1;
        if (userProgress.stars >= challenge.max_stars) { userProgress.trophies += 1; userProgress.stars = 0; userProgress.completed = true; }
      }
      await userProgress.save();
      
      challengeProgress[challenge.id] = { current_progress: progress, stars: userProgress.stars, trophies: userProgress.trophies, completed_this_period: progress >= challenge.target, max_stars: challenge.max_stars, target: challenge.target, type: challenge.type };
    }
    
    res.json({
      achievements: allAchievements,
      challengeProgress,
      challenges: CHALLENGE_DEFINITIONS.map(c => ({ id: c.id, name: c.name, description: c.description, icon: c.icon, type: c.type, target: c.target, reward: c.reward, max_stars: c.max_stars }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ranking de usuarios
router.get('/ranking', authenticateToken, async (req, res) => {
  try {
    // Obtener todos los usuarios verificados
    const allUsers = await User.find({ is_verified: true }, 'name profile_image');
    
    // Obtener sus UserPoints
    const allPoints = await UserPoints.find({ 
      user_id: { $in: allUsers.map(u => u._id) } 
    });
    
    // Mapear puntos por user_id
    const pointsMap = {};
    allPoints.forEach(p => {
      pointsMap[p.user_id.toString()] = p;
    });

    // Combinar usuarios con sus puntos (0 si no tienen)
    const rankingData = allUsers.map(u => {
      const p = pointsMap[u._id.toString()];
      return {
        user_id: u._id,
        name: u.name,
        profile_image: u.profile_image,
        total_points: p ? p.total_points : 0,
        division: p ? p.division : 'Curioso Verde'
      };
    });

    // Ordenar por puntos descendente y limitar a 15
    rankingData.sort((a, b) => b.total_points - a.total_points);
    const top15 = rankingData.slice(0, 15).map((item, index) => ({
      ...item,
      position: index + 1
    }));

    // Si el usuario actual no está en el top 15, agregarlo al final
    const userInRanking = top15.find(r => r.user_id.toString() === req.user.id);
    
    if (!userInRanking) {
      const userIndex = rankingData.findIndex(r => r.user_id.toString() === req.user.id);
      if (userIndex !== -1) {
        top15.push({
          ...rankingData[userIndex],
          position: userIndex + 1,
          isCurrentUser: true
        });
      }
    }
    
    res.json({ ranking: top15 });
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
    userPoints.weekly_report_points += points;
    userPoints.total_reports += 1;
    userPoints.daily_reports += 1;
    userPoints.weekly_reports += 1;
    userPoints.monthly_reports += 1;
    
    const family = CATEGORY_FAMILIES[category] || 'special';
    userPoints.family_reports[family] = (userPoints.family_reports[family] || 0) + 1;
    userPoints.category_points[category] = (userPoints.category_points[category] || 0) + points;
    
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
    userPoints.markModified('category_points');
    userPoints.markModified('family_reports');
    userPoints.markModified('daily_history');
    userPoints.markModified('weekly_history');
    userPoints.markModified('monthly_history');
    updateHistory(userPoints, 'reports', points);
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

// Resetear puntos del usuario (fix para puntos duplicados)
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const userPoints = await UserPoints.findOne({ user_id: req.user.id });
    if (userPoints) {
      userPoints.total_points = 0;
      userPoints.report_points = 0;
      userPoints.collect_points = 0;
      userPoints.total_reports = 0;
      userPoints.total_collected = 0;
      userPoints.category_points = {};
      userPoints.category_reports = {};
      userPoints.category_collected = {};
      userPoints.family_reports = { eco: 0, tech: 0, heavy: 0, packaging: 0, reuse: 0, special: 0 };
      userPoints.family_collected = {};
      userPoints.daily_reports = 0;
      userPoints.daily_collected = 0;
      userPoints.weekly_reports = 0;
      userPoints.weekly_collected = 0;
      userPoints.monthly_reports = 0;
      userPoints.monthly_collected = 0;
      userPoints.current_streak = 0;
      userPoints.division = 'Curioso Verde';
      userPoints.markModified('category_points');
      userPoints.markModified('category_reports');
      userPoints.markModified('category_collected');
      userPoints.markModified('family_reports');
      userPoints.markModified('family_collected');
      await userPoints.save();
    }
    res.json({ message: 'Puntos reseteados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sincronizar puntos: recalcular siempre desde los items reales
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const userPoints = await getOrCreateUserPoints(req.user.id);
    const allItems = await Item.find({ user_id: req.user.id });

    // Resetear y recalcular desde cero
    userPoints.total_points = 0;
    userPoints.report_points = 0;
    userPoints.total_reports = 0;
    userPoints.category_points = {};
    userPoints.family_reports = { eco: 0, tech: 0, heavy: 0, packaging: 0, reuse: 0, special: 0 };
    userPoints.daily_history = [];
    userPoints.weekly_history = [];
    userPoints.monthly_history = [];

    const weekStart = getPeriodStart('weekly');
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    let thisWeekReportPoints = 0;
    let prevWeekReportPoints = 0;

    for (const item of allItems) {
      const points = CRITICAL_CATEGORIES.includes(item.category) ? 4 : 1;
      const family = CATEGORY_FAMILIES[item.category] || 'special';

      userPoints.total_points += points;
      userPoints.report_points += points;
      userPoints.total_reports += 1;
      userPoints.family_reports[family] = (userPoints.family_reports[family] || 0) + 1;
      userPoints.category_points[item.category] = (userPoints.category_points[item.category] || 0) + points;
      updateHistory(userPoints, 'reports', points);

      if (item.created_at) {
        const itemDate = new Date(item.created_at);
        if (itemDate >= weekStart) {
          thisWeekReportPoints += points;
        } else if (itemDate >= lastWeekStart) {
          prevWeekReportPoints += points;
        }
      }
    }

    userPoints.weekly_report_points = thisWeekReportPoints;
    userPoints.weekly_report_points_prev = prevWeekReportPoints;

    for (const div of DIVISIONS) {
      if (userPoints.total_points >= div.minPoints && userPoints.total_points < div.maxPoints) {
        userPoints.division = div.name;
        break;
      }
    }

    userPoints.markModified('category_points');
    userPoints.markModified('family_reports');
    userPoints.markModified('daily_history');
    userPoints.markModified('weekly_history');
    userPoints.markModified('monthly_history');
    userPoints.updated_at = new Date();
    await userPoints.save();
    checkAchievements(req.user.id, userPoints);

    res.json({
      message: 'Puntos sincronizados',
      items_count: allItems.length,
      total_points: userPoints.total_points,
      weekly_report_points: thisWeekReportPoints,
      prev_week_report_points: prevWeekReportPoints
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
    userPoints.weekly_collect_points += points;
    userPoints.total_collected += 1;
    userPoints.daily_collected += 1;
    userPoints.weekly_collected += 1;
    userPoints.monthly_collected += 1;
    
    updateHistory(userPoints, 'collected', points);
    userPoints.markModified('daily_history');
    userPoints.markModified('weekly_history');
    userPoints.markModified('monthly_history');
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
