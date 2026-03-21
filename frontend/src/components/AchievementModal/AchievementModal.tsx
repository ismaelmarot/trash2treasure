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
  } | null
}

export function AchievementModal({ isOpen, onClose, achievement }: AchievementModalProps) {
  if (!isOpen || !achievement) return null

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()} $unlocked={achievement.unlocked}>
        <Icon $unlocked={achievement.unlocked}>{achievement.icon}</Icon>
        <Title $unlocked={achievement.unlocked}>{achievement.name}</Title>
        <Description>{achievement.description}</Description>
        
        <PointsBadge $unlocked={achievement.unlocked}>
          {achievement.unlocked ? `+${achievement.points} pts` : `${achievement.points} pts`}
        </PointsBadge>
        
        <StatusText $unlocked={achievement.unlocked}>
          {achievement.unlocked 
            ? `Desbloqueado el ${new Date(achievement.unlocked_at!).toLocaleDateString('es-ES')}` 
            : 'Aún no desbloqueado'}
        </StatusText>
        
        <CloseButton onClick={onClose}>Cerrar</CloseButton>
      </Modal>
    </Overlay>
  )
}
