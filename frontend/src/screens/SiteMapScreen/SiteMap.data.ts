import { ICONS } from '../../constants'
import type { SiteMapColumn } from '../../types'

export const sitemapColumns: SiteMapColumn[] = [
    {
        title: 'Explorar',
        icon: ICONS.mapMarker,
        links: [
            { label: 'Mapa Principal', path: '/' },
            { label: 'Buscar Tesoros', path: '/search' },
            { label: 'Publicar un Tesoro', path: '/add' }
        ]
    },
    {
        title: 'Tu Cuenta',
        icon: ICONS.user,
        links: [
            { label: 'Perfil de Usuario', path: '/profile' },
            { label: 'Tu Actividad', path: '/activity' },
            { label: 'Iniciar Sesión', path: '/login' },
            { label: 'Crear Cuenta', path: '/register' }
        ]
    },
    {
        title: 'Proyecto',
        icon: ICONS.iconCircle,
        links: [
            { label: 'Acerca de Trash2Treasure', path: '/about' },
            { label: 'Pantalla de Bienvenida', path: '/welcome' }
        ]
    },
    {
        title: 'Legal',
        icon: ICONS.shielIcon,
        links: [
            { label: 'Privacy Policy', path: '/legal/privacy' },
            { label: 'Terms of Use', path: '/legal/terms' },
            { label: 'Software License Agreements', path: '/legal/license' },
            { label: 'Ethics & Compliance', path: '/legal/ethics' },
            { label: 'Legal Information', path: '/legal/legal' },
            { label: 'Site Map', path: '/sitemap' }
        ]
    }
]