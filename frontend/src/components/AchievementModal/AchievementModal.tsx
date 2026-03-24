import { StarRating } from '@/components/StarRating'
import type { AchievementModalProps } from '@/interface'
import {
  CloseButton,
  Description,
  Icon,
  Modal,
  Overlay,
  PointsBadge,
  StatusText,
  Title,
  TrophiesText
} from './AchievementModal.styles'

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
            <TrophiesText hasTrophies={(achievement.trophies || 0) > 0}>
              🏆 {achievement.trophies || 0} trofeos
            </TrophiesText>
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