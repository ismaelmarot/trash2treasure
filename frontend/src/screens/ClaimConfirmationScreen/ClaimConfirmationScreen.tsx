import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
import {
  ButtonGroup,
  Card,
  Container,
  Dot,
  Icon,
  InfoBox,
  InfoItem,
  InfoTitle,
  LoadingSpinner,
  PrimaryButton,
  SecondaryButton,
  Subtitle,
  SuccessIcon,
  Title
} from './ClaimConfirmationScreen.styles'

export function ClaimConfirmationScreen() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performClaim = async () => {
      try {
        // Primero obtener los datos del item para saber la categoría
        const itemResponse = await fetch(`${API_BASE_URL}/items/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const item = await itemResponse.json()

        // Obtener ubicación del usuario
        let userLat = null;
        let userLng = null;
        
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000
            });
          });
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
        } catch (geoError) {
          console.error('Error getting location:', geoError);
        }

        const response = await fetch(`${API_BASE_URL}/items/${id}/claim`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userLat, userLng })
        })
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'No se pudo reclamar el tesoro.')
        }
        
        // Agregar puntos por reclamar
        await fetch(`${API_BASE_URL}/points/add-collect`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            category: item.category, 
            itemId: id,
            createdAt: item.created_at 
          })
        })
        
        setLoading(false)
      } catch (err: any) {
        console.error('Error claiming item:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    if (id && token) {
      performClaim()
    }
  }, [id, token])

  if (loading) {
    return (
      <Container>
        <Card>
          <LoadingSpinner />
          <Title>Procesando tu reserva...</Title>
          <Subtitle>Espera un momento mientras aseguramos este tesoro para ti.</Subtitle>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Icon>⚠️</Icon>
          <Title>¡Ops! Algo salió mal</Title>
          <Subtitle>{error}</Subtitle>
          <ButtonGroup>
            <PrimaryButton onClick={() => navigate('/app/search')}>
              Volver a Explorar
            </PrimaryButton>
          </ButtonGroup>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Card>
        <SuccessIcon>💎</SuccessIcon>
        <Title>¡Excelente Elección!</Title>
        <Subtitle>
          Has reclamado este tesoro con éxito. Ahora aparecerá en tu pestaña de "Reclamados".
        </Subtitle>
        
        <InfoBox>
          <InfoTitle>¿Qué sigue ahora?</InfoTitle>
          <InfoItem>
            <Dot>•</Dot>
            <span>Coordina la entrega por el chat (Próximamente).</span>
          </InfoItem>
          <InfoItem>
            <Dot>•</Dot>
            <span>Recuerda ir acompañado si es en un lugar privado.</span>
          </InfoItem>
          <InfoItem>
            <Dot>•</Dot>
            <span>¡Disfruta tu nuevo descubrimiento!</span>
          </InfoItem>
        </InfoBox>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/app/activity?tab=claimed')}>
            Ver mis Reclamados
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate('/app')}>
            Ir al Mapa
          </SecondaryButton>
        </ButtonGroup>
      </Card>
    </Container>
  )
}