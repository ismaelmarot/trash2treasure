// Achievements Services Index
// Import this in your routes to use achievements

export { eventBus, UserEventType } from './userEvents'
export type { UserEvent } from './userEvents'

export { ACHIEVEMENT_DEFINITIONS, getAchievementById } from './achievementDefinitions'
export type { AchievementDefinition } from './achievementDefinitions'

export { CHALLENGE_DEFINITIONS, getChallengesByType, getChallengeById } from './challengeDefinitions'
export type { ChallengeDefinition } from './challengeDefinitions'

export { 
  initializeAchievementEngine, 
  checkRelevantAchievements, 
  unlockAchievement,
  refreshUserCache
} from './achievementEngine'
