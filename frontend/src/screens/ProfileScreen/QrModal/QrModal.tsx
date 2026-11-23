
import { QRCodeSVG } from 'qrcode.react'
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalClose
} from '@/screens/ProfileScreen/ProfileScreen.style'

interface QrModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QrModal({ isOpen, onClose }: QrModalProps) {
  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        style={{ textAlign: 'center' }}
      >
        <ModalTitle>📱 Código QR</ModalTitle>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 0'
          }}
        >
          <QRCodeSVG
            value="https://trash2treasure-app.vercel.app"
            size={220}
            bgColor="#ffffff"
            fgColor="#1d1d0f"
            level="H"
            imageSettings={{
              src: '/icon-192.png',
              height: 56,
              width: 56,
              excavate: true
            }}
          />
        </div>

        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
          Escaneá el código para visitar Trash2Treasure.
        </p>

        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}

export default QrModal
