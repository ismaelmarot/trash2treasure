import React from 'react'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/components/ProfileScreen/ProfileScreen.styles'

export function InviteSentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
        <ModalTitle style={{ marginBottom: '12px' }}>¡Invitación enviada!</ModalTitle>
        <p style={{ color: '#86868b', fontSize: '15px', lineHeight: 1.5 }}>
          Tu amigo recibirá un email con la invitación a Trash2Treasure
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: '#42a59f',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '24px'
          }}
        >
          Cerrar
        </button>
        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}