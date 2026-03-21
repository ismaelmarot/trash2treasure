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
  title = 'Sin conexión a internet',
  message = 'Tu tesoro se guardará localmente y se publicará automáticamente cuando vuelvas a estar conectado.'
}: OfflineModalProps) {
  if (!isOpen) return null

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Icon>📡</Icon>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <PrimaryButton onClick={onConfirm}>
            Guardar offline
          </PrimaryButton>
          <SecondaryButton onClick={onCancel}>
            Cancelar
          </SecondaryButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}
