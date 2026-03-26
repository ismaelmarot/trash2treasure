// Challenge Definitions - Declarative configuration
// Add new challenges here, not in the engine

export interface ChallengeTarget {
  reports?: number
  collected?: number
}

export interface ChallengeDefinition {
  id: string
  name: string
  description: string
  icon: string
  type: 'daily' | 'weekly' | 'monthly' | 'annual'
  category: 'reports' | 'collected' | 'mixed'
  target: ChallengeTarget
  reward: number
  maxStars: number
}

export const CHALLENGE_DEFINITIONS: ChallengeDefinition[] = [
  // Daily challenges
  {
    id: 'daily_reports_1',
    name: 'Reportero Diario',
    description: 'Reporta 1 tesoro hoy',
    icon: '📝',
    type: 'daily',
    category: 'reports',
    target: { reports: 1 },
    reward: 15,
    maxStars: 1
  },
  {
    id: 'daily_reports_3',
    name: 'Triple Reporte',
    description: 'Reporta 3 tesoros hoy',
    icon: '📋',
    type: 'daily',
    category: 'reports',
    target: { reports: 3 },
    reward: 40,
    maxStars: 3
  },
  {
    id: 'daily_collects_1',
    name: 'Recolector Diario',
    description: 'Reclama 1 tesoro hoy',
    icon: '🎯',
    type: 'daily',
    category: 'collected',
    target: { collected: 1 },
    reward: 20,
    maxStars: 1
  },
  {
    id: 'daily_mixed_2',
    name: 'Doble Impacto',
    description: 'Reporta o reclama 2 tesoros hoy',
    icon: '⚡',
    type: 'daily',
    category: 'mixed',
    target: { reports: 1, collected: 1 },
    reward: 30,
    maxStars: 2
  },

  // Weekly challenges
  {
    id: 'weekly_reports_5',
    name: 'Semana de Reportes',
    description: 'Reporta 5 tesoros esta semana',
    icon: '📊',
    type: 'weekly',
    category: 'reports',
    target: { reports: 5 },
    reward: 75,
    maxStars: 5
  },
  {
    id: 'weekly_reports_10',
    name: 'Super Reportero Semanal',
    description: 'Reporta 10 tesoros esta semana',
    icon: '🚀',
    type: 'weekly',
    category: 'reports',
    target: { reports: 10 },
    reward: 150,
    maxStars: 10
  },
  {
    id: 'weekly_collects_3',
    name: 'Recolector de la Semana',
    description: 'Reclama 3 tesoros esta semana',
    icon: '🏆',
    type: 'weekly',
    category: 'collected',
    target: { collected: 3 },
    reward: 60,
    maxStars: 3
  },
  {
    id: 'weekly_collects_7',
    name: 'Recolector Pro',
    description: 'Reclama 7 tesoros esta semana',
    icon: '🌟',
    type: 'weekly',
    category: 'collected',
    target: { collected: 7 },
    reward: 140,
    maxStars: 7
  },

  // Monthly challenges
  {
    id: 'monthly_reports_20',
    name: 'Mensajero Verde',
    description: 'Reporta 20 tesoros este mes',
    icon: '📬',
    type: 'monthly',
    category: 'reports',
    target: { reports: 20 },
    reward: 200,
    maxStars: 20
  },
  {
    id: 'monthly_reports_50',
    name: 'Guardián Mensual',
    description: 'Reporta 50 tesoros este mes',
    icon: '🛡️',
    type: 'monthly',
    category: 'reports',
    target: { reports: 50 },
    reward: 500,
    maxStars: 50
  },
  {
    id: 'monthly_collects_15',
    name: 'Coleccionista del Mes',
    description: 'Reclama 15 tesoros este mes',
    icon: '📦',
    type: 'monthly',
    category: 'collected',
    target: { collected: 15 },
    reward: 180,
    maxStars: 15
  },
  {
    id: 'monthly_collects_30',
    name: 'Rey del Mes',
    description: 'Reclama 30 tesoros este mes',
    icon: '👑',
    type: 'monthly',
    category: 'collected',
    target: { collected: 30 },
    reward: 400,
    maxStars: 30
  }
]

export function getChallengesByType(type: 'daily' | 'weekly' | 'monthly' | 'annual'): ChallengeDefinition[] {
  return CHALLENGE_DEFINITIONS.filter(c => c.type === type)
}

export function getChallengeById(id: string): ChallengeDefinition | undefined {
  return CHALLENGE_DEFINITIONS.find(c => c.id === id)
}
