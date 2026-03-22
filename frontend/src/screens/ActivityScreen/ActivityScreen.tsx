import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ItemProps } from '@/interface'
import { API_BASE_URL, CATEGORIES } from '@/constants'

const getCategoryIcon = (category: string): string => {
  const cat = CATEGORIES.find(c => c.id === category);
  return cat ? cat.icon : '📦';
}
import { useAuth } from '@/hooks'
import { ConfirmationModal, ItemCountdown } from '@/components'
import { normalizeItems, getImageUrl } from '@/utils/imageUtils'
import { useOfflineSync } from '@/hooks/useOfflineSync'
import {
  ActionButton,
  ButtonGroup,
  CardFooter,
  CategoryBadge,
  ClaimedBadge,
  Container,
  DeleteButton,
  DistanceBadge,
  EditButton,
  EmptyIcon,
  EmptyState,
  Grid,
  Header,
  ImageWrapper,
  ItemCard,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemImage,
  ItemTitle,
  LoadingSpinner,
  LoadingWrapper,
  OfflineBanner,
  OwnerBadge,
  PlaceholderImage,
  Subtitle,
  SyncButton,
  Tab,
  TabGroup,
  TagGroup,
  Title,
  UnclaimButton
} from './ActivityScreen.styles'

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371
  const deg2rad = (deg: number) => deg * (Math.PI / 180)
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(1)} km`;
}

export function ActivityScreen() {
  const [items, setItems] = useState<ItemProps[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'mine' | 'claimed') || 'mine'

  const setActiveTab = (tab: 'mine' | 'claimed') => {
    setSearchParams({ tab })
  }

  const { token, user } = useAuth()
  const { pendingCount, isSyncing, syncAll } = useOfflineSync()

  useEffect(() => {
    const getIPLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        if (data.latitude && data.longitude) {
          const loc = { lat: data.latitude, lng: data.longitude }
          setUserLocation(loc)
        }
      } catch {}
    }

    const saved = localStorage.getItem('manually_set_location')
    if (saved) {
      try {
        const [lat, lng] = JSON.parse(saved)
        setUserLocation({ lat, lng })
      } catch {}
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
        },
        () => getIPLocation()
      )
    } else {
      getIPLocation()
    }
  }, [])

  useEffect(() => {
    fetchItems();
  }, [activeTab, token])

  const fetchItems = async () => {
    if (!token) return;
    setLoading(true)
    try {
      const url = new URL(`${API_BASE_URL}/items`)
      url.searchParams.append('type', activeTab)
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json()
      setItems(normalizeItems(data));
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  };

  const handleUnclaimClick = (e: React.MouseEvent, itemId: number | string) => {
    e.stopPropagation()
    setSelectedItemId(itemId)
    setIsModalOpen(true)
  };

  const handleDeleteClick = (e: React.MouseEvent, itemId: number | string) => {
    e.stopPropagation()
    setSelectedItemId(itemId)
    setIsDeleteModalOpen(true)
  };

  const handleConfirmUnclaim = async () => {
    if (!selectedItemId) return
    setIsModalOpen(false)

    try {
      const response = await fetch(`${API_BASE_URL}/items/${selectedItemId}/unclaim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Error al liberar el item')
      
      fetchItems()
    } catch (error) {
      console.error('Error unclaiming item:', error)
      alert('No se pudo liberar el item. Inténtalo de nuevo.')
    } finally {
      setSelectedItemId(null)
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItemId) return
    setIsDeleteModalOpen(false)

    try {
      const response = await fetch(`${API_BASE_URL}/items/${selectedItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Error al eliminar el tesoro');
      
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('No se pudo eliminar el tesoro. Inténtalo de nuevo.');
    } finally {
      setSelectedItemId(null);
    }
  }

  return (
    <Container>
      <Header>
        <Title>Actividad</Title>
        <Subtitle>Gestiona tus reportes y explora la comunidad</Subtitle>
      </Header>

      {pendingCount > 0 && (
        <OfflineBanner>
          <span>⏳ {pendingCount} {pendingCount === 1 ? 'item pendiente' : 'items pendientes'} de sincronizar</span>
          <SyncButton onClick={syncAll} disabled={isSyncing || !navigator.onLine}>
            {isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
          </SyncButton>
        </OfflineBanner>
      )}

      <TabGroup>
        <Tab 
          $active={activeTab === 'mine'} 
          onClick={() => setActiveTab('mine')}
        >
          Reportados
        </Tab>
        <Tab 
          $active={activeTab === 'claimed'} 
          onClick={() => setActiveTab('claimed')}
        >
          Reclamados
        </Tab>
      </TabGroup>

      {loading ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <p>Sincronizando tesoros...</p>
        </LoadingWrapper>
      ) : items.length === 0 ? (
        <EmptyState>
          <EmptyIcon>{activeTab === 'mine' ? '📝' : '💎'}</EmptyIcon>
          <p>
            {activeTab === 'mine' 
              ? 'Aún no has reportado ningún tesoro.' 
              : 'Aún no has reclamado ningún tesoro.'}
          </p>
          <ActionButton onClick={() => navigate(activeTab === 'mine' ? '/add' : '/search')}>
            {activeTab === 'mine' ? 'Reportar mi primer tesoro' : 'Ir a explorar tesoros'}
          </ActionButton>
        </EmptyState>
      ) : (
        <Grid>
          {items.map(item => (
            <ItemCard key={item.id} onClick={() => navigate(`/app/item/${item.id}`)}>
              <ImageWrapper>
                {item.main_image ? (
                  <ItemImage src={getImageUrl(item.main_image, API_BASE_URL)} alt={item.title} />
                ) : item.photos && item.photos.length > 0 ? (
                  <ItemImage src={getImageUrl(item.photos[0].image_url, API_BASE_URL)} alt={item.title} />
                ) : (
                  <PlaceholderImage>📦</PlaceholderImage>
                )}
                <TagGroup>
                  <CategoryBadge>{getCategoryIcon(item.category)} {item.category}</CategoryBadge>
                  {item.user_id === user?.id && <OwnerBadge>Mío</OwnerBadge>}
                  {item.claimed_by === user?.id && <ClaimedBadge>Reclamado por mí</ClaimedBadge>}
                  {item.claimed_by && item.claimed_by !== user?.id && <ClaimedBadge $others>RECLAMADO</ClaimedBadge>}
                </TagGroup>
              </ImageWrapper>

              <ItemContent>
                <ItemHeader>
                  <DistanceBadge>
                    {item.latitude != null && item.longitude != null
                      ? `📍 ${userLocation ? calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude) : '...'}`
                      : '📍 Ubicación no disponible'}
                  </DistanceBadge>
                  <ItemCountdown createdAt={item.created_at} direction="column" align="flex-start" />
                </ItemHeader>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description || 'Sin descripción'}</ItemDescription>
                <CardFooter>
                  <div />
                  <ButtonGroup>
                    {activeTab === 'mine' && (
                      <>
                        <EditButton onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/app/edit/${item.id}`)
                        }}>
                          Editar
                        </EditButton>
                        <DeleteButton onClick={(e) => handleDeleteClick(e, item.id)}>
                          Eliminar
                        </DeleteButton>
                      </>
                    )}
                    {activeTab === 'claimed' && item.claimed_by === user?.id && (
                      <UnclaimButton onClick={(e) => handleUnclaimClick(e, item.id)}>
                        Liberar
                      </UnclaimButton>
                    )}
                  </ButtonGroup>
                </CardFooter>
              </ItemContent>
            </ItemCard>
          ))}
        </Grid>
      )}

      <ConfirmationModal 
        isOpen={isModalOpen}
        title="¿Liberar Tesoro?"
        message="Si dejas de reclamar este tesoro, volverá a estar disponible para que otros usuarios puedan encontrarlo. ¿Estás seguro?"
        confirmLabel="Sí, liberar"
        cancelLabel="Mantener"
        isDanger={true}
        onConfirm={handleConfirmUnclaim}
        onCancel={() => setIsModalOpen(false)}
      />

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        title="¿Eliminar Tesoro?"
        message="Esta acción es permanente. El reporte desaparecerá de la plataforma y nadie más podrá encontrarlo. ¿Estás seguro?"
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </Container>
  )
}