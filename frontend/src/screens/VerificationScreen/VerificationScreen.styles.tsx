import styled from 'styled-components'
import { flex } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    min-height: 100vh;
    padding: 24px;
    background: ${COLORS.white};
`

export const Card = styled.div`
    width: 100%;
    padding: 40px;
    border-radius: 24px;
    max-width: 400px;
    text-align: center;
    background: ${COLORS.allWhite};
    box-shadow: 0 8px 32px ${COLORS.shadow};
`

export const Icon = styled.div`
    font-size: 48px;
    margin-bottom: 24px;
`

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${COLORS.black};
    margin-bottom: 8px;
`

export const Subtitle = styled.p`
    font-size: 15px;
    color: ${COLORS.greyDark};
    margin-bottom: 32px;
    line-height: 1.5;
`

export const Form = styled.form`
    text-align: left;
`

export const InputGroup = styled.div`
    margin-bottom: 24px;
`

export const Label = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${COLORS.black};
`

export const CodeInput = styled.input`
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 8px;
    border: 1px solid ${COLORS.greyDark};
    
    &:focus {
        outline: none;
        border-color: ${COLORS.info};
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const ErrorMessage = styled.p`
    font-size: 14px;
    margin-bottom: 16px;
    text-align: center;
    color: ${COLORS.danger};
`

export const SubmitButton = styled.button`
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    color: ${COLORS.allWhite};
    background: ${COLORS.info};
    cursor: pointer;
    
    &:disabled {
        background: ${COLORS.grey};
    }
`

export const ResendLinkText = styled.p`
    margin-top: 24px;
    font-size: 14px;
    color: #86868b;
    
    button {
        padding: 0;
        background: none;
        border: none;
        font-weight: 600;
        cursor: pointer;
        color: ${COLORS.info};
        
        &:hover {
         text-decoration: underline;
        }
    }
`