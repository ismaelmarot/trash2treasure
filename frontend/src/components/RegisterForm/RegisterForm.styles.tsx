import styled from 'styled-components'
import { flex } from '@/mixins'
import { COLORS } from '@/constants'

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
    border-radius: 24px;
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
    padding: 4px;
    border: none;
    font-size: 18px;
    background: none;
    color: ${COLORS.greyDark};
    cursor: pointer;
`

export const SubmitButton = styled.button`
    width: 100%;
    margin-top: 1rem;
    padding: 14px;
    border-radius: 24px;
    border: none;
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #0077ed;
    }
`

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
    font-size: 12px;
    margin-top: -12px;
    margin-bottom: 16px;
`