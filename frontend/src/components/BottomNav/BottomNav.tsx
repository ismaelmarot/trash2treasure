import { useBottomNav } from './useBottomNav'
import type { IconType } from 'react-icons'
import {
  BottomNavContainer,
  BottomNavItem,
  UserAvatar,
  AvatarImage,
} from './BottomNav.styles'

interface NavItem {
  label: string
  path: string
  icon: IconType
}

export const BottomNav = () => {
  const {
    navigationItems,
    handleNavigate,
    isActive,
    getProfileAvatar
  } = useBottomNav()

  const avatar = getProfileAvatar()

  return (
    <BottomNavContainer>
      {(navigationItems as NavItem[]).map(item => {
        const isProfileTab = item.path === '/app/profile'
        const Icon = item.icon

        return (
          <BottomNavItem
            key={item.path}
            $active={isActive(item.path)}
            onClick={() => handleNavigate(item.path)}
          >
            {isProfileTab && avatar.type === 'image' ? (
              <UserAvatar $hasImage>
                <AvatarImage src={avatar.src} alt="Profile" />
              </UserAvatar>
            ) : isProfileTab && avatar.type === 'initial' ? (
              <UserAvatar $bgColor={avatar.color}>
                {avatar.initial}
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
