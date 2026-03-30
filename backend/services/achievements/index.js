// Achievements Services Index
const { eventBus, UserEventType } = require('./userEvents')
const { ACHIEVEMENT_DEFINITIONS, getAchievementById } = require('./achievementDefinitions')
const { CHALLENGE_DEFINITIONS, getChallengesByType, getChallengeById } = require('./challengeDefinitions')
const { initializeAchievementEngine, checkRelevantAchievements, unlockAchievement, refreshUserCache } = require('./achievementEngine')

module.exports = {
  eventBus,
  UserEventType,
  ACHIEVEMENT_DEFINITIONS,
  getAchievementById,
  CHALLENGE_DEFINITIONS,
  getChallengesByType,
  getChallengeById,
  initializeAchievementEngine,
  checkRelevantAchievements,
  unlockAchievement,
  refreshUserCache
}
