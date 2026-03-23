import styled from 'styled-components'
import { Link } from 'react-router-dom'
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
    justify-content: flex-end;
    margin-bottom: 20px;
`

export const BackButton = styled.button`
    ${flex('row','center','center')}
    gap: 4px;
    background: none;
    padding: 0;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: ${COLORS.info};
    
    &:hover {
        text-decoration: underline;
    }
`

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${COLORS.black}
`

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${COLORS.greyDark};
    margin-bottom: 32px;
`

export const InputGroup = styled.div`
    margin-bottom: 20px;
`

export const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.black};
    margin-bottom: 8px;
`

export const Input = styled.input`
    width: 100%;
    padding: 14px;
    border-radius: 15px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;

    &:focus {
        border-color: ${COLORS.primary};
    }

    &::placeholder {
        color: ${COLORS.grey};
    }
`

export const PasswordWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

export const ToggleButton = styled.button`
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: ${COLORS.grey};

    &:hover {
        color: ${COLORS.black};
    }
`

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
    font-size: 14px;
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 10px;
    background: ${COLORS.dangerBg};
`

export const SubmitButton = styled.button`
    width: 100%;
    padding: 16px;
    border-radius: 25px;
    border: none;
    background: ${COLORS.primary};
    color: ${COLORS.white};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-top: 10px;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export const FooterText = styled.p`
    font-size: 14px;
    color: ${COLORS.greyDark};
    text-align: center;
`

export const StyledLink = styled(Link)`
    color: ${COLORS.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

export const Span = styled.span`
    font-size: 14px;
`
