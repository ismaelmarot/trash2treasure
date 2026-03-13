import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
`

export const Main = styled.main<{ $collapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin 0.2s ease;
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
`