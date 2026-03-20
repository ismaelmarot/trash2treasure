import styled from 'styled-components'
import { COLORS } from '../../constants'

export const Wrapper = styled.div<{ $align: string }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
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
    color: ${props => props.$isUrgent ? COLORS.danger : COLORS.black};
    background: ${props => props.$isUrgent ? COLORS.dangerBg : COLORS.white};
`

export const Time = styled.span`
    letter-spacing: 0.5px;
`
