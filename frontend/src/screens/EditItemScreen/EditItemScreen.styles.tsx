import styled from 'styled-components'
import { COLORS } from '@/constants'

export const Container = styled.div`
    padding: 20px;
    background: ${COLORS.white};
    min-height: calc(100vh - 80px);
`

export const Card = styled.div`
    background: ${COLORS.allWhite};
    padding: 35px;
    border-radius: 28px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 20px ${COLORS.shadow};
    margin: 0 auto;
`

export const Title = styled.h1`
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    color: ${COLORS.greyDark};
    margin-bottom: 32px;
    font-size: 15px;
`

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 20px;
`

export const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    padding-left: 4px;
    color: ${COLORS.black};
`

export const Input = styled.input`
    padding: 14px 16px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: #fbfbfd;
    transition: all 0.2s ease;
    
    &:focus {
        border-color: ${COLORS.info};
        outline: none;
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const TextArea = styled.textarea`
    padding: 14px 30px;
    border-radius: 35px;
    min-height: 10rem;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    font-family: inherit;
    background: #fbfbfd;
    resize: none;
    
    &:focus {
        border-color: ${COLORS.info};
        outline: none;
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const Select = styled.select`
    padding: 14px 40px 14px 20px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: ${COLORS.allWhite} url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23666" d="M6 8L1 3h10z"/></svg>') no-repeat right 15px center;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
`

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
    font-size: 14px;
    background: ${COLORS.allWhite};
    padding: 12px;
    border-radius: 10px;
    border: 1px solid ${COLORS.shadow};
`

export const SubmitButton = styled.button`
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    padding: 18px;
    border-radius: 35px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s ease;
    width: 100%;
    
    &:hover {
        background: ${COLORS.info};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${COLORS.shadow};
    }

    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        background: #d2d2d7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`

export const BackButton = styled.button`
    background: none;
    border: none;
    color: ${COLORS.info};
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 20px;
    padding: 0;
    display: block;
    margin-left: auto;
    
    &:hover {
        text-decoration: underline;
    }
`

export const SuccessView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    text-align: center;
`

export const SuccessIcon = styled.div`
    font-size: 64px;
    margin-bottom: 24px;
    animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    @keyframes pop {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
    }
`

export const SuccessText = styled.p`
    margin-top: 20px;
    font-size: 14px;
    color: ${COLORS.info};
    font-weight: 500;
`

export const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: ${COLORS.greyDark};
    font-size: 15px;
`
