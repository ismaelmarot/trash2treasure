import styled, { keyframes } from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS } from '@/constants'

export const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`

export const slideUp = keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
`

export const Overlay = styled.div`
    position: fixed;
    ${flex('column','center','center')}
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${COLORS.shadow};
    backdrop-filter: blur(8px);
    z-index: 2000;
    animation: ${fadeIn} 0.3s ease;
    padding: 20px;
`

export const ModalContainer = styled.div`
    width: 100%;
    max-width: 400px;
    border-radius: 28px;
    padding: 32px;
    text-align: center;
    background: ${COLORS.allWhite};
    box-shadow: 0 20px 40px ${COLORS.shadow};
    animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`

export const IconContainer = styled.div<{ $isDanger: boolean }>`
    ${flex('column','center','center')}
    ${size('80px','80px')}
    margin: 0 auto 20px;
    margin-bottom: 20px;
    border-radius: 24px;
    font-size: 48px;
    background: ${props => props.$isDanger ? 'rgba(255, 59, 48, 0.1)' : 'rgba(0, 113, 227, 0.1)'};
`

export const Title = styled.h2`
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #1d1d1f;
`

export const Message = styled.p`
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 32px;
    color: ${COLORS.greyDark};
`

export const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
`

export const Button = styled.button`
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
`

export const PrimaryButton = styled(Button)<{ $isDanger: boolean }>`
    background: ${props => props.$isDanger ? '#ff3b30' : '#0071e3'};
    color: ${COLORS.allWhite};
    
    &:hover {
        background: ${props => props.$isDanger ? COLORS.danger : COLORS.info};
        transform: scale(1.02);
    }
    
    &:active {
        transform: scale(0.98);
    }
`

export const SecondaryButton = styled(Button)`
    background: ${COLORS.allWhite};
    color: ${COLORS.black};
    
    &:hover {
        background: ${COLORS.grey};
    }
`