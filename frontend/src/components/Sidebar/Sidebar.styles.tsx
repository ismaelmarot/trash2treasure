import styled from 'styled-components'
import { flex } from '../../mixins'

export const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ $collapsed }) => ($collapsed ? '70px' : '220px')};
  padding: 20px;
  background: #f5f5f5;
  transition: width 0.2s ease;
`

export const NavItem = styled.button<{ $active: boolean }>`
  ${flex('row','center','flex-start')}
  padding: 1rem 2rem;
  cursor: pointer;
  border-radius: 38px;
  border: none;
  font-size: 1.2rem;
  color: black;
  -webkit-tap-highlight-color: transparent;
  
  background: ${({ $active }) => ($active ? '#08a045' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'black')};

  &:last-child {
    ${flex('row','center','space-between')};
    margin-top: auto;
    background-color: black;
    border-radius: 38px;
    color: white;
    padding: 1rem 2rem 1rem;
  }
`