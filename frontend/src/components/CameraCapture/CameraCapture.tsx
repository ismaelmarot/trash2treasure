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

    // Encender cámara cuando se abre
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

            <CameraControls>
            <CancelCapture onClick={onClose}>
                Cancelar
            </CancelCapture>

            <CaptureButton onClick={capturePhoto}>
                <CaptureInner />
            </CaptureButton>

            <div style={{ width: '60px' }} />
            </CameraControls>
        </CameraViewWrapper>
        </CameraModal>
    )
}