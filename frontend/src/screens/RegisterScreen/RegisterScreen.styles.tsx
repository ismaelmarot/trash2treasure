import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { flex } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    min-height: 100vh;
    background: ${COLORS.white};
    padding: 20px;
`

export const Card = styled.div`
    width: 100%;
    max-width: 400px;
    padding: 40px;
    border-radius: 35px;
    background: ${COLORS.allWhite};
    box-shadow: 0 10px 25px ${COLORS.shadow};
    position: relative;
`

export const Header = styled.div`
    display: flex;
    margin-bottom: 20px;
`

export const BackButton = styled.button`
    ${flex('row','center','space-between')}
    gap: 4px;
    padding: 0;
    border: none;
    background: none;
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.info};
    cursor: pointer;
    
    &:hover {
        text-decoration: underline;
    }
`

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${COLORS.greyDark};
    margin-bottom: 32px;
`

export const ErrorMessage = styled.p`
    font-size: 12px;
    margin-bottom: 16px;
    margin-top: -12px;
    color: ${COLORS.danger};
`

export const FooterText = styled.p`
    font-size: 14px;
    color: #86868b;
    margin-top: 24px;
`

export const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: 500;
    color: ${COLORS.info};
    
    &:hover {
        text-decoration: underline;
    }
`

export const Span = styled.span`
    font-size: 1rem;
    font-weight: 800;
`