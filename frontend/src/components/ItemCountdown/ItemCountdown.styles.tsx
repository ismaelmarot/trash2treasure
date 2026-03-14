import styled from 'styled-components'
import { flex } from '../../mixins'
import { COLORS, SPACING } from '../../constants'

export const Wrapper = styled.div<{ $align: string }>`
    ${flex('column','center','center')}
    width: 100%;
    gap: 4px;
    align-items: ${props => props.$align};
`

export const PostingLabel = styled.span`
    font-size: 12px;
    color: ${COLORS.primaryDark};
    font-weight: 500;
`

export const Container = styled.div<{ $isUrgent: boolean }>`
    ${flex('row','center','center')}
    gap: ${SPACING.sm};
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    transition: all 0.3s ease;
    border: px solid ${props => props.$isUrgent ? COLORS.black : 'transparent'};
    color: ${props => props.$isUrgent ? COLORS.danger : COLORS.info};
    background: ${props => props.$isUrgent ? COLORS.black : COLORS.infoBg};
`

export const Time = styled.span`
    letter-spacing: 0.5px;
`