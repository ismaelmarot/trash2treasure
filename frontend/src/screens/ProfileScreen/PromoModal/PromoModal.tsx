
import { useTranslation } from 'react-i18next'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/screens/ProfileScreen/ProfileScreen.style'

interface PromoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  const { t } = useTranslation()

  const copyAlias = async () => {
    try {
      await navigator.clipboard.writeText('marot.ismael')
    } catch (err) {
      console.error('Error copying alias:', err)
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose} style={{ zIndex: 1001 }}>
      <ModalContent onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()} style={{ padding: '24px 16px' }}>
        <ModalTitle>{t('profile.promo_title')}</ModalTitle>

        <p style={{ color: '#86868b', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
          {t('profile.promo_text1')}
        </p>

        <p style={{ color: '#333', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>
          {t('profile.promo_text2')}
        </p>

        <p style={{ color: '#333', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>
          {t('profile.promo_text3')}
        </p>

        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
          <code style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>
            marot.ismael
          </code>
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
            {t('profile.copy')}
          </button>
        </div>

        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>
          {t('profile.transfer_mercado_pago')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              onClose()
            }}
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
            {t('profile.promo_donate')}
          </button>

          <button
            onClick={onClose}
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
            {t('profile.promo_now_no')}
          </button>
        </div>

        <ModalClose onClick={onClose}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}

export default PromoModal
