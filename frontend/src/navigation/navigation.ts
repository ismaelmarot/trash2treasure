import { useTranslation } from 'react-i18next';
import type { IconType } from 'react-icons'
import { FaMap, FaSearch, FaPlus, FaBell, FaUser, FaTrophy } from 'react-icons/fa'

type NavigationItem = {
  label: string
  path: string
  icon: IconType
}

export function useNavigationItems(): NavigationItem[] {
  const { t } = useTranslation();
  
  return [
    {
      label: t('nav.map'),
      path: '/app',
      icon: FaMap,
    },
    {
      label: t('nav.search'),
      path: '/app/search',
      icon: FaSearch,
    },
    {
      label: t('nav.add'),
      path: '/app/add',
      icon: FaPlus,
    },
    {
      label: t('nav.activity'),
      path: '/app/activity',
      icon: FaBell,
    },
    {
      label: t('nav.points'),
      path: '/app/points',
      icon: FaTrophy,
    },
    {
      label: t('nav.profile'),
      path: '/app/profile',
      icon: FaUser,
    },
  ]
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
