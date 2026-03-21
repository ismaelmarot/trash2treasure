import { useNavigate, useLocation } from 'react-router-dom'
import type { SidebarProps } from '../../types'
import { navigationItems } from '../../navigation'
import { ICONS } from '../../constants'
import { useAuth } from '@/hooks'
import {
  SidebarContainer,
  NavItem,
  CollapseButton,
  StyledIcon,
  UserAvatar,
  AvatarImage,
} from './Sidebar.styles'

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  return (
    <SidebarContainer $collapsed={collapsed}>

      <CollapseButton onClick={toggleSidebar} $collapsed={collapsed}>
        {collapsed ? <ICONS.bars size={20} /> : <ICONS.closeIcon size={20} />}
      </CollapseButton>


      {navigationItems.map((item, index) => {
        const Icon = item.icon
        const active = location.pathname === item.path
        const isLast = index === navigationItems.length - 1
        const isProfileTab = item.path === '/profile'

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
              {isProfileTab && user?.profile_image ? (
                <UserAvatar $hasImage>
                  <AvatarImage src={user.profile_image} alt="Profile" />
                </UserAvatar>
              ) : isProfileTab && user?.name ? (
                <UserAvatar $bgColor={getAvatarColor(user.name)}>
                  {user.name.charAt(0).toUpperCase()}
                </UserAvatar>
              ) : (
                <Icon />
              )}
            </StyledIcon>

            {!collapsed && item.label}
          </NavItem>
        )
      })}
    </SidebarContainer>
  )
}