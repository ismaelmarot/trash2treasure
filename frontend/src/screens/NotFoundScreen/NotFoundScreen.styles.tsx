import styled from 'styled-components'
import { COLORS } from '@/constants'

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.background};
  padding: 20px;
`

export const Content = styled.div`
  text-align: center;
  max-width: 320px;
`

export const Icon = styled.div`
  font-size: 80px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`

export const Title = styled.h1`
  font-size: 72px;
  font-weight: 800;
  color: ${COLORS.primaryDark};
  margin: 0 0 8px 0;
  letter-spacing: -2px;
`

export const Description = styled.p`
  font-size: 16px;
  color: ${COLORS.greyDark};
  margin: 0 0 32px 0;
  line-height: 1.5;
`

export const HomeButton = styled.button`
  background: ${COLORS.primaryDark};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(66, 165, 159, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(66, 165, 159, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`
