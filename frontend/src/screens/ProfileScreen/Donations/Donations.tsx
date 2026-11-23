import { useDonations } from './useDonations'
import { ModalOverlay, ModalContent, ModalTitle, ModalClose } from '@/screens/ProfileScreen/ProfileScreen.style'

export function Donations() {
  const {
    isDonationsOpen,
    setIsDonationsOpen,
    isPromoOpen,
    setIsPromoOpen,
    copyFeedback,
    setCopyFeedback,
    copyAlias,
    profileData
  } = useDonations()

  return (
    <ModalOverlay onClick={() => setIsDonationsOpen(false)}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Pequeñas acciones, grandes cambios. 🌱</ModalTitle>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', textAlign: 'center' }}>
          Ayudame a que Trash2Treasure siga creciendo.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
          Trash2Treasure es un proyecto personal que desarrollo y mantengo por mi cuenta. Con una idea simple: conectar personas, recuperar objetos y darles una segunda oportunidad.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>
          Pero hay algo más detrás de esta iniciativa: ayudar a quienes viven de recolectar y recuperar residuos, facilitándoles el trabajo, ahorrándoles tiempo y haciendo que sus búsquedas sean más eficientes. Que puedan encontrar más fácilmente aquello que otras personas ya no necesitan y que todavía tiene valor.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>
          Detrás de esta aplicación hay muchas horas de trabajo, aprendizaje y dedicación. Cada nueva funcionalidad, mejora y actualización es parte de un esfuerzo independiente para hacer crecer esta iniciativa.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>
          Si te gusta lo que hago y querés ayudarme a seguir adelante, podés colaborar con una pequeña donación.
        </p>
        <p style={{ fontSize: '15px', color: '#333', marginBottom: '32px', lineHeight: 1.6, textAlign: 'center' }}>
          <strong>Alias:</strong> <code>marot.ismael</code>
          <br />
          <button
            onClick={copyAlias}
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
          >
            Copiar
          </button>
          <span style={{ color: '#4CAF50', fontSize: '14px', display: copyFeedback ? 'block' : 'none' }}>¡Alias copiado!</span>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
            Transferencia directa a Mercado Pago
          </p>
          <button
            onClick={() => window.open('https://www.mercadopago.com.ar/', '_blank')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: '#42a59f',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Donar
          </button>
        </p>
        <ModalClose onClick={() => setIsDonationsOpen(false)}>×</ModalClose>
      </ModalContent>
    </ModalOverlay>
  )
}
