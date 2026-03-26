import { useTranslation } from 'react-i18next';
import {
  Overlay,
  Modal,
  Icon,
  Title,
  Message,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton
} from './OfflineModal.styles'

interface OfflineModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
}

export function OfflineModal({ 
  isOpen, 
  onConfirm, 
  onCancel,
  title,
  message,
}: OfflineModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Icon>📡</Icon>
        <Title>{title || t('offline.title')}</Title>
        <Message>{message || t('offline.message')}</Message>
        <ButtonGroup>
          <PrimaryButton onClick={onConfirm}>
            {t('offline.saveOffline')}
          </PrimaryButton>
          <SecondaryButton onClick={onCancel}>
            {t('common.cancel')}
          </SecondaryButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}
