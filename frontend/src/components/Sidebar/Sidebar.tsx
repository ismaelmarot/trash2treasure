import { useNavigate, useLocation } from 'react-router-dom'
import type { SidebarProps } from '../../types'
import { navigationItems } from '../../navigation'
import { ICONS } from '../../constants'
import {
  SidebarContainer,
  NavItem,
  CollapseButton,
  StyledIcon,
} from './Sidebar.styles'

export const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <SidebarContainer $collapsed={collapsed}>

      <CollapseButton onClick={toggleSidebar} $collapsed={collapsed}>
        {collapsed ? <ICONS.arrowRight size={20} /> : <ICONS.closeIcon size={20} />}
      </CollapseButton>


      {navigationItems.map((item, index) => {
        const Icon = item.icon
        const active = location.pathname === item.path
        const isLast = index === navigationItems.length - 1

        return (
          <NavItem
            key={item.path}
            $active={active}
            $collapsed={collapsed}
            $isLast={isLast}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <StyledIcon $collapsed={collapsed} $isLast={isLast}>
              <Icon />
            </StyledIcon>

            {!collapsed && item.label}
          </NavItem>
        )
      })}
    </SidebarContainer>
  )
}