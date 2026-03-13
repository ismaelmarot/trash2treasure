import styled from 'styled-components'
import { flex, size } from '../../mixins'

export const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ $collapsed }) => ($collapsed ? '70px' : '220px')};
  padding: 10px;
  border-right: 1px solid black;
  background: #f5f5f5;
  transition: width 0.2s ease;
`

export const NavItem = styled.button<{ $active: boolean, $collapsed: boolean }>`
  ${flex('row','center','flex-start')}
  padding: ${({ $collapsed }) => ($collapsed ? '1rem' : '1rem 2rem')};
  cursor: pointer;
  border-radius: 38px;
  border: none;
  font-size: 1.2rem;

  -webkit-tap-highlight-color: transparent;

  background: ${({ $active }) => ($active ? '#08a045' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'black')};

  ${({ $collapsed }) =>
    $collapsed &&
    `
      justify-content: center;
    `}

  &:last-child {
    ${flex('row','center','space-between')};
    margin-top: auto;
    border-top: 1px solid black;
    border-radius: 0;

    svg {
      ${flex('row','center','center')}
      ${size('40px','40px')}
      padding: 8px;
      background-color: black;
      border-radius: 50%;
      font-size: 1.5rem;
      color: white;
    }
  }
`