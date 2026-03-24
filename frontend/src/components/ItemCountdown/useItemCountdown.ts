import type { UseItemCountdownProps } from '@/interface'
import { useState, useEffect } from 'react'

export function useItemCountdown({ createdAt, onExpire }: UseItemCountdownProps) {
    const [timeLeft, setTimeLeft] = useState('')
    const [isUrgent, setIsUrgent] = useState(false)
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        if (!createdAt) {
        setTimeLeft('')
        return
        }

        const dateStr = createdAt.includes('T')
        ? createdAt
        : createdAt.replace(' ', 'T') + 'Z'

        const createdDate = new Date(dateStr)

        const calculateTimeLeft = () => {
        const MAX_DURATION = 24 * 60 * 60 * 1000
        const expirationDate = new Date(createdDate.getTime() + MAX_DURATION)
        const now = new Date()

        let diff = expirationDate.getTime() - now.getTime()

        if (diff > MAX_DURATION) diff = MAX_DURATION

        if (diff <= 0) {
            setTimeLeft('EXPIRADO')
            setIsExpired(true)
            setIsUrgent(false)

            if (onExpire) onExpire()
            return
        }

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        const formatted = `${hours.toString().padStart(2, '0')}h ${minutes
            .toString()
            .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`

        setTimeLeft(formatted)
        setIsUrgent(hours < 1)
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [createdAt, onExpire])

    return {
        timeLeft,
        isUrgent,
        isExpired
    }
}