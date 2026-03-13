import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '../../navigation'

import {
  SidebarContainer,
  NavItem,
} from './Sidebar.styles'

type SidebarProps = {
  collapsed: boolean
  toggleSidebar: () => void
}

export const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <SidebarContainer $collapsed={collapsed}>

      <button onClick={toggleSidebar}>
        ☰
      </button>

      {navigationItems.map(item => {

        const Icon = item.icon

        return (
          <NavItem
            key={item.path}
            $active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <Icon size={25} style={{ paddingRight:'.5rem' }} />
            {!collapsed && item.label}
          </NavItem>
        )
      })}

    </SidebarContainer>
  )
}