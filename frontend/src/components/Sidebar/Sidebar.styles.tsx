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