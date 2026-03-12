import styled from 'styled-components'

export const BottomNavContainer = styled.nav`
  height: 60px;
  border-top: 1px solid #ddd;

  display: flex;
  justify-content: space-around;
  align-items: center;
`

export const BottomNavItem = styled.button<{ $active: boolean }>`
  border: none;
  background: none;
  cursor: pointer;

  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
`