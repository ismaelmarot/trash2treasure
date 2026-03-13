import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '../../navigation'

import { IoMdClose } from "react-icons/io";
import { FaArrowRightFromBracket } from "react-icons/fa6";

import {
  SidebarContainer,
  NavItem,
  CollapseButton,
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

      <CollapseButton
        onClick={toggleSidebar}
        $collapsed={collapsed}>
        { collapsed ? <FaArrowRightFromBracket size={20} /> : <IoMdClose size={20} /> }
      </CollapseButton>

      {navigationItems.map(item => {

        const Icon = item.icon

        return (
          <NavItem
            key={item.path}
            $active={location.pathname === item.path}
            $collapsed={collapsed}
            onClick={() => navigate(item.path)}
          >
            <Icon
              size={25}
              style={{ paddingRight: collapsed ? '0' : '.5rem' }}
            />

            {!collapsed && item.label}

          </NavItem>
        )
      })}

    </SidebarContainer>
  )
}