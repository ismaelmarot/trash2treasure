import styled from 'styled-components'
import { flex, size } from '../../mixins'
import { COLORS, SPACING } from '../../constants'

export const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  ${flex('column','center','center')}
  gap: 8px;
  width: ${({ $collapsed }) => ($collapsed ? '80px' : '240px')};
  padding: 12px 8px;
  border-right: 1px solid ${COLORS.grey};
  transition: width 0.2s ease;
  background: ${COLORS.white};
`

export const NavItem = styled.button<{ $active: boolean; $collapsed: boolean; $isLast?: boolean }>`
  ${flex('row', 'center', 'flex-start')}
  cursor: pointer;
  border-radius: 38px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
  background: ${({ $active }) => ($active ? COLORS.primaryDark : 'transparent')};
  color: ${({ $active }) => ($active ? COLORS.white : COLORS.primaryDark)};
  transition: background 0.2s ease, color 0.2s ease;
  width: 100%;

  ${({ $collapsed }) =>
    $collapsed
      ? `
        ${size('52px','52px')}
        justify-content: center;
        padding: 0;
      `
      : `
        height: 52px;
        justify-content: flex-start;
        padding: 0 16px;
        gap: 12px;
      `}

  &:hover {
    background: ${({ $active }) =>
      $active ? COLORS.primaryDark : COLORS.grey};
  }

  &:last-child {
    margin-top: auto;
  }
`

export const CollapseButton = styled.button<{ $collapsed: boolean }>`
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'end')};
  padding: ${SPACING.sm};
  font-size: 1rem;
  border-radius: ${SPACING.sm};
  background: transparent;
  transition: background 0.2s ease;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-end')};
`

export const StyledIcon = styled.span<{ $collapsed: boolean; $isLast?: boolean; $isAvatar?: boolean }>`
  ${flex('column','center','center')}
  flex-shrink: 0;

  svg {
    ${size('24px','24px')}
  }
`

export const UserAvatar = styled.div<{ $bgColor?: string }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor || '#0071e3'};
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`
