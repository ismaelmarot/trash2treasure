import styled from 'styled-components'

export const BottomNavContainer = styled.nav`
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  border-top: 1px solid #ddd;
  background: white;

  a {
    text-decoration: none;
    color: #444;
    font-size: 14px;
  }
`