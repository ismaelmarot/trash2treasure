import React, { useState } from 'react'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/components/ProfileScreen/ProfileScreen.styles'

export function DonationsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [copyFeedback, setCopyFeedback] = useState(false)

  const copyAlias = () => {
    try {
      navigator.clipboard.writeText('marot.ismael')
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Error copying alias:', err)
      setCopyFeedback(false)
    }
  }

  return (
    <ModalOverlay onClick={onClose} style={{ zIndex: 1000 }}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%' }}>
        <ModalTitle>Pequeñas acciones, grandes cambios. 🌱</ModalTitle>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', textAlign: 'center' }}>
          Ayudame a que Trash2Treasure siga creciendo.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
          Trash2Treasure es un proyecto personal que desarrollo y mantengo por mi cuenta, con una idea simple: conectar personas, recuperar objetos y darles una segunda oportunidad.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
          Detrás de esta aplicación hay muchas horas de trabajo, aprendizaje y dedicación. Cada nueva funcionalidad, mejora y actualización es parte de un esfuerzo independiente para hacer crecer esta iniciativa.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '32px', lineHeight: 1.6, textAlign: 'center' }}>
          <strong>Alias:</strong> <code>marot.ismael</code>
          <br />
          <button
            style={{
              background: 'none',
              border: '1px solid #42a59f',
              color: '#42a59f',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '12px',
              marginBottom: '12px'
            }}
            aria-label="Copiar alias"
            onClick={copyAlias}
          >
            Copiar
          </button>
          <span style={{ color: '#4CAF50', fontSize: '14px', display: copyFeedback ? 'block' : 'none' }}>¡Alias copiado!</span>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
            Transferencia directa a Mercado Pago
          </p>
          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: '#42a59f',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Donar
          </button>
        </p>
        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}