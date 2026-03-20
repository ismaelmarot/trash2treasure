import styled from 'styled-components'
import { COLORS } from '../../constants'

export const Wrapper = styled.div<{ $align?: string; $direction?: string }>`
    display: flex;
    flex-direction: ${props => props.$direction || 'row'};
    align-items: center;
    justify-content: ${props => props.$align || 'flex-start'};
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
    color: ${props => props.$isUrgent ? COLORS.allWhite : COLORS.black};
    background: ${props => props.$isUrgent ? COLORS.danger : COLORS.white};
    
    ${props => props.$isUrgent && `
        animation: pulse 1.5s ease-in-out infinite;
        box-shadow: 0 2px 12px rgba(255, 59, 48, 0.4);
    `}
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`

export const Time = styled.span`
    letter-spacing: 0.5px;
`

export const ExpiredBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 8px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.greyDark};
    background: ${COLORS.grey};
`
