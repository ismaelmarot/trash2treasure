import { StarRating } from '@/components/StarRating'
import {
  CloseButton,
  Description,
  Icon,
  Modal,
  Overlay,
  PointsBadge,
  StatusText,
  Title
} from './AchievementModal.styles'

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
  achievement: {
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
  } | null
}

export function AchievementModal({ isOpen, onClose, achievement }: AchievementModalProps) {
  if (!isOpen || !achievement) return null

  const isChallenge = achievement.type === 'challenge'

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()} $unlocked={achievement.unlocked}>
        <Icon $unlocked={achievement.unlocked}>{achievement.icon}</Icon>
        <Title $unlocked={achievement.unlocked}>{achievement.name}</Title>
        <Description>{achievement.description}</Description>
        
        {isChallenge && achievement.stars ? (
          <div style={{ margin: '16px 0' }}>
            <StarRating 
              total={achievement.stars} 
              filled={achievement.filled || 0} 
              maxStars={6}
              size={24}
            />
            <div style={{ 
              marginTop: '12px', 
              fontSize: '14px', 
              color: (achievement.trophies || 0) > 0 ? '#34c759' : '#999', 
              fontWeight: '600' 
            }}>
              🏆 {achievement.trophies || 0} {(achievement.trophies || 0) === 1 ? 'copa' : 'copas'}
            </div>
          </div>
        ) : (
          <>
            <PointsBadge $unlocked={achievement.unlocked}>
              {achievement.unlocked ? `+${achievement.points} pts` : `${achievement.points} pts`}
            </PointsBadge>
            
            <StatusText $unlocked={achievement.unlocked}>
              {achievement.unlocked 
                ? `Desbloqueado el ${new Date(achievement.unlocked_at!).toLocaleDateString('es-ES')}` 
                : 'Aún no desbloqueado'}
            </StatusText>
          </>
        )}
        
        <CloseButton onClick={onClose}>Cerrar</CloseButton>
      </Modal>
    </Overlay>
  )
}
