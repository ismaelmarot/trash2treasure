// Achievement Engine - Processes user events and unlocks achievements
import { UserEvent, UserEventType, eventBus } from './userEvents'
import { ACHIEVEMENT_DEFINITIONS, getAchievementById } from './achievementDefinitions'
import { CHALLENGE_DEFINITIONS, getChallengeById } from './challengeDefinitions'

const { UserPoints, Achievement } = require('@/db/models')

// Initialize event listeners
export function initializeAchievementEngine(): void {
  // Subscribe to relevant events
  eventBus.subscribe(UserEventType.REPORT_CREATED, handleReportCreated)
  eventBus.subscribe(UserEventType.REPORT_DELETED, handleReportDeleted)
  eventBus.subscribe(UserEventType.ITEM_CLAIMED, handleItemClaimed)
  eventBus.subscribe(UserEventType.ITEM_UNCLAIMED, handleItemUnclaimed)
}

async function handleReportCreated(event: UserEvent): Promise<void> {
  const { userId, data } = event
  
  try {
    const userPoints = await UserPoints.findOne({ user_id: userId })
    if (!userPoints) return

    // Check achievements
    await checkAndUnlockAchievements(userId, userPoints)

    // Check challenges
    await updateChallengeProgress(userId, userPoints, 'reports')
  } catch (error) {
    console.error('Error in handleReportCreated:', error)
  }
}

async function handleReportDeleted(event: UserEvent): Promise<void> {
  // For now, we don't revoke achievements when reports are deleted
  // This is intentional - achievements are permanent milestones
}

async function handleItemClaimed(event: UserEvent): Promise<void> {
  const { userId } = event
  
  try {
    const userPoints = await UserPoints.findOne({ user_id: userId })
    if (!userPoints) return

    // Check achievements
    await checkAndUnlockAchievements(userId, userPoints)

    // Check challenges
    await updateChallengeProgress(userId, userPoints, 'collected')
  } catch (error) {
    console.error('Error in handleItemClaimed:', error)
  }
}

async function handleItemUnclaimed(event: UserEvent): Promise<void> {
  // Similar to report deleted - don't revoke achievements
}

async function checkAndUnlockAchievements(userId: string, userPoints: any): Promise<void> {
  // Get already unlocked achievements
  const unlockedAchievements = await Achievement.find({ user_id: userId })
  const unlockedIds = unlockedAchievements.map(a => a.achievement_id)

  // Check each achievement definition
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    // Skip if already unlocked
    if (unlockedIds.includes(def.id)) continue

    // Check condition
    const achieved = checkAchievementCondition(def.condition, def.threshold, userPoints)
    
    if (achieved) {
      await unlockAchievement(userId, def)
    }
  }
}

function checkAchievementCondition(
  condition: string,
  threshold: number,
  userPoints: any
): boolean {
  switch (condition) {
    case 'totalReports':
      return (userPoints.total_reports || 0) >= threshold
    case 'totalCollected':
      return (userPoints.total_collected || 0) >= threshold
    case 'streak':
      return (userPoints.current_streak || 0) >= threshold
    case 'criticalReports':
      // Count critical categories
      const criticalCount = getCriticalReportsCount(userPoints)
      return criticalCount >= threshold
    case 'weeklyReports':
      return (userPoints.weekly_reports || 0) >= threshold
    case 'weeklyCollected':
      return (userPoints.weekly_collected || 0) >= threshold
    default:
      return false
  }
}

function getCriticalReportsCount(userPoints: any): number {
  const CRITICAL_CATEGORIES = ['batteries', 'electronics', 'construction', 'furniture']
  let count = 0
  const categoryPoints = userPoints.category_points || {}
  
  for (const cat of CRITICAL_CATEGORIES) {
    if (categoryPoints[cat]) {
      count += categoryPoints[cat]
    }
  }
  
  return count
}

async function unlockAchievement(userId: string, def: any): Promise<void> {
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
    
    // Add bonus points to user
    await UserPoints.findOneAndUpdate(
      { user_id: userId },
      { $inc: { total_points: def.points } }
    )
    
    console.log(`Achievement unlocked: ${def.id} for user ${userId}`)
  } catch (error) {
    console.error(`Error unlocking achievement ${def.id}:`, error)
  }
}

async function updateChallengeProgress(
  userId: string,
  userPoints: any,
  actionType: 'reports' | 'collected'
): Promise<void> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = getWeekStart(now)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Check all challenges and update progress
  for (const challenge of CHALLENGE_DEFINITIONS) {
    const progressKey = `challenge_progress.${challenge.id}`
    const completedKey = `challenge_completed.${challenge.id}`

    // Skip if already completed this period
    const user = await UserPoints.findOne({ user_id: userId })
    if (!user) continue

    const completedPeriod = user.get(completedKey)
    if (completedPeriod) {
      const periodStart = getPeriodStart(challenge.type, now)
      if (completedPeriod >= periodStart.getTime()) continue
    }

    // Calculate current progress
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

    // Check if completed
    const targetReports = challenge.target.reports || 0
    const targetCollected = challenge.target.collected || 0
    const targetTotal = targetReports + targetCollected

    if (currentProgress >= targetTotal) {
      // Award challenge reward
      await UserPoints.findOneAndUpdate(
        { user_id: userId },
        { $inc: { total_points: challenge.reward } }
      )
    }
  }
}

function getChallengeCount(
  userPoints: any,
  type: 'daily' | 'weekly' | 'monthly' | 'annual',
  category: 'reports' | 'collected'
): number {
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

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getPeriodStart(type: string, date: Date): Date {
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

export { checkAndUnlockAchievements, unlockAchievement }
