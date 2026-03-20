import { useState, useEffect } from 'react'
import type { ItemCountdownProps } from '../../interface'
import { FaClock } from 'react-icons/fa'
import { Container, ExpiredBadge, PostingLabel, Time, Wrapper } from './ItemCountdown.styles'

export function ItemCountdown({ 
  createdAt, 
  onExpire, 
  showIcon = true,
  align = 'flex-end',
  direction = 'row'
}: ItemCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [postingTime, setPostingTime] = useState<string>('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // Si no hay createdAt, no hacemos nada
    if (!createdAt) {
      setTimeLeft('')
      setPostingTime('')
      return
    }

    // Format posting time (local)
    const dateStr = createdAt.includes('T') ? createdAt : createdAt.replace(' ', 'T') + 'Z'
    const createdDate = new Date(dateStr)
    const timeFormatter = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    setPostingTime(timeFormatter.format(createdDate))

    const calculateTimeLeft = () => {
      const MAX_DURATION = 24 * 60 * 60 * 1000
      const expirationDate = new Date(createdDate.getTime() + MAX_DURATION)
      const now = new Date();
      
      let diff = expirationDate.getTime() - now.getTime()

      if (diff > MAX_DURATION) diff = MAX_DURATION;

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

      const formatted = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      setTimeLeft(formatted)
      
      setIsUrgent(hours < 1)
    };


    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [createdAt, onExpire])

  return (
    <Wrapper $align={align} $direction={direction}>
      <PostingLabel>Publicado {postingTime}</PostingLabel>
      {isExpired ? (
        <ExpiredBadge>Expirado</ExpiredBadge>
      ) : (
        <Container $isUrgent={isUrgent}>
          {showIcon && <FaClock size={10} />}
          <Time>{timeLeft}</Time>
        </Container>
      )}
    </Wrapper>
  )
}