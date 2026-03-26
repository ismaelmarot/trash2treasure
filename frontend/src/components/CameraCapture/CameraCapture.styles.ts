import { COLORS } from '@/constants'
import styled from 'styled-components'

export const CameraModal = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${COLORS.black};
    z-index: 3000;
`

export const CameraViewWrapper = styled.div`
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
`

export const VideoFeed = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
    transition: transform 0.15s ease-out;
`

export const CameraControls = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 30px 50px 60px 50px;
    background: ${COLORS.black};
`

export const CaptureButton = styled.button`
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.15);
    padding: 3px;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &:active {
        transform: scale(0.92);
        background: rgba(255, 255, 255, 0.25);
    }
`

export const CaptureInner = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: white;
`

export const CancelCapture = styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    min-width: 60px;
    text-align: left;
`
