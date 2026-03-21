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
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${COLORS.greyDark};
    margin-bottom: 32px;
`

export const Form = styled.form`
    text-align: left;
`

export const InputGroup = styled.div`
    margin-bottom: 20px;
`

export const Label = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${COLORS.black};
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${COLORS.info};
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const PasswordWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

export const ToggleButton = styled.button`
    ${flex('column','center','center')}
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 4px;

    color: ${COLORS.grey};
    
    &:hover {
        color: ${COLORS.black};
    }
`

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
    font-size: 12px;
    margin-top: -12px;
    margin-bottom: 16px;
`

export const SubmitButton = styled.button`
    width: 100%;
    padding: 14px;
    border-radius: 35px;
    border: none;
    background: ${COLORS.info};
    color: ${COLORS.white};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #0077ed;
    }
`

export const Divider = styled.div`
    margin: 24px 0;
    position: relative;
    text-align: center;
    
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: ${COLORS.grey};
    }
    
    span {
        position: relative;
        background: white;
        padding: 0 12px;
        font-size: 12px;
        color: ${COLORS.greyDark};
    }
`

export const SocialButtons = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
`

export const SocialButton = styled.button<{ $provider: 'facebook' | 'apple' }>`
    ${flex('column','center','center')}
    padding: 10px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    background: ${COLORS.white};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${COLORS.info};
        color: ${COLORS.allWhite}
    }
`

export const FooterText = styled.p`
    font-size: 14px;
    color: ${COLORS.greyDark};
`

export const StyledLink = styled(Link)`
    color: ${COLORS.info};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
        text-decoration: underline;
    }
`
export const Span = styled.span`
    font-size: 1rem;
    font-weight: 800;
`