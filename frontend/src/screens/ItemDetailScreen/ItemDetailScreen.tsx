import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ItemProps } from '@/interface'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
import { ConfirmationModal, ItemCountdown } from '@/components'
import { getImageUrl, normalizeItem } from '@/utils/imageUtils'
import {
  BackButton,
  BadgeRow,
  CategoryBadge,
  ClaimButton,
  ClaimStatusBadge,
  Container,
  ContentCard,
  Description,
  ErrorState,
  Header,
  ImageSection,
  Loading,
  MainImage,
  MapWrapper,
  OwnerBadge,
  PlaceholderImage,
  SectionTitle,
  Title,
  UnclaimButton
} from './ItemDetailScreen.styles'

// Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export function ItemDetailScreen() {
  const { id } = useParams()
  const [item, setItem] = useState<ItemProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const { user, token } = useAuth()

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`)
        const data = await response.json()
        setItem(normalizeItem(data))
      } catch (error) {
        console.error("Error fetching item details:", error)
      } finally {
        setLoading(false)
      }
    };

    fetchItemDetail()
  }, [id])

  const handleUnclaimClick = () => {
    setIsModalOpen(true)
  }

  const handleConfirmUnclaim = async () => {
    setIsModalOpen(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}/unclaim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Error al liberar el item')
      
      // Refresh item details
      const updatedResponse = await fetch(`${API_BASE_URL}/items/${id}`)
      const updatedData = await updatedResponse.json()
      setItem(normalizeItem(updatedData))
    } catch (error) {
      console.error('Error unclaiming item:', error);
      alert('No se pudo liberar el item. Inténtalo de nuevo.')
    }
  }

  if (loading) return <Loading>Cargando detalles...</Loading>;

  if (!item) return <ErrorState>Tesoro no encontrado.</ErrorState>;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← Volver</BackButton>
      
      <ImageSection>
        {item.photos && item.photos.length > 0 ? (
          <MainImage src={getImageUrl(item.photos[0].image_url, API_BASE_URL)} alt={item.title} />
        ) : item.main_image ? (
          <MainImage src={getImageUrl(item.main_image, API_BASE_URL)} alt={item.title} />
        ) : (
          <PlaceholderImage>📦</PlaceholderImage>
        )}
      </ImageSection>

      <ContentCard>
        <BadgeRow>
          <CategoryBadge>{item.category}</CategoryBadge>
          {item.user_id === user?.id && <OwnerBadge>Mi Reporte</OwnerBadge>}
          {item.claimed_by === user?.id && <ClaimStatusBadge>Reclamado por mí</ClaimStatusBadge>}
          {item.claimed_by && item.claimed_by !== user?.id && <ClaimStatusBadge $others>Ocupado</ClaimStatusBadge>}
        </BadgeRow>

        <Header>
          <Title>{item.title}</Title>
        </Header>

        <ItemCountdown createdAt={item.created_at} align="flex-start" />

        <Description>{item.description || 'Sin descripción adicional.'}</Description>
        
        <SectionTitle>Ubicación</SectionTitle>
        <MapWrapper>
          {item.latitude != null && item.longitude != null ? (
            <MapContainer 
              center={[item.latitude, item.longitude]} 
              zoom={16} 
              style={{ height: '100%', width: '100%' }}
              dragging={false}
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[item.latitude, item.longitude]} />
            </MapContainer>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Ubicación no disponible
            </div>
          )}
        </MapWrapper>

        {item.user_id !== user?.id && item.claimed_by === user?.id && (
          <UnclaimButton onClick={handleUnclaimClick}>
            Dejar de reclamar
          </UnclaimButton>
        )}

        
        <ClaimButton 
          disabled={!!item.claimed_by || item.user_id === user?.id}
          onClick={() => navigate(`/claimed/${item.id}`)}
        >
          {item.user_id === user?.id 
            ? 'Tu reporte' 
            : item.claimed_by === user?.id 
              ? 'Ya lo reclamaste' 
              : item.claimed_by 
                ? 'Ya reclamado' 
                : '¡Lo quiero!'}
        </ClaimButton>
      </ContentCard>

      <ConfirmationModal 
        isOpen={isModalOpen}
        title="¿Dejar de reclamar?"
        message="¿Estás seguro de que quieres liberar este tesoro? Ya no figurará en tu lista de reclamados y otros podrán verlo."
        confirmLabel="Liberar tesoro"
        cancelLabel="Mantener reserva"
        isDanger={true}
        onConfirm={handleConfirmUnclaim}
        onCancel={() => setIsModalOpen(false)}
      />
    </Container>
  )
}
