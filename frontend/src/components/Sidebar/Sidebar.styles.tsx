import styled from 'styled-components'
import { flex, size } from '../../mixins'
import { COLORS, SPACING } from '../../constants'

export const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  ${flex('column','center','center')}
  gap: 12px;
  width: ${({ $collapsed }) => ($collapsed ? '70px' : '220px')};
  padding: 10px;
  border-right: 1px solid ${COLORS.grey};
  transition: width 0.2s ease;
  background: ${COLORS.white};
`

export const NavItem = styled.button<{ $active: boolean; $collapsed: boolean; $isLast?: boolean }>`
  ${flex('row', 'center', 'flex-start')}
  cursor: pointer;
  border-radius: 38px;
  border: none;
  font-size: 1.2rem;
  -webkit-tap-highlight-color: transparent;
  background: ${({ $active }) => ($active ? COLORS.primaryDark : 'transparent')};
  color: ${({ $active }) => ($active ? COLORS.white : COLORS.primaryDark)};
  transition: background 0.2s ease, color 0.2s ease;

  ${({ $collapsed }) =>
    $collapsed
      ? `
        ${size('3rem','3rem')}
        justify-content: center;
        padding: 0;
      `
      : `
        ${size('100%','3.5rem')}
        justify-content: flex-start;
        padding: 0 1.5rem;
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
`

export const StyledIcon = styled.span<{ $collapsed: boolean; $isLast?: boolean }>`
  ${flex('column','center','center')}
  font-size: 1.2rem;

  svg {
    ${size('2rem','2rem')}
    padding-right: ${({ $collapsed, $isLast }) => $collapsed ? '0' : $isLast ? '1rem' : '.5rem'};
    transition: padding 0.2s ease;
  }
`

export const UserAvatar = styled.div<{ $hasImage?: boolean; $bgColor?: string }>`
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$hasImage ? 'transparent' : props.$bgColor || '#0071e3'};
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin-right: 0.5rem;
  flex-shrink: 0;
`

export const AvatarImage = styled.img`
  width: 2rem;
  height: 2rem;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`