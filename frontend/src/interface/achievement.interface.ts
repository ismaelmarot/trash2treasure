export interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    points: number
    unlocked: boolean
    unlocked_at?: string
    stars?: number
    filled?: number
    trophies?: number
    type?: string
}