import styled from 'styled-components'
import { flex } from '../../mixins'
import { APP_COLORS } from '../../constants'

export const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ $collapsed }) => ($collapsed ? '70px' : '220px')};
  padding: 10px;
  border-right: 1px solid ${APP_COLORS.grey};
  transition: width 0.2s ease;
  background: ${APP_COLORS.white};
`

export const NavItem = styled.button<{ $active: boolean; $collapsed: boolean; $isLast?: boolean }>`
  ${flex('row', 'center', 'flex-start')}
  cursor: pointer;
  border-radius: 38px;
  border: none;
  font-size: 1.2rem;
  -webkit-tap-highlight-color: transparent;
  background: ${({ $active }) => ($active ? APP_COLORS.primaryDark : 'transparent')};
  color: ${({ $active }) => ($active ? APP_COLORS.white : APP_COLORS.primaryDark)};
  transition: background 0.2s ease, color 0.2s ease;

  ${({ $collapsed }) =>
    $collapsed
      ? `
        width: 50px;
        height: 50px;
        justify-content: center;
        padding: 0;
      `
      : `
        width: 100%;
        height: 50px;
        padding: 0 1.5rem;
        justify-content: flex-start;
      `}

  &:hover {
    background: ${({ $active }) =>
      $active ? APP_COLORS.primaryDark : APP_COLORS.grey};
  }

  &:last-child {
    margin-top: auto;
  }
`

export const CollapseButton = styled.button<{ $collapsed: boolean }>`
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'end')};
  padding: 8px;
  font-size: 1rem;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${APP_COLORS.black};
  }
`

export const StyledIcon = styled.span<{ $collapsed: boolean; $isLast?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 1.2rem;

  svg {
    width: 2rem;
    height: 2rem;
    padding-right: ${({ $collapsed, $isLast }) =>
      $collapsed ? '0' : $isLast ? '1rem' : '.5rem'};
    transition: padding 0.2s ease;
  }
`