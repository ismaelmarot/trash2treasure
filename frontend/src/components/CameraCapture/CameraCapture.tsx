import { useEffect } from 'react'
import { useCamera } from './useCaemeraCapture'
import {
    CameraControls,
    CameraModal,
    CameraViewWrapper,
    CancelCapture,
    CaptureButton,
    CaptureInner,
    VideoFeed
} from './CameraCapture.styles'

interface CameraCaptureProps {
    isOpen: boolean
    onClose: () => void
    onCapture: (file: File, preview: string) => void
}

export function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
    const {
        videoRef,
        canvasRef,
        startCamera,
        stopCamera,
        capturePhoto
    } = useCamera(onCapture)

    useEffect(() => {
        if (!isOpen) return

        const video = videoRef.current
        if (!video) return

        let initialDistance = 0
        let currentScale = 1

        const getDistance = (t1: Touch, t2: Touch) => {
            const dx = t1.clientX - t2.clientX
            const dy = t1.clientY - t2.clientY
            return Math.sqrt(dx * dx + dy * dy)
        }

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault()
                initialDistance = getDistance(e.touches[0], e.touches[1])
            }
        }

        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault()
                const newDistance = getDistance(e.touches[0], e.touches[1])
                if (initialDistance > 0) {
                    const newScale = (newDistance / initialDistance) * currentScale
                    currentScale = Math.min(Math.max(newScale, 1), 5)
                    video.style.transform = `scale(${currentScale}) translateZ(0)`
                }
            }
        }

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                initialDistance = 0
            }
        }

        video.addEventListener('touchstart', onTouchStart, { passive: false })
        video.addEventListener('touchmove', onTouchMove, { passive: false })
        video.addEventListener('touchend', onTouchEnd)

        return () => {
            video.removeEventListener('touchstart', onTouchStart)
            video.removeEventListener('touchmove', onTouchMove)
            video.removeEventListener('touchend', onTouchEnd)
        }
    }, [isOpen, videoRef])

    useEffect(() => {
        if (isOpen) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => stopCamera()
    }, [isOpen])

    if (!isOpen) return null

    return (
        <CameraModal>
            <CameraViewWrapper>
                <VideoFeed ref={videoRef} autoPlay playsInline />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </CameraViewWrapper>

            <CameraControls>
                <CancelCapture type="button" onClick={onClose}>
                    Cancelar
                </CancelCapture>

                <CaptureButton type="button" onClick={capturePhoto}>
                    <CaptureInner />
                </CaptureButton>

                <div style={{ width: '60px' }} />
            </CameraControls>
        </CameraModal>
    )
}
