import styled from 'styled-components'

export const SidebarContainer = styled.aside`
  width: 220px;
  background: #f5f5f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const NavItem = styled.button<{ active: boolean }>`
  border: none;
  padding: 10px;
  cursor: pointer;

  background: ${({ active }) => (active ? '#ddd' : 'transparent')};
`