import styled, { keyframes } from 'styled-components'
import { COLORS } from '@/constants'

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

export const Overlay = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  z-index: 1000;
  animation: ${slideUp} 0.3s ease-out;
`

export const Card = styled.div`
  max-width: 480px;
  margin: 0 auto;
  background: ${COLORS.allWhite};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  position: relative;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`

export const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(114, 224, 172, 0.3);
`

export const InstallIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: ${COLORS.white};
`

export const TextContent = styled.div`
  flex: 1;
`

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 0 0 4px 0;
`

export const Description = styled.p`
  font-size: 14px;
  color: ${COLORS.greyDark};
  margin: 0;
  line-height: 1.4;
`

export const Benefits = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

export const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${COLORS.greyDark};
`

export const BenefitIcon = styled.svg`
  width: 16px;
  height: 16px;
  fill: ${COLORS.primaryDark};
  flex-shrink: 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 12px;
`

export const InstallButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: ${COLORS.white};
  background: linear-gradient(135deg, ${COLORS.info}, #0077ed);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

export const DismissButton = styled.button`
  flex: 0.6;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: ${COLORS.greyDark};
  background: ${COLORS.white};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid ${COLORS.grey};

  &:hover {
    background: ${COLORS.shadow};
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: ${COLORS.shadow};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s ease;

  &:hover {
    background: ${COLORS.grey};
  }
`

export const CloseIcon = styled.svg`
  width: 14px;
  height: 14px;
  fill: ${COLORS.greyDark};
`
