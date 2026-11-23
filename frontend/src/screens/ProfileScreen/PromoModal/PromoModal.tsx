import React, { useState } from 'react'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/components/ProfileScreen/ProfileScreen.styles'

export function PromoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const copyAlias = () => {
    try {
      navigator.clipboard.writeText('marot.ismael')
    } catch (err) {
      console.error('Error copying alias:', err)
    }
  }

  return (
    <ModalOverlay onClick={onClose} style={{ zIndex: 1001 }}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ padding: '24px 16px' }}>
        <ModalTitle>¿Me ayudás a seguir creciendo? 🌱</ModalTitle>
        <p style={{ color: '#86868b', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
          {/* promo_text1 would be inserted here via i18n */}
        </p>
        <p style={{ color: '#333', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>
          {/* promo_text2 would be inserted here via i18n */}
        </p>
        <p style={{ color: '#333', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>
          {/* promo_text3 would be inserted here via i18n */}
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
          <code style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>marot.ismael</code>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={copyAlias}
            style={{
              width: 'auto',
              maxWidth: '120px',
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid #42a59f',
              background: 'transparent',
              color: '#42a59f',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              alignSelf: 'center'
            }}
            aria-label="Copiar alias"
          >
            Copiar
          </button>
        </div>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>
          {/* transfer_mercado_pago would be inserted here via i18n */}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsDonationsOpen(true)}
            style={{
              width: 'auto',
              maxWidth: '120px',
              padding: '8px 12px',
              borderRadius: '20px',
              border: 'none',
              background: '#42a59f',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {/* promo_donate would be inserted here via i18n */}
          </button>
          <button
            onClick={() => setIsPromoOpen(false)}
            style={{
              width: 'auto',
              maxWidth: '120px',
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid #aaa',
              background: 'transparent',
              color: '#333',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {/* promo_now_no would be inserted here via i18n */}
          </button>
        </div>
        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}