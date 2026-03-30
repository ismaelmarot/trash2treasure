// Achievement Engine - Optimized for performance
// - In-memory cache for unlocked achievements
// - Async processing (non-blocking)
// - Only checks relevant achievements per event

const { eventBus, UserEventType } = require('./userEvents')
const { ACHIEVEMENT_DEFINITIONS } = require('./achievementDefinitions')
const { CHALLENGE_DEFINITIONS } = require('./challengeDefinitions')

const { UserPoints, Achievement } = require('../../db/models')

// In-memory cache: userId -> Set of unlocked achievement IDs
const achievementCache = new Map()

// Initialize event listeners
function initializeAchievementEngine() {
  eventBus.subscribe(UserEventType.REPORT_CREATED, handleReportCreated)
  eventBus.subscribe(UserEventType.REPORT_DELETED, handleReportDeleted)
  eventBus.subscribe(UserEventType.ITEM_CLAIMED, handleItemClaimed)
  eventBus.subscribe(UserEventType.ITEM_UNCLAIMED, handleItemUnclaimed)
  
  // Warm up cache on startup
  warmUpCache()
  
  console.log('🏆 Achievement Engine initialized')
}

// Warm up cache from DB (runs once on startup)
async function warmUpCache() {
  try {
    const allAchievements = await Achievement.find({})
    for (const ach of allAchievements) {
      const userId = ach.user_id
      if (!achievementCache.has(userId)) {
        achievementCache.set(userId, new Set())
      }
      achievementCache.get(userId).add(ach.achievement_id)
    }
    console.log(`📦 Cache warmed: ${achievementCache.size} users loaded`)
  } catch (error) {
    console.error('Error warming up achievement cache:', error)
  }
}

// Async handler - doesn't block the main request
async function handleReportCreated(event) {
  const { userId, data } = event
  
  // Run in background - don't await
  setImmediate(async () => {
    try {
      const userPoints = await UserPoints.findOne({ user_id: userId })
      if (!userPoints) return

      // Only check relevant achievements for reports
      const relevantConditions = ['totalReports', 'streak', 'criticalReports', 'weeklyReports']
      await checkRelevantAchievements(userId, userPoints, relevantConditions)

      // Update challenges
      await updateRelevantChallenges(userId, userPoints, 'reports')
      
      // Update cache
      await updateCache(userId)
    } catch (error) {
      console.error('Error in handleReportCreated:', error)
    }
  })
}

async function handleReportDeleted(event) {
  // No achievements revoked - intentionally permanent
}

async function handleItemClaimed(event) {
  const { userId } = event
  
  setImmediate(async () => {
    try {
      const userPoints = await UserPoints.findOne({ user_id: userId })
      if (!userPoints) return

      // Only check relevant achievements for collected
      const relevantConditions = ['totalCollected', 'weeklyCollected']
      await checkRelevantAchievements(userId, userPoints, relevantConditions)

      // Update challenges
      await updateRelevantChallenges(userId, userPoints, 'collected')
      
      // Update cache
      await updateCache(userId)
    } catch (error) {
      console.error('Error in handleItemClaimed:', error)
    }
  })
}

async function handleItemUnclaimed(event) {
  // No achievements revoked
}

// Only check achievements that match the relevant conditions
async function checkRelevantAchievements(userId, userPoints, relevantConditions) {
  // Get cached unlocked achievements
  let cachedUnlocked = achievementCache.get(userId)
  if (!cachedUnlocked) {
    cachedUnlocked = new Set()
    achievementCache.set(userId, cachedUnlocked)
  }

  // Filter achievements to only relevant ones
  const relevantAchievements = ACHIEVEMENT_DEFINITIONS.filter(
    def => relevantConditions.includes(def.condition)
  )

  // Check only relevant achievements
  for (const def of relevantAchievements) {
    if (cachedUnlocked.has(def.id)) continue

    const achieved = checkAchievementCondition(def, userPoints)
    
    if (achieved) {
      await unlockAchievement(userId, def)
      cachedUnlocked.add(def.id)
    }
  }
}

function checkAchievementCondition(def, userPoints) {
  const threshold = def.threshold
  
  switch (def.condition) {
    case 'totalReports':
      return (userPoints.total_reports || 0) >= threshold
    case 'totalCollected':
      return (userPoints.total_collected || 0) >= threshold
    case 'streak':
      return (userPoints.current_streak || 0) >= threshold
    case 'criticalReports':
      return getCriticalReportsCount(userPoints) >= threshold
    case 'weeklyReports':
      return (userPoints.weekly_reports || 0) >= threshold
    case 'weeklyCollected':
      return (userPoints.weekly_collected || 0) >= threshold
    default:
      return false
  }
}

function getCriticalReportsCount(userPoints) {
  const CRITICAL_CATEGORIES = ['batteries', 'electronics', 'construction', 'furniture']
  const categoryPoints = userPoints.category_points || {}
  
  let count = 0
  for (const cat of CRITICAL_CATEGORIES) {
    if (categoryPoints[cat]) {
      count += categoryPoints[cat]
    }
  }
  
  return count
}

async function unlockAchievement(userId, def) {
  try {
    const achievement = new Achievement({
      user_id: userId,
      achievement_id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      points_earned: def.points,
      unlocked_at: new Date()
    })
    
    await achievement.save()
    
    // Add bonus points
    await UserPoints.findOneAndUpdate(
      { user_id: userId },
      { $inc: { total_points: def.points } }
    )
    
    console.log(`🏆 Achievement unlocked: ${def.id} for user ${userId}`)
  } catch (error) {
    console.error(`Error unlocking achievement ${def.id}:`, error)
  }
}

// Only update challenges relevant to this action type
async function updateRelevantChallenges(userId, userPoints, actionType) {
  const now = new Date()

  // Filter challenges to only those relevant to this action
  const relevantChallenges = CHALLENGE_DEFINITIONS.filter(
    c => c.category === actionType || c.category === 'mixed'
  )

  for (const challenge of relevantChallenges) {
    const progressKey = `challenge_progress.${challenge.id}`
    const completedKey = `challenge_completed.${challenge.id}`

    const user = await UserPoints.findOne({ user_id: userId })
    if (!user) continue

    // Check if already completed this period
    const completedPeriod = user.get(completedKey)
    if (completedPeriod) {
      const periodStart = getPeriodStart(challenge.type, now)
      if (completedPeriod >= periodStart.getTime()) continue
    }

    // Calculate progress
    let currentProgress = 0
    if (challenge.category === 'reports' || challenge.category === 'mixed') {
      currentProgress += getChallengeCount(userPoints, challenge.type, 'reports')
    }
    if (challenge.category === 'collected' || challenge.category === 'mixed') {
      currentProgress += getChallengeCount(userPoints, challenge.type, 'collected')
    }

    // Update progress
    await UserPoints.findOneAndUpdate(
      { user_id: userId },
      { 
        $set: { [progressKey]: currentProgress },
        $max: { [completedKey]: now.getTime() }
      }
    )

    // Check if completed and reward
    const targetTotal = (challenge.target.reports || 0) + (challenge.target.collected || 0)
    if (currentProgress >= targetTotal) {
      await UserPoints.findOneAndUpdate(
        { user_id: userId },
        { $inc: { total_points: challenge.reward } }
      )
    }
  }
}

function getChallengeCount(userPoints, type, category) {
  switch (type) {
    case 'daily':
      return category === 'reports' 
        ? (userPoints.daily_reports || 0)
        : (userPoints.daily_collected || 0)
    case 'weekly':
      return category === 'reports'
        ? (userPoints.weekly_reports || 0)
        : (userPoints.weekly_collected || 0)
    case 'monthly':
      return category === 'reports'
        ? (userPoints.monthly_reports || 0)
        : (userPoints.monthly_collected || 0)
    default:
      return 0
  }
}

function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getPeriodStart(type, date) {
  switch (type) {
    case 'daily':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    case 'weekly':
      return getWeekStart(date)
    case 'monthly':
      return new Date(date.getFullYear(), date.getMonth(), 1)
    default:
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
}

async function updateCache(userId) {
  try {
    const unlockedAchievements = await Achievement.find({ user_id: userId })
    const ids = new Set(unlockedAchievements.map(a => a.achievement_id))
    achievementCache.set(userId, ids)
  } catch (error) {
    console.error('Error updating cache for user', userId, error)
  }
}

// Force refresh cache for a user (call when needed)
async function refreshUserCache(userId) {
  await updateCache(userId)
}

module.exports = {
  initializeAchievementEngine,
  checkRelevantAchievements,
  unlockAchievement,
  refreshUserCache
}
