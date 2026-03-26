import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaMap, FaSearch, FaPlus, FaBell, FaTrophy, FaUser } from 'react-icons/fa'
import { useAuth } from '@/hooks'
import { AVATAR_COLORS } from '@/constants'

function getAvatarColor(name: string): string {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function useBottomNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation();
    const { user } = useAuth()

    const navigationItems = [
        { label: t('nav.map'), path: '/app', icon: FaMap },
        { label: t('nav.search'), path: '/app/search', icon: FaSearch },
        { label: t('nav.add'), path: '/app/add', icon: FaPlus },
        { label: t('nav.activity'), path: '/app/activity', icon: FaBell },
        { label: t('nav.points'), path: '/app/points', icon: FaTrophy },
        { label: t('nav.profile'), path: '/app/profile', icon: FaUser },
    ]

    const handleNavigate = (path: string) => {
        navigate(path)
    }

    const isActive = (path: string) => {
        return location.pathname === path
    }

    const getProfileAvatar = () => {
        if (!user) return { type: 'icon' }

        if (user.profile_image) {
            return {
                type: 'image',
                src: user.profile_image
            }
        }

        if (user.name) {
            return {
                type: 'initial',
                initial: user.name.charAt(0).toUpperCase(),
                color: getAvatarColor(user.name)
            }
        }

        return { type: 'icon' }
    }

    return {
        navigationItems,
        handleNavigate,
        isActive,
        getProfileAvatar
    }
}
