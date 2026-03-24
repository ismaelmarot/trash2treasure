import styled, { keyframes } from 'styled-components'
import { COLORS } from '@/constants'
import type { TrophiesTextProps } from '@/interface/trophiesTextProps.interface'

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
  background: ${COLORS.shadow};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`

export const Modal = styled.div<{ $unlocked?: boolean }>`
  background: ${COLORS.allWhite};
  border-radius: 24px;
  width: 100%;
  max-width: 320px;
  text-align: center;
  padding: 32px 24px;
  animation: ${slideUp} 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: ${props => props.$unlocked ? '3px solid #0071e3' : '3px solid #e0e0e0'};
`

export const Icon = styled.div<{ $unlocked?: boolean }>`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: ${props => props.$unlocked ? 1 : 0.4};
  filter: ${props => props.$unlocked ? 'none' : 'grayscale(100%)'};
`

export const Title = styled.h3<{ $unlocked?: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.$unlocked ? COLORS.black : COLORS.grey};
  margin: 0 0 8px 0;
`

export const Description = styled.p`
  font-size: 15px;
  color: ${COLORS.greyDark};
  margin: 0 0 24px 0;
  line-height: 1.5;
`

export const PointsBadge = styled.div<{ $unlocked?: boolean }>`
  display: inline-block;
  background: ${props => props.$unlocked ? '#0071e3' : '#e0e0e0'};
  color: ${props => props.$unlocked ? 'white' : COLORS.grey};
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 24px;
`

export const StatusText = styled.div<{ $unlocked?: boolean }>`
  font-size: 14px;
  color: ${props => props.$unlocked ? '#34c759' : COLORS.greyDark};
  font-weight: 600;
  margin-bottom: 24px;
`

export const CloseButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: #f0f0f0;
  color: ${COLORS.black};
  transition: all 0.2s ease;
  
  &:hover {
    background: #e0e0e0;
  }
`

export const TrophiesText = styled.div<TrophiesTextProps>`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ hasTrophies }) => (hasTrophies ? '#34c759' : COLORS.grey)};
`