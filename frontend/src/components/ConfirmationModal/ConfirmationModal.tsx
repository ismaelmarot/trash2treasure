import styled, { keyframes } from 'styled-components';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 28px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const IconContainer = styled.div<{ $isDanger: boolean }>`
  font-size: 48px;
  margin-bottom: 20px;
  background: ${props => props.$isDanger ? 'rgba(255, 59, 48, 0.1)' : 'rgba(0, 113, 227, 0.1)'};
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 15px;
  color: #86868b;
  line-height: 1.5;
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
`;

const PrimaryButton = styled(Button)<{ $isDanger: boolean }>`
  background: ${props => props.$isDanger ? '#ff3b30' : '#0071e3'};
  color: white;
  
  &:hover {
    background: ${props => props.$isDanger ? '#d72d21' : '#0077ed'};
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f5f5f7;
  color: #1d1d1f;
  
  &:hover {
    background: #e5e5ea;
  }
`;
