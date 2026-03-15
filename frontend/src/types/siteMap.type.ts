import type { IconType } from 'react-icons'

export type SiteMapLink = {
    label: string
    path: string
}

export type SiteMapColumn = {
    title: string
    icon: IconType
    links: SiteMapLink[]
}