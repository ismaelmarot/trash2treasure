import styled from 'styled-components'
import type { SidebarProps } from '../../types'

export const SidebarContainer = styled.aside<SidebarProps>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ collapsed }) => (collapsed ? '70px' : '220px')};
  padding: 20px;
  background: #f5f5f5;
  transition: width 0.2s ease;
`

export const NavItem = styled.button<{ active: boolean }>`
  border: none;
  padding: 10px;
  cursor: pointer;

  background: ${({ active }) => (active ? '#ddd' : 'transparent')};

  &:last-child {
    margin-top: auto;
    border: 3px solid black;
    border-radius: 38px;
  }
`