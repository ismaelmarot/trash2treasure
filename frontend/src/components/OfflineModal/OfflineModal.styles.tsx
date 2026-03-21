import styled, { keyframes } from 'styled-components'
import { COLORS } from '@/constants'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`

export const Modal = styled.div`
  background: ${COLORS.allWhite};
  border-radius: 14px;
  width: 100%;
  max-width: 320px;
  text-align: center;
  padding: 24px;
  animation: ${slideUp} 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`

export const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

export const Title = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: ${COLORS.black};
  margin: 0 0 8px 0;
`

export const Message = styled.p`
  font-size: 13px;
  color: ${COLORS.greyDark};
  margin: 0 0 24px 0;
  line-height: 1.5;
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: ${COLORS.info};
  color: ${COLORS.allWhite};
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: ${COLORS.grey};
  color: ${COLORS.black};
  transition: all 0.2s ease;
  
  &:hover {
    background: #d1d1d6;
  }
`
