import { flex } from '@/mixins'
import styled from 'styled-components'

export const ValidationList = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`

export const ValidationItem = styled.div<{ $valid: boolean }>`
    ${flex('row','center','flex-start')}
    gap: 4px;
    margin-left: 1rem;
    font-size: 11px;
    color: ${props => props.$valid ? '#28a745' : '#86868b'};
    transition: color 0.2s ease;
`

export const Text = styled.span`
    padding-left: 2px;
`