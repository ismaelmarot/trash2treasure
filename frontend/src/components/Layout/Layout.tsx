import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, BottomNav } from '..'
import { useBreakpoint } from '../../hooks'
import { Container, Main, Content } from './Layout.styles'

export const Layout = () => {
  const { isMobile } = useBreakpoint()

  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(prev => !prev)
  }

  return (
    <Container>

      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
        />
      )}

      <Main $collapsed={!isMobile ? collapsed : false}>
        <Content>
          <Outlet />
        </Content>

        {isMobile && <BottomNav />}
      </Main>

    </Container>
  )
}