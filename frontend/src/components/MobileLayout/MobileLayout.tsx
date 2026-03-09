// src/components/MobileLayout.tsx
import styled from 'styled-components'

const Wrapper = styled.div`
  max-width: 420px;      /* ancho máximo móvil */
  height: 100vh;          /* altura de pantalla */
  margin: 0 auto;         /* centrado horizontal */
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  overflow: hidden;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;       /* scroll vertical */
`

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  )
}