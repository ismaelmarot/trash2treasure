import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    position: relative;
    min-height: 100vh;
    padding: 24px;
    align-items: center;
    background: ${COLORS.white};
    overflow: hidden;
`

export const Content = styled.div`
    width: 100%;
    max-width: 480px;
    text-align: center;
    z-index: 10;
`

export const LogoContainer = styled.div`
    ${flex('column','center','center')}
    margin-bottom: 48px;
`

export const LogoText = styled.h2`
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: ${COLORS.black};
`

export const Title = styled.h1`
    margin-bottom: 16px;
    font-size: 40px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -1px;
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    font-size: 18px;
    color: ${COLORS.greyDark};
    margin-bottom: 48px;
    line-height: 1.5;
`

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`

export const PrimaryButton = styled.button`
    background: ${COLORS.info};
    color: ${COLORS.white};
    border: none;
    padding: 18px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.02);
        background: #0077ed;
    }

    &:active {
        transform: scale(0.98);
    }
`

export const SecondaryButton = styled.button`
    border: none;
    padding: 18px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 600;
    color: #0071e3;
    background: ${COLORS.white};
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #e8e8ed;
    }
`

export const Footer = styled.p`
    margin-top: 48px;
    font-size: .8rem;
    color: ${COLORS.greyDark};
`

export const AppIcon = styled.img`
    width: 6rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 10px ${COLORS.shadow};
    border-radius: 20px;
`