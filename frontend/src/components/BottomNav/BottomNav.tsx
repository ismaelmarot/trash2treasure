import { Link, useLocation } from 'react-router-dom'
import { Nav } from './BottomNav.style'

export const BottomNav = () => {
  const location = useLocation()
  const items = [
    { path: '/', label: 'Map' },
    { path: '/search', label: 'Search' },
    { path: '/add', label: 'Add' },
    { path: '/activity', label: 'Activity' },
    { path: '/profile', label: 'Profile' },
  ]

  return (
    <Nav>
      {items.map(item => (
        <Link key={item.path} to={item.path} style={{ color: location.pathname === item.path ? 'green' : 'gray' }}>
          {item.label}
        </Link>
      ))}
    </Nav>
  )
}