import type { IconType } from 'react-icons'
import { FaMap, FaSearch, FaPlus, FaBell, FaUser, FaTrophy } from 'react-icons/fa'

type NavigationItem = {
  label: string
  path: string
  icon: IconType
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Map',
    path: '/',
    icon: FaMap,
  },
  {
    label: 'Search',
    path: '/search',
    icon: FaSearch,
  },
  {
    label: 'Add',
    path: '/add',
    icon: FaPlus,
  },
  {
    label: 'Activity',
    path: '/activity',
    icon: FaBell,
  },
  {
    label: 'Points',
    path: '/points',
    icon: FaTrophy,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: FaUser,
  },
]