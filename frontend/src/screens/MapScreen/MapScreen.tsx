import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import type { ItemProps } from '@/interface'
import { API_BASE_URL, ICONS } from '@/constants'
import { useAuth } from '@/hooks'
import { ItemCountdown } from '@/components'
import { getImageUrl, normalizeItems } from '@/utils/imageUtils'
import {
  ActionGroup,
  CategoryChip,
  CategoryScroll,
  ConfirmButton,
  ConfirmFab,
  Container,
  CountdownWrapper,
  CrosshairContainer,
  DistanceGrid,
  DotDivider,
  DragHandle,
  DragHandleContainer,
  EmptyIcon,
  EmptyState,
  ExploreSegment,
  FilterChip,
  FilterSection,
  ItemCard,
  ItemDescription,
  ItemInfo,
  ItemMeta,
  ItemName,
  ItemsList,
  ItemThumbnail,
  LocationStatus,
  Overlay,
  PopupContent,
  PopupImage,
  PopupTitle,
  SearchButton,
  SearchForm,
  SearchInput,
  SectionLabel,
  SidebarContainer,
  SidebarFooter,
  SidebarHeader,
  SidebarOverlay,
  SidebarTitle,
  SmallIconButton,
  Spinner,
  StatusDot,
  StatusText,
  TitleRow,
  ToggleButton,
  TopBar,
  TopBarSegment,
  VerticalDivider,
  ViewButton,
  ViewDetailButton
} from './MapScreen.styles'

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'carton': return '📦'
    case 'botellas': return '🍾'
    case 'metal': return '🔩'
    case 'mixto': return '♻️'
    case 'otros': return '✨'
    default: return '📍'
  }
}

const getCategoryIcon = (category: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 2px solid #0071e3; font-size: 18px;">${getCategoryEmoji(category)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

const userIcon = L.divIcon({
  html: `<div style="
    width: 20px; 
    height: 20px; 
    background: #0071e3; 
    border: 3px solid white; 
    border-radius: 50%; 
    box-shadow: 0 0 15px rgba(0,113,227,0.6);
    animation: pulse 2s infinite;
  "></div>
  <style>
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  </style>`,
  className: 'user-location-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

// Component to recenter map when location changes
function ChangeView({ center, trigger }: { center: L.LatLngExpression, trigger?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, trigger]); // Removed map from deps to avoid infinite loops in some cases
  return null;
}

function ManualModeHandler({ isActive, onConfirm }: { isActive: boolean, onConfirm: (map: L.Map) => void }) {
  const map = useMap();
  
  if (!isActive) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CrosshairContainer>
        <ICONS.plus size={30} color="#0071e3" />
        <ConfirmFab onClick={() => onConfirm(map)} style={{ pointerEvents: 'auto' }}>
          <ICONS.check size={20} />
          Confirmar aquí
        </ConfirmFab>
      </CrosshairContainer>
    </div>
  )
}


export function MapScreen() {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(() => {
    const saved = localStorage.getItem('manually_set_location')
    return saved ? JSON.parse(saved) : null
  })
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const navigate = useNavigate()

  const [shouldRecenter, setShouldRecenter] = useState(0)
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false)
  const [isManualMode, setIsManualMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [maxDistance, setMaxDistance] = useState<number>(3000); // Default 3km

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180
    const phi2 = (lat2 * Math.PI) / 180
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // in meters
  };

  const filteredItems = items
    .map(item => ({
      ...item,
      distance: userLocation && item.latitude != null && item.longitude != null
        ? calculateDistance(userLocation[0], userLocation[1], item.latitude, item.longitude)
        : Infinity
    }))
    .filter(item => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
      const distanceMatch = item.distance <= maxDistance
      return categoryMatch && distanceMatch
    })
    .sort((a, b) => a.distance - b.distance)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)]
        setUserLocation(newPos)
        setAccuracy(null); // Search location doesn't have GPS accuracy
        setShouldRecenter(prev => prev + 1)
        // If they search, they probably want to confirm this as their home base
        setIsManualMode(true)
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }

  const handleConfirmManualLocation = (map: L.Map) => {
    const center = map.getCenter()
    const newPos: [number, number] = [center.lat, center.lng]
    setUserLocation(newPos)
    setAccuracy(null);
    localStorage.setItem('manually_set_location', JSON.stringify(newPos))
    setIsManualMode(false)
  }

  // Fallback to IP location if GPS fails/is slow
  const getIPLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      if (data.latitude && data.longitude) {
        return [data.latitude, data.longitude] as [number, number]
      }
    } catch (error) {
      console.error('Error getting IP location:', error)
    }
    return [-34.6037, -58.3816] as [number, number] // Ultimate fallback
  }

  useEffect(() => {
    let watchId: number
    
    const startTracking = async () => {
      // If we have a saved location, don't show loading overlay for too long
      if (userLocation) setLoading(false);

      if (navigator.geolocation) {
        // Get an initial fast location or fallback to IP while waiting for high accuracy
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            setAccuracy(pos.coords.accuracy);
            setLoading(false);
          },
          async () => {
            const ipLoc = await getIPLocation();
            if (!userLocation) {
              setUserLocation(ipLoc);
              setLoading(false);
            }
          },
          { timeout: 5000, enableHighAccuracy: false }
        )

        // Start watching for high accuracy fixes
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude]
            setUserLocation(newPos)
            setAccuracy(pos.coords.accuracy)
            setLoading(false)
          },
          (err) => {
            console.error('Error watching location:', err)
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        )
      } else {
        const ipLoc = await getIPLocation()
        setUserLocation(ipLoc)
        setLoading(false)
      }
    }

    startTracking()
    fetchItems()

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const handleRecenter = () => {
    setIsRefreshingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setUserLocation(newPos)
          setAccuracy(pos.coords.accuracy)
          setShouldRecenter(prev => prev + 1)
          setIsRefreshingLocation(false)
        },
        (err) => {
          console.error('Error forcing location update:', err)
          setIsRefreshingLocation(false)
          setShouldRecenter(prev => prev + 1)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsRefreshingLocation(false)
      setShouldRecenter(prev => prev + 1)
    }
  }

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setItems(normalizeItems(data));
    } catch (error) {
      console.error('Error fetching items for map:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <TopBar>
        <TopBarSegment>
          <LocationStatus>
            <StatusDot $active={!!userLocation} $isRefreshing={isRefreshingLocation} />
            <StatusText>
              {isRefreshingLocation ? 'GPS...' : accuracy ? `${Math.round(accuracy)}m` : userLocation ? 'Activo' : 'Buscando...'}
            </StatusText>
          </LocationStatus>
          
          <ActionGroup>

            {!isManualMode ? (
              <SmallIconButton 
                onClick={() => setIsManualMode(true)} 
                title="Ajustar ubicación manualmente"
              >
                <ICONS.mapMark size={14} />
              </SmallIconButton>
            ) : (
              <ConfirmButton onClick={() => setIsManualMode(false)} title="Cancelar">
                <ICONS.time size={14} />
              </ConfirmButton>
            )}
            <SmallIconButton 
              onClick={handleRecenter} 
              disabled={isRefreshingLocation}
              $isRefreshing={isRefreshingLocation}
            >
              <ICONS.cross size={14} />
            </SmallIconButton>
          </ActionGroup>
        </TopBarSegment>

        <VerticalDivider />

        <ExploreSegment 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          $active={isSidebarOpen}
        >
          <ICONS.bars size={14} />
          <span>Explorar</span>
        </ExploreSegment>
      </TopBar>

      <MapContainer 
        center={userLocation || [-34.6037, -58.3816]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={userLocation || [-34.6037, -58.3816]} trigger={shouldRecenter} />
        <ManualModeHandler onConfirm={handleConfirmManualLocation} isActive={isManualMode} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}
        
        {userLocation && accuracy && !isManualMode && (
          <Circle 
            center={userLocation} 
            radius={accuracy} 
            pathOptions={{ 
              fillColor: '#0071e3', 
              fillOpacity: 0.1, 
              color: '#0071e3', 
              weight: 1,
              dashArray: '5, 10'
            }} 
          />
        )}


        {filteredItems
          .filter(item => item.latitude != null && item.longitude != null)
          .map(item => (
            <Marker 
              key={item.id} 
              position={[item.latitude, item.longitude]} 
              icon={getCategoryIcon(item.category)}
              eventHandlers={{
                click: () => {
                  // Centrar suavemente al hacer clic en el marcador
                  // Leaflet maneja esto en parte, pero podemos forzarlo si queremos
                }
              }}
            >
                <Popup>
                  <PopupContent>
                    {item.main_image ? (
                      <PopupImage 
                        src={getImageUrl(item.main_image, API_BASE_URL)} 
                        alt={item.title} 
                      />
                    ) : item.photos && item.photos.length > 0 ? (
                      <PopupImage 
                        src={getImageUrl(item.photos[0].image_url, API_BASE_URL)} 
                        alt={item.title} 
                      />
                    ) : null}
                    <PopupTitle>{item.title}</PopupTitle>
                  <CountdownWrapper>
                    <ItemCountdown createdAt={item.created_at} align="flex-start" />
                  </CountdownWrapper>
                  <ViewButton onClick={() => navigate(`/item/${item.id}`)}>
                    Ver Detalles
                  </ViewButton>
                </PopupContent>
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>

      {/* Sidebar Section */}
      <SidebarOverlay $isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />
      <SidebarContainer $isOpen={isSidebarOpen}>
        <DragHandleContainer onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <DragHandle />
        </DragHandleContainer>
        
        <SidebarHeader>
          <TitleRow>
            <SidebarTitle>Explorar Tesoros</SidebarTitle>
            <ToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <ICONS.arrowRight /> : <ICONS.bars />}
            </ToggleButton>
          </TitleRow>

          <FilterSection>
            <SectionLabel>Máxima Distancia</SectionLabel>
            <DistanceGrid>
              {[500, 1000, 2000, 3000].map(dist => (
                <FilterChip 
                  key={dist} 
                  $active={maxDistance === dist}
                  onClick={() => setMaxDistance(dist)}
                >
                  {dist >= 1000 ? `${dist/1000}km` : `${dist}m`}
                </FilterChip>
              ))}
            </DistanceGrid>
          </FilterSection>

          <FilterSection>
            <SectionLabel>Categoría</SectionLabel>
            <CategoryScroll>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'carton', label: 'Cartón' },
                { id: 'botellas', label: 'Botellas' },
                { id: 'metal', label: 'Metal' },
                { id: 'mixto', label: 'Mixto' },
                { id: 'otros', label: 'Otros' }
              ].map(cat => (
                <CategoryChip 
                  key={cat.id} 
                  $active={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </CategoryChip>
              ))}
            </CategoryScroll>
          </FilterSection>
        </SidebarHeader>

        <ItemsList>
          {filteredItems.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <p>No hay tesoros en este rango.</p>
              <small>Prueba a ampliar la distancia o cambiar de categoría.</small>
            </EmptyState>
          ) : (
            filteredItems.map(item => (
              <ItemCard key={item.id} onClick={() => {
                if (item.latitude != null && item.longitude != null) {
                  setUserLocation([item.latitude, item.longitude]);
                  setShouldRecenter(prev => prev + 1);
                }
              }}>
                <ItemThumbnail 
                  src={item.main_image 
                    ? getImageUrl(item.main_image, API_BASE_URL) 
                    : item.photos && item.photos.length > 0 
                      ? getImageUrl(item.photos[0].image_url, API_BASE_URL)
                      : 'https://via.placeholder.com/60'
                  } 
                  alt={item.title} 
                />
                <ItemInfo>
                  <ItemName>{item.title}</ItemName>
                  <ItemDescription>{item.description}</ItemDescription>
                  <ItemMeta>
                    <span>{getCategoryEmoji(item.category)}</span>
                    <DotDivider />
                    <span>{Math.round(item.distance)}m</span>
                  </ItemMeta>
                  <ItemCountdown createdAt={item.created_at} align="flex-start" />
                </ItemInfo>
                <ViewDetailButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/item/${item.id}`);
                  }}
                  title="Ver detalles"
                >
                  Ver
                </ViewDetailButton>
              </ItemCard>
            ))
          )}
        </ItemsList>

        <SidebarFooter>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput 
              placeholder="Busca calle o ciudad..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit" disabled={isSearching}>
              {isSearching ? <div className="spinner-small" /> : <ICONS.search />}
            </SearchButton>
          </SearchForm>
        </SidebarFooter>
      </SidebarContainer>

      {loading && (
        <Overlay>
          <Spinner />
          <p>Cargando tesoros...</p>
        </Overlay>
      )}
    </Container>
  )
}