import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ItemProps } from '@/interface'
import { API_BASE_URL, CATEGORIES } from '@/constants'
import { useAuth } from '@/hooks'
import { ConfirmationModal, ItemCountdown } from '@/components'
import { getImageUrl, normalizeItem } from '@/utils/imageUtils'

const getCategoryIcon = (category: string): string => {
  const cat = CATEGORIES.find(c => c.id === category);
  return cat ? cat.icon : '📦';
}
import {
  BackButton,
  BadgeRow,
  CategoryBadge,
  ClaimButton,
  Container,
  ContentCard,
  Description,
  DistanceBadge,
  ErrorState,
  Header,
  ImageSection,
  Loading,
  MainImage,
  MapWrapper,
  MetaRow,
  NavigateButton,
  PlaceholderImage,
  ProximityHint,
  Title,
  UnclaimButton
} from './ItemDetailScreen.styles'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

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

export function ItemDetailScreen() {
  const { t } = useTranslation();
  const { id } = useParams()
  const [item, setItem] = useState<ItemProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const navigate = useNavigate()

  const { user, token } = useAuth()

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
    const fetchItemDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Failed to fetch item')
        const data = await response.json()
        setItem(normalizeItem(data))
      } catch (error) {
        console.error("Error fetching item details:", error)
      } finally {
        setLoading(false)
      }
    };

    fetchItemDetail()
  }, [id, token])

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

      if (!response.ok) throw new Error(t('itemDetail.releaseError'))
      
      const updatedResponse = await fetch(`${API_BASE_URL}/items/${id}`)
      const updatedData = await updatedResponse.json()
      setItem(normalizeItem(updatedData))
    } catch (error) {
      console.error('Error unclaiming item:', error);
      alert(t('itemDetail.releaseError'))
    }
  }

  if (loading) return <Loading>{t('itemDetail.loadingDetails')}</Loading>;

  if (!item) return <ErrorState>{t('itemDetail.notFound')}</ErrorState>;

  const distance = userLocation && item.latitude != null && item.longitude != null
    ? calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude)
    : null

  const distanceInMeters = userLocation && item.latitude != null && item.longitude != null
    ? (() => {
        const R = 6371000
        const deg2rad = (deg: number) => deg * (Math.PI / 180)
        const dLat = deg2rad(item.latitude - userLocation.lat)
        const dLon = deg2rad(item.longitude - userLocation.lng)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(userLocation.lat)) * Math.cos(deg2rad(item.latitude)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      })()
    : null

  const isWithinRange = distanceInMeters !== null && distanceInMeters <= 50
  const canClaim = !item.claimed_by && item.user_id !== user?.id && isWithinRange && !item.is_expired
  const isExpired = item.is_expired

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← {t('common.back')}</BackButton>
      
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
          <CategoryBadge>{getCategoryIcon(item.category)} {item.category}</CategoryBadge>
          {isExpired && (
            <span style={{ 
              background: '#8e8e93', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: 600,
              marginLeft: '8px'
            }}>
              {t('itemDetail.expired').toUpperCase()}
            </span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {distance && <DistanceBadge>📍 {distance}</DistanceBadge>}
          </div>
        </BadgeRow>

        {item.user_id === user?.id && (
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#34c759', marginTop: '8px' }}>
            {t('itemDetail.myReport')}
          </div>
        )}

        {item.claimed_by && (
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#ff9500', margin: '.2rem 0 1rem' }}>
            {(() => {
              const claimedById = typeof item.claimed_by === 'object' && '_id' in item.claimed_by 
                ? (item.claimed_by as any)._id 
                : item.claimed_by;
              const claimedByName = typeof item.claimed_by === 'object' && 'name' in item.claimed_by 
                ? (item.claimed_by as any).name 
                : null;
              
              if (claimedById === user?.id) {
                return t('itemDetail.claimedByMe');
              }
              return `${t('itemDetail.claimedBy')} ${claimedByName || t('itemDetail.otherUser')}`;
            })()}
          </div>
        )}

        <span style={{ fontSize: '13px', color: '#888' }}>
          {t('itemDetail.published')}: {new Date(item.created_at).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>

        <Header>
          <Title>{item.title}</Title>
        </Header>

        <Description>{item.description || t('itemDetail.noDescription')}</Description>

        <MetaRow>
          <ItemCountdown createdAt={item.created_at} align="flex-start" />
        </MetaRow>
    
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
              {t('itemDetail.locationUnavailable')}
            </div>
          )}
        </MapWrapper>

        {item.latitude != null && item.longitude != null && (
          <NavigateButton 
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`,
                '_blank'
              )
            }}
          >
            📍 {t('itemDetail.howToGet')}
          </NavigateButton>
        )}

        {item.user_id !== user?.id && item.claimed_by === user?.id && (
          <UnclaimButton onClick={handleUnclaimClick}>
            {t('itemDetail.stopClaiming')}
          </UnclaimButton>
        )}

        
        <ClaimButton 
          disabled={item.user_id === user?.id || !!item.claimed_by || !canClaim || isExpired}
          onClick={() => navigate(`/app/claimed/${item.id}`)}
        >
          {item.user_id === user?.id 
            ? t('itemDetail.yourReport') 
            : isExpired
              ? t('itemDetail.expired')
              : item.claimed_by === user?.id 
                ? t('itemDetail.alreadyClaimed') 
                : item.claimed_by 
                  ? t('itemDetail.alreadyClaimedBy') 
                  : !isWithinRange && distanceInMeters !== null
                    ? `${t('itemDetail.getCloser')} (${Math.round(distanceInMeters)}m)`
                    : t('itemDetail.wantIt')}
        </ClaimButton>

        {isExpired && (
          <ProximityHint>
            {t('itemDetail.expiredHint')}
          </ProximityHint>
        )}

        {!item.claimed_by && item.user_id !== user?.id && !isWithinRange && distanceInMeters !== null && (
          <ProximityHint>
            {t('itemDetail.distanceHint', { distance: Math.round(distanceInMeters) })}
          </ProximityHint>
        )}
      </ContentCard>

      <ConfirmationModal 
        isOpen={isModalOpen}
        title={t('itemDetail.unclaimTitle')}
        message={t('itemDetail.unclaimMessage')}
        confirmLabel={t('itemDetail.release')}
        cancelLabel={t('itemDetail.keepReservation')}
        isDanger={true}
        onConfirm={handleConfirmUnclaim}
        onCancel={() => setIsModalOpen(false)}
      />
    </Container>
  )
}
