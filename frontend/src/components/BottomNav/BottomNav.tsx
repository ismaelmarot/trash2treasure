import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '../../navigation/navigation'
import {
  BottomNavContainer,
  BottomNavItem,
} from './BottomNav.styles'

export const BottomNav = () => {

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <BottomNavContainer>

      {navigationItems.map(item => (
        <BottomNavItem
          key={item.path}
          active={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </BottomNavItem>
      ))}

    </BottomNavContainer>
  )
}