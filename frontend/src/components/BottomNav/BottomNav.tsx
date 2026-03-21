import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '../../navigation/navigation'
import { useAuth } from '@/hooks'
import {
  BottomNavContainer,
  BottomNavItem,
  UserAvatar,
  AvatarImage,
} from './BottomNav.styles'

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  return (
    <BottomNavContainer>
      {navigationItems.map(item => {
        const isProfileTab = item.path === '/profile'
        const Icon = item.icon

        return (
          <BottomNavItem
            key={item.path}
            $active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            {isProfileTab && user?.profile_image ? (
              <UserAvatar $hasImage>
                <AvatarImage src={user.profile_image} alt="Profile" />
              </UserAvatar>
            ) : isProfileTab && user?.name ? (
              <UserAvatar $bgColor={getAvatarColor(user.name)}>
                {user.name.charAt(0).toUpperCase()}
              </UserAvatar>
            ) : (
              <Icon size={24} />
            )}
          </BottomNavItem>
        )
      })}
    </BottomNavContainer>
  )
}