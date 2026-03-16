import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg-color, #f5f5f7);
    padding: 20px;
`

export const Card = styled.div`
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 400px;
    position: relative;
`

export const Header = styled.div`
    display: flex;
    margin-bottom: 20px;
`

export const BackButton = styled.button`
    background: none;
    border: none;
    color: #0071e3;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:hover {
        text-decoration: underline;
    }
`

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1d1d1f;
`

export const Subtitle = styled.p`
    font-size: 14px;
    color: #86868b;
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
    color: #1d1d1f;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #d2d2d7;
    font-size: 16px;
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: #0071e3;
        box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
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
    font-size: 18px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #86868b;
`

export const ValidationList = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`

export const ValidationItem = styled.div<{ $valid: boolean }>`
    font-size: 11px;
    color: ${props => props.$valid ? '#28a745' : '#86868b'};
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s ease;
`


export const ErrorMessage = styled.p`
    color: #ff3b30;
    font-size: 12px;
    margin-top: -12px;
    margin-bottom: 16px;
`

export const SubmitButton = styled.button`
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #0071e3;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #0077ed;
    }
`

export const FooterText = styled.p`
    font-size: 14px;
    color: #86868b;
    margin-top: 24px;
`

export const StyledLink = styled(Link)`
    color: #0071e3;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
        text-decoration: underline;
    }
`