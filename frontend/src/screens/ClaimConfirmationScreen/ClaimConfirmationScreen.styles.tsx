import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    min-height: calc(100vh - 80px);
    background: ${COLORS.white};
    padding: 20px;
`

export const Card = styled.div`
    background: ${COLORS.allWhite};
    padding: 40px;
    border-radius: 34px;
    width: 100%;
    max-width: 450px;
    text-align: center;
    box-shadow: 0 10px 30px ${COLORS.shadow};
`

export const SuccessIcon = styled.div`
    font-size: 64px;
    margin-bottom: 24px;
`

export const Icon = styled.div`
    font-size: 64px;
    margin-bottom: 24px;
`

export const LoadingSpinner = styled.div`
    ${size('50px','50px')}
    border: 4px solid ${COLORS.allWhite};
    border-top: 4px solid ${COLORS.info};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 24px;
    @keyframes spin { 100% { transform: rotate(360deg); } }
`

export const Title = styled.h1`
    margin-bottom: 12px;
    font-size: 26px;
    font-weight: 700;
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    margin-bottom: 32px;
    font-size: 16px;
    line-height: 1.5;
    color: ${COLORS.greyDark};
`

export const InfoBox = styled.div`
    background: ${COLORS.allWhite};
    border-radius: 34px;
    padding: 24px;
    text-align: left;
    margin-bottom: 32px;
    border: 1px solid ${COLORS.allWhite};
`

export const InfoTitle = styled.h3`
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.black};
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const InfoItem = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    color: ${COLORS.black};
    line-height: 1.4;
    
    &:last-child {
        margin-bottom: 0;
    }
`

export const Dot = styled.span`
    color: ${COLORS.info};
    font-weight: bold;
`

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const PrimaryButton = styled.button`
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    padding: 16px;
    border-radius: 34px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #0077ed;
    }
`

export const SecondaryButton = styled.button`
    background: none;
    border: none;
    color: ${COLORS.info};
    padding: 12px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  
    &:hover {
        text-decoration: underline;
    }
`