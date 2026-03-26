import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { SidebarProps } from '../../types'
import { FaMap, FaSearch, FaPlus, FaBell, FaTrophy, FaUser } from 'react-icons/fa'
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
  const { t } = useTranslation();
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const navigationItems = [
    { label: t('nav.map'), path: '/app', icon: FaMap },
    { label: t('nav.search'), path: '/app/search', icon: FaSearch },
    { label: t('nav.add'), path: '/app/add', icon: FaPlus },
    { label: t('nav.activity'), path: '/app/activity', icon: FaBell },
    { label: t('nav.points'), path: '/app/points', icon: FaTrophy },
    { label: t('nav.profile'), path: '/app/profile', icon: FaUser, isProfile: true },
  ]

  return (
    <SidebarContainer $collapsed={collapsed}>

      <CollapseButton onClick={toggleSidebar} $collapsed={collapsed}>
        {collapsed ? <ICONS.arrowRight size={20} /> : <ICONS.closeIcon size={20} />}
      </CollapseButton>


      {navigationItems.map((item, index) => {
        const Icon = item.icon
        const active = location.pathname === item.path
        const isLast = index === navigationItems.length - 1
        const isProfile = item.isProfile

        const renderIcon = () => {
          if (isProfile) {
            if (user?.profile_image) {
              return (
                <UserAvatar $hasImage>
                  <AvatarImage src={user.profile_image} alt={user.name || 'Profile'} />
                </UserAvatar>
              )
            }
            if (user?.name) {
              return (
                <UserAvatar $bgColor={getAvatarColor(user.name)}>
                  {user.name.charAt(0).toUpperCase()}
                </UserAvatar>
              )
            }
          }
          return <Icon size={24} />
        }

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
              {renderIcon()}
            </StyledIcon>

            {!collapsed && item.label}
          </NavItem>
        )
      })}
    </SidebarContainer>
  )
}
