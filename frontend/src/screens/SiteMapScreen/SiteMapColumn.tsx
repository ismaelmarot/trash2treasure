import { useNavigate } from 'react-router-dom'
import type { SiteMapColumn } from '../../types'
import {
    ColumnTitle,
    DirectoryColumn,
    DirectoryLink
} from './SiteMapScreen.styles'

type Props = {
    column: SiteMapColumn
}

export function SiteMapColumn({ column }: Props) {
    const navigate = useNavigate()
    const Icon = column.icon

    return (
        <DirectoryColumn>
        <ColumnTitle>
            <Icon size={14} /> {column.title}
        </ColumnTitle>

        {column.links.map(link => (
            <DirectoryLink
            key={link.path}
            onClick={() => navigate(link.path)}
            >
            {link.label}
            </DirectoryLink>
        ))}
        </DirectoryColumn>
    )
}