// Achievement Definitions - Declarative configuration
// Add new achievements here, not in the engine

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  points: number
  condition: 'totalReports' | 'totalCollected' | 'streak' | 'criticalReports' | 'diversity' | 'weeklyReports' | 'weeklyCollected'
  threshold: number
  bonusPoints?: number // Extra points when achieved
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Report milestones
  {
    id: 'first_report',
    name: 'Primer Reporte',
    description: 'Reportaste tu primer tesoro',
    icon: '🌟',
    points: 10,
    condition: 'totalReports',
    threshold: 1
  },
  {
    id: 'reports_5',
    name: 'Recolector Serial',
    description: 'Reportaste 5 tesoros',
    icon: '📦',
    points: 25,
    condition: 'totalReports',
    threshold: 5
  },
  {
    id: 'reports_10',
    name: 'Reportero',
    description: 'Reportaste 10 tesoros',
    icon: '📰',
    points: 50,
    condition: 'totalReports',
    threshold: 10
  },
  {
    id: 'reports_25',
    name: 'Vigilante Verde',
    description: 'Reportaste 25 tesoros',
    icon: '🌿',
    points: 100,
    condition: 'totalReports',
    threshold: 25
  },
  {
    id: 'reports_50',
    name: 'Guardián del Medio',
    description: 'Reportaste 50 tesoros',
    icon: '🛡️',
    points: 200,
    condition: 'totalReports',
    threshold: 50
  },
  {
    id: 'reports_100',
    name: 'Eco Guerrero',
    description: 'Reportaste 100 tesoros',
    icon: '⚔️',
    points: 500,
    condition: 'totalReports',
    threshold: 100
  },

  // Collect milestones
  {
    id: 'first_collect',
    name: 'Primer Recolector',
    description: 'Reclamaste tu primer tesoro',
    icon: '🏆',
    points: 10,
    condition: 'totalCollected',
    threshold: 1
  },
  {
    id: 'collects_5',
    name: 'Coleccionista',
    description: 'Reclamaste 5 tesoros',
    icon: '📚',
    points: 25,
    condition: 'totalCollected',
    threshold: 5
  },
  {
    id: 'collects_10',
    name: 'Acumulador',
    description: 'Reclamaste 10 tesoros',
    icon: '🏅',
    points: 50,
    condition: 'totalCollected',
    threshold: 10
  },
  {
    id: 'collects_25',
    name: 'Maestro Recolector',
    description: 'Reclamaste 25 tesoros',
    icon: '🎖️',
    points: 100,
    condition: 'totalCollected',
    threshold: 25
  },
  {
    id: 'collects_50',
    name: 'Rey del Reciclaje',
    description: 'Reclamaste 50 tesoros',
    icon: '👑',
    points: 200,
    condition: 'totalCollected',
    threshold: 50
  },
  {
    id: 'collects_100',
    name: 'Legendario Verde',
    description: 'Reclamaste 100 tesoros',
    icon: '🌈',
    points: 500,
    condition: 'totalCollected',
    threshold: 100
  },

  // Streak achievements
  {
    id: 'streak_3',
    name: 'Racha de 3 Días',
    description: '3 días consecutivos报告ando',
    icon: '🔥',
    points: 30,
    condition: 'streak',
    threshold: 3
  },
  {
    id: 'streak_7',
    name: 'Semana Verde',
    description: '7 días consecutivos报告ando',
    icon: '📅',
    points: 75,
    condition: 'streak',
    threshold: 7
  },
  {
    id: 'streak_14',
    name: 'Quincena Eco',
    description: '14 días consecutivos报告ando',
    icon: '🌱',
    points: 150,
    condition: 'streak',
    threshold: 14
  },
  {
    id: 'streak_30',
    name: 'Mes Verde',
    description: '30 días consecutivos报告ando',
    icon: '🌳',
    points: 300,
    condition: 'streak',
    threshold: 30
  },

  // Critical categories
  {
    id: 'critical_3',
    name: 'Cuidador Peligroso',
    description: 'Reportaste 3 items de categorías críticas',
    icon: '⚠️',
    points: 40,
    condition: 'criticalReports',
    threshold: 3
  },
  {
    id: 'critical_10',
    name: 'Héroe Ambiental',
    description: 'Reportaste 10 items de categorías críticas',
    icon: '🦸',
    points: 100,
    condition: 'criticalReports',
    threshold: 10
  },

  // Weekly milestones
  {
    id: 'weekly_reports_10',
    name: 'Super Reportero',
    description: '10 reportes en una semana',
    icon: '🚀',
    points: 50,
    condition: 'weeklyReports',
    threshold: 10
  },
  {
    id: 'weekly_collects_5',
    name: 'Recolector Rápido',
    description: '5 reclamos en una semana',
    icon: '⚡',
    points: 40,
    condition: 'weeklyCollected',
    threshold: 5
  }
]

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENT_DEFINITIONS.find(a => a.id === id)
}
