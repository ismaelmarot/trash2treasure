import styled from 'styled-components'
import { flex, size } from '../../mixins'
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

export const NavItem = styled.button<{ $active: boolean, $collapsed: boolean }>`
  ${flex('row','center','flex-start')}
  padding: ${({ $collapsed }) => ($collapsed ? '1rem' : '1rem 2rem')};
  cursor: pointer;
  border-radius: 38px;
  border: none;
  font-size: 1.2rem;

  -webkit-tap-highlight-color: transparent;

  background: ${({ $active }) => ($active ? `${APP_COLORS.primaryDark}` : 'transparent')};
  color: ${({ $active }) => ($active ? `${APP_COLORS.white  }` : `${APP_COLORS.black}`)};

  ${({ $collapsed }) =>
    $collapsed &&
    `
      justify-content: center;
    `}

  &:last-child {
  margin-top: auto;
  font-size: 1rem;

  ${({ $collapsed }) =>
    !$collapsed &&
    `
      ${flex('row','center','space-between')};
      border-top: 1px solid ${APP_COLORS.grey};
      border-radius: 0;
    `}

  svg {
    ${flex('row','center','center')}
    ${({ $collapsed }) =>
      $collapsed
        ? `
          font-size: 25px;
          background: transparent;
          padding: 0;
        `
        : `
          ${size('40px','40px')}
          padding: 8px;
          background-color: ${APP_COLORS.primaryDark};
          border-radius: 50%;
          font-size: 1.2rem;
          color: ${APP_COLORS.white};
        `}
  }
}
`

export const CollapseButton = styled.button<{$collapsed: boolean }>`
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'end')};
`