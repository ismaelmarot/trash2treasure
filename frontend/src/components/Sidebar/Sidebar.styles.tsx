import styled from 'styled-components'
import type { SidebarProps } from '../../types'

export const SidebarContainer = styled.aside<SidebarProps>`
  width: ${({ collapsed }) => (collapsed ? '70px' : '220px')};

  background: #f5f5f5;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  transition: width 0.2s ease;
`

export const NavItem = styled.button<{ active: boolean }>`
  border: none;
  padding: 10px;
  cursor: pointer;

  background: ${({ active }) => (active ? '#ddd' : 'transparent')};
`