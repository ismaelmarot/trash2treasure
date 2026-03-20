import styled from 'styled-components'
import { COLORS } from '../../constants'

export const Wrapper = styled.div<{ $align?: string; $direction?: string }>`
    display: flex;
    flex-direction: ${props => props.$direction || 'row'};
    align-items: ${props => props.$align || 'center'};
    gap: 12px;
`

export const PostingLabel = styled.span`
    font-size: 13px;
    color: ${COLORS.greyDark};
    font-weight: 500;
    white-space: nowrap;
`

export const Container = styled.div<{ $isUrgent: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px ${COLORS.shadow};
    color: ${props => props.$isUrgent ? COLORS.danger : COLORS.black};
    background: ${props => props.$isUrgent ? COLORS.dangerBg : COLORS.white};
`

export const Time = styled.span`
    letter-spacing: 0.5px;
`
