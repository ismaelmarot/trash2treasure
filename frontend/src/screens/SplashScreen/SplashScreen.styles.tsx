import styled, { keyframes } from 'styled-components'
import { flex } from '@/mixins'
import { COLORS } from '@/constants'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

export const Container = styled.div`
  ${flex('column','center','center')}
  height: 100vh;
  background: ${COLORS.white};
  color: ${COLORS.black};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  animation: ${fadeIn} 0.5s ease;
`

export const AppIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 22px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: ${scaleIn} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`

export const AppName = styled.h2`
  font-size: 34px;
  font-weight: 800;
  margin: 1rem 0 0;
  background: linear-gradient(
    90deg,
    ${COLORS.black} 0%,
    ${COLORS.black} 40%,
    rgba(255, 255, 255, 0.8) 50%,
    ${COLORS.black} 60%,
    ${COLORS.black} 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${slideUp} 0.8s ease 0.2s both, shimmer 4s ease-in-out infinite;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

export const AppVersion = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${COLORS.greyDark};
  position: absolute;
  bottom: 60px;
`

export const Developer = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #bbb;
  position: absolute;
  bottom: 40px;
`

export const USP = styled.p`
  max-width: 320px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  margin: 0;
`

export const AnimatedLetter = styled.span<{ $visible: boolean }>`
  color: ${props => props.$visible ? COLORS.black : '#ccc'};
  transition: color 0.1s ease;
`

export const EcoPointsBadge = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${COLORS.primaryDark};
  padding: 12px 24px;
  border-radius: 25px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  animation: ${slideUp} 0.8s ease 0.8s both;
`

export const PointsValue = styled.span`
  font-size: 28px;
  font-weight: 700;
`

export const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 40px;
  animation: ${slideUp} 0.8s ease 1s both;
`

export const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${COLORS.primaryDark};
  opacity: 0.6;
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`
