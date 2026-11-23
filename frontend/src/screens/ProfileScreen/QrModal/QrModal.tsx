import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/screens/ProfileScreen/ProfileScreen.style'

export function QrModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <ModalTitle>📱 {/* qrCode would be inserted via i18n */}</ModalTitle>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
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
        </div>
        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>{/* qrScan would be inserted via i18n */}</p>
        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}