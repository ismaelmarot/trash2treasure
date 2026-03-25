import { COLORS } from '@/constants'
import { flex, size } from '@/mixins'
import styled from 'styled-components'

export const CameraModal = styled.div`
    ${flex('column','center','center')}
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${COLORS.black};
    z-index: 3000;
`

export const CameraViewWrapper = styled.div`
    ${flex('column','center','center')}
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 70vh;
    margin-bottom: 20px;
    touch-action: manipulation;
`

export const VideoFeed = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const CameraControls = styled.div`
    ${flex('row','center','space-between')}
    position: relative;
    width: 100%;
    max-width: 500px;
    padding: 0 40px 20px 40px;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
    touch-action: none;
`

export const CaptureButton = styled.button`
    ${flex('column','center','center')}
    ${size('70px','70px')}
    border-radius: 50%;
    border: 4px solid white;
    background: none;
    padding: 4px;
    cursor: pointer;
    touch-action: none;
    
    &:active {
        transform: scale(0.92);
    }
`

export const CaptureInner = styled.div`
    ${size('100%','100%')}
    border-radius: 50%;
    background: ${COLORS.allWhite};
`

export const CancelCapture = styled.button`
    background: none;
    border: none;
    color: ${COLORS.allWhite};
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    touch-action: none;
`