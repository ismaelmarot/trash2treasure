import styled, { keyframes } from 'styled-components'
import { flex } from '@/mixins'
import { COLORS, SPACING } from '@/constants'

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
  animation: ${slideUp} 0.8s ease 0.2s both;
`

export const AppVersion = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.primaryDark};
  background: ${COLORS.white};
  padding: 4px 12px;
  border-radius: ${SPACING.lg};
  margin-bottom: ${SPACING.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: ${slideUp} 0.8s ease 0.4s both;
`

export const USP = styled.p`
  max-width: 300px;
  font-size: 19px;
  font-weight: 500;
  color: ${COLORS.black};
  line-height: 1.4;
  text-align: center;
  animation: ${slideUp} 0.8s ease 0.6s both;
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
