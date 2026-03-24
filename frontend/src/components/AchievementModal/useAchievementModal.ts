import { useState } from 'react'
import { type Achievement } from '@/interface'

export function useAchievementModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [achievement, setAchievement] = useState<Achievement | null>(null)

    const openModal = (achievementData: Achievement) => {
        setAchievement(achievementData)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setAchievement(null)
    }

    const isChallenge = achievement?.type === 'challenge'

    return {
        isOpen,
        achievement,
        openModal,
        closeModal,
        isChallenge
    }
}