import React, { useState } from 'react'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/screens/ProfileScreen/ProfileScreen.style'

export function InviteModal({ isOpen, onClose, setIsInviteSentOpen }: { isOpen: boolean, onClose: () => void, setIsInviteSentOpen: (value: boolean) => void }) {
  const [inviteEmail, setInviteEmail] = useState('')

  const handleSendInvite = async () => {
    if (!inviteEmail) return
    try {
      await fetch('https://api.example.com/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: inviteEmail })
      })
      setInviteEmail('')
      setIsInviteSentOpen(true)
      setIsInviteModalOpen(false)
    } catch (err) {
      console.error('Error sending invite:', err)
    }
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ padding: '24px 16px', textAlign: 'center' }}>
        <ModalTitle>📨 Invitar amigo</ModalTitle>
        <p style={{ color: '#86868b', fontSize: '14px', marginBottom: '20px' }}>
          El recibirá un email con el diseño de Trash2Treasure
        </p>
        <input
          type="email"
          placeholder="email@ejemplo.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid #e5e5ea',
            fontSize: '16px',
            marginBottom: '16px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleSendInvite}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: '#42a59f',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Enviar invitación
        </button>
        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}