import styled from 'styled-components'
import { COLORS } from '@/constants'

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

export const ModalContent = styled.div`
    background: white;
    padding: 32px;
    border-radius: 20px;
    max-width: 90%;
    max-height: 80%;
    overflow-y: auto;
    width: 100%;
`

export const ModalTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    text-align: center;
`

export const ModalClose = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666
`

