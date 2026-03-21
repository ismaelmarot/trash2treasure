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

export const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
`

export const AvatarWrapper = styled.div`
    position: relative;
    margin-bottom: 16px;
`

export const Avatar = styled.div<{ $hasImage?: boolean; $bgColor?: string }>`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$hasImage ? 'transparent' : props.$bgColor || COLORS.info};
    font-size: 48px;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 20px ${COLORS.shadow};
`

export const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const CameraButton = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${COLORS.info};
    color: white;
    border: 3px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px ${COLORS.shadow};
    
    &:hover {
        transform: scale(1.1);
    }
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

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
    font-size: 14px;
    background: ${COLORS.allWhite};
    padding: 12px;
    border-radius: 10px;
    border: 1px solid ${COLORS.shadow};
`

export const SuccessMessage = styled.p`
    color: ${COLORS.exito};
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
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${COLORS.shadow};
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

export const HiddenInput = styled.input`
    display: none;
`

export const CameraModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const VideoFeed = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const CameraControls = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 40px;
`

export const CaptureButton = styled.button`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 4px solid white;
    background: none;
    padding: 4px;
    cursor: pointer;
    
    &:active {
        transform: scale(0.92);
    }
`

export const CaptureInner = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: white;
`

export const CancelButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
`

export const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: ${COLORS.greyDark};
    font-size: 15px;
`
