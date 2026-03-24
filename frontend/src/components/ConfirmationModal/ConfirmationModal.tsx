import type { ConfirmationModalProps } from '@/interface'
import {
  ButtonGroup,
  IconContainer,
  Message,
  ModalContainer,
  Overlay,
  PrimaryButton,
  SecondaryButton,
  Title
} from './ConfirmationModal.styles'

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  isDanger = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <IconContainer $isDanger={isDanger}>
          {isDanger ? '⚠️' : '❓'}
        </IconContainer>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <SecondaryButton onClick={onCancel}>{cancelLabel}</SecondaryButton>
          <PrimaryButton $isDanger={isDanger} onClick={onConfirm}>
            {confirmLabel}
          </PrimaryButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
}