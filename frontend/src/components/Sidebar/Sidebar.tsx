import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '../../layout'
import {
  SidebarContainer,
  NavItem,
} from './Sidebar.styles'

export const Sidebar = () => {

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <SidebarContainer>

      {navigationItems.map(item => (
        <NavItem
          key={item.path}
          active={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </NavItem>
      ))}

    </SidebarContainer>
  )
}