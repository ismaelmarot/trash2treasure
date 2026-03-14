import styled from 'styled-components'
import { COLORS, SPACING } from '../../constants'
import { flex, size } from '../../mixins'

export const Container = styled.div`
    ${flex('column','center','flex-start')}
    min-height: calc(100vh - 5rem);
    padding: ${SPACING.lg};
    background: ${COLORS.white};
`

export const Card = styled.div`
    width: 100%;
    max-width: 31.25rem;
    text-align: center;
    padding: ${SPACING.xxl};
    border-radius: ${SPACING.lg};
    box-shadow: 0 0.25rem 0.75rem ${COLORS.shadow};
    background: ${COLORS.allWhite};
`

export const Avatar = styled.div`
    ${size('5rem','5rem')}
  background: ${COLORS.primary};
  color: ${COLORS.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto ${SPACING.lg};
`

export const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${SPACING.xs};
`

export const Email = styled.p`
  color: #86868b;
  margin-bottom: ${SPACING.xxl};
`

export const Section = styled.div`
  text-align: left;
  border-top: 1px solid #d2d2d7;
  padding-top: ${SPACING.lg};
  margin-bottom: ${SPACING.xxl};
`

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: ${SPACING.md};
`

export const Button = styled.button`
  background: ${COLORS.primary};
  color: ${COLORS.white};
  border: none;
  padding: ${SPACING.sm} ${SPACING.lg};
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${COLORS.primaryDark};
  }
`

export const LogoutButton = styled.button`
  background: transparent;
  color: #ff3b30;
  border: 1px solid #ff3b30;
  padding: ${SPACING.sm} ${SPACING.lg};
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff3b30;
    color: ${COLORS.white};
  }
`

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${SPACING.sm} ${SPACING.md};
  background: #f5f5f7;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #eaeaeb;
  }
`

export const MenuIconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${COLORS.white};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.primary};
  margin-right: ${SPACING.md};
`

export const MenuLabel = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1d1d1f;
`