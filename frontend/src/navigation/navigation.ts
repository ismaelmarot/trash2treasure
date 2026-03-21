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
    path: '/app',
    icon: FaMap,
  },
  {
    label: 'Search',
    path: '/app/search',
    icon: FaSearch,
  },
  {
    label: 'Add',
    path: '/app/add',
    icon: FaPlus,
  },
  {
    label: 'Activity',
    path: '/app/activity',
    icon: FaBell,
  },
  {
    label: 'Points',
    path: '/app/points',
    icon: FaTrophy,
  },
  {
    label: 'Profile',
    path: '/app/profile',
    icon: FaUser,
  },
]