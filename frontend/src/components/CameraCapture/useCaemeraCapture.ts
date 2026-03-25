import { useRef } from 'react'

interface UseCameraReturn {
    videoRef: React.RefObject<HTMLVideoElement | null>
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    startCamera: () => Promise<void>
    stopCamera: () => void
    capturePhoto: () => void
}

export function useCamera(
    onCapture: (file: File, preview: string) => void
): UseCameraReturn {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // 🔹 Encender cámara
    const startCamera = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        })

        streamRef.current = stream

        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
        } catch (err) {
        console.error('Error accessing camera:', err)
        throw new Error('No se pudo acceder a la cámara')
        }
    }

    // 🔹 Apagar cámara
    const stopCamera = () => {
        if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
        }
    }

    // 🔹 Capturar foto
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
        (blob) => {
            if (!blob) return

            const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: 'image/jpeg'
            })

            const preview = canvas.toDataURL('image/jpeg')

            onCapture(file, preview)

            // 🔥 importante: apagar cámara después de capturar
            stopCamera()
        },
        'image/jpeg',
        0.8
        )
  }

  return {
        videoRef,
        canvasRef,
        startCamera,
        stopCamera,
        capturePhoto
  }
}