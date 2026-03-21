import { ICONS } from '@/constants'
import type { SiteMapColumn } from '@/types'

export const sitemapColumns: SiteMapColumn[] = [
    {
        title: 'Explorar',
        icon: ICONS.mapMarker,
        links: [
            { label: 'Mapa Principal', path: '/app' },
            { label: 'Buscar Tesoros', path: '/app/search' },
            { label: 'Publicar un Tesoro', path: '/app/add' }
        ]
    },
    {
        title: 'Tu Cuenta',
        icon: ICONS.user,
        links: [
            { label: 'Perfil de Usuario', path: '/app/profile' },
            { label: 'Tu Actividad', path: '/app/activity' },
            { label: 'Iniciar Sesión', path: '/login' },
            { label: 'Crear Cuenta', path: '/register' }
        ]
    },
    {
        title: 'Proyecto',
        icon: ICONS.iconCircle,
        links: [
            { label: 'Acerca de Trash2Treasure', path: '/app/about' },
            { label: 'Pantalla de Bienvenida', path: '/welcome' }
        ]
    },
    {
        title: 'Legal',
        icon: ICONS.shielIcon,
        links: [
            { label: 'Privacy Policy', path: '/app/legal/privacy' },
            { label: 'Terms of Use', path: '/app/legal/terms' },
            { label: 'Software License Agreements', path: '/app/legal/license' },
            { label: 'Ethics & Compliance', path: '/app/legal/ethics' },
            { label: 'Legal Information', path: '/app/legal/legal' },
            { label: 'Site Map', path: '/app/sitemap' }
        ]
    }
]