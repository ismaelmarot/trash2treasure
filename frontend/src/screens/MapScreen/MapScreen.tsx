import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet';
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../constants'
import { useAuth } from '../../hooks/useAuth'
import { ItemCountdown } from '../../components/ItemCountdown/ItemCountdown'
import { FaCrosshairs, FaCheck, FaTimes, FaSearch, FaMapMarkerAlt, FaChevronRight, FaBars, FaPlus } from 'react-icons/fa'

// Fix for default Leaflet icons in React
import 'leaflet/dist/leaflet.css'

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  created_at: string;
  main_image: string | null;
}

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
        <FaPlus size={30} color="#0071e3" />
        <ConfirmFab onClick={() => onConfirm(map)} style={{ pointerEvents: 'auto' }}>
          <FaCheck size={20} />
          Confirmar aquí
        </ConfirmFab>
      </CrosshairContainer>
    </div>
  )
}


export function MapScreen() {
  const [items, setItems] = useState<Item[]>([]);
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
      distance: userLocation 
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
      setItems(data);
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
                <FaMapMarkerAlt size={14} />
              </SmallIconButton>
            ) : (
              <ConfirmButton onClick={() => setIsManualMode(false)} title="Cancelar">
                <FaTimes size={14} />
              </ConfirmButton>
            )}
            <SmallIconButton 
              onClick={handleRecenter} 
              disabled={isRefreshingLocation}
              $isRefreshing={isRefreshingLocation}
            >
              <FaCrosshairs size={14} />
            </SmallIconButton>
          </ActionGroup>
        </TopBarSegment>

        <VerticalDivider />

        <ExploreSegment 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          $active={isSidebarOpen}
        >
          <FaBars size={14} />
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


        {filteredItems.map(item => (
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
                {item.main_image && (
                  <PopupImage 
                    src={`${API_BASE_URL.replace('/api', '')}${item.main_image}`} 
                    alt={item.title} 
                  />
                )}
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
        ))}
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
              {isSidebarOpen ? <FaChevronRight /> : <FaBars />}
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
                setUserLocation([item.latitude, item.longitude]);
                setShouldRecenter(prev => prev + 1);
              }}>
                <ItemThumbnail 
                  src={item.main_image ? `${API_BASE_URL.replace('/api', '')}${item.main_image}` : 'https://via.placeholder.com/60'} 
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
              {isSearching ? <div className="spinner-small" /> : <FaSearch />}
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


  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  background: #f5f5f7;
  overflow: hidden;
`;

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 380px;
  background: white;
  z-index: 1500;
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});

  @media (max-width: 768px) {
    width: 100%;
    height: 80%; /* Takes up 80% of screen */
    top: auto;
    bottom: 0;
    transform: translateY(${props => props.$isOpen ? '0' : '100%'});
    border-radius: 32px 32px 0 0;
    background: rgba(255, 255, 255, 0.9); /* Glassmorphism */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15); /* Stronger shadow to lift it */
  }
`;

const DragHandleContainer = styled.div`
  display: none;
  width: 100%;
  padding: 12px 0 8px 0;
  justify-content: center;
  align-items: center;
  cursor: grab;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 5px;
  background: #c7c7cc;
  border-radius: 10px;
`;

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3); /* Slightly darker */
  backdrop-filter: blur(3px);
  z-index: 1400;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 24px 24px 24px;
  border-bottom: 1px solid rgba(0,0,0,0.05); /* Softer border */
  background: transparent;
  
  @media (min-width: 769px) {
    padding-top: 24px; /* Maintain padding on desktop */
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SidebarTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
`;

const ToggleButton = styled.button`
  background: #f2f2f7;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #86868b;
  transition: all 0.2s;

  &:hover {
    background: #e5e5ea;
    color: #1d1d1f;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  &:last-child { margin-bottom: 0; }
`;

const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
`;

const DistanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 8px 4px;
  border-radius: 10px;
  border: 1px solid ${props => props.$active ? '#0071e3' : '#d2d2d7'};
  background: ${props => props.$active ? '#0071e3' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#1d1d1f'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0071e3;
    color: ${props => props.$active ? 'white' : '#0071e3'};
  }
`;

const CategoryScroll = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CategoryChip = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: ${props => props.$active ? '#f2f2f7' : 'transparent'};
  color: ${props => props.$active ? '#0071e3' : '#86868b'};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #0071e3;
  }
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: transparent;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95); /* A bit opaque to contrast with glass background */
  border-radius: 20px; /* Apple uses generous border radius */
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 16px rgba(0,0,0,0.06);
    border-color: rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const ItemThumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
`;

const ItemDescription = styled.p`
  font-size: 12px;
  color: #86868b;
  margin: 2px 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #86868b;
`;

const DotDivider = styled.span`
  width: 3px;
  height: 3px;
  background: #d2d2d7;
  border-radius: 50%;
`;

const ViewDetailButton = styled.button`
  background: #f2f2f7;
  color: #0071e3;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #0071e3;
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: #86868b;

  p {
    font-size: 16px;
    font-weight: 600;
    margin: 16px 0 8px 0;
    color: #1d1d1f;
  }

  small {
    font-size: 14px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 40px;
`;


const TopBar = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  padding: 4px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  z-index: 9999; /* Super high z-index */
  border: 1px solid rgba(255,255,255,0.5);
  width: auto;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    width: 95%;
    justify-content: space-between;
  }
`;

const TopBarSegment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 0 14px;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 24px;
  background: rgba(0,0,0,0.08);
  margin: 0 2px;
`;

const ExploreSegment = styled.button<{ $active: boolean }>`
  border: none;
  background: ${props => props.$active ? '#0071e3' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#1d1d1f'};
  padding: 10px 22px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover {
    background: ${props => props.$active ? '#0077ed' : 'rgba(0,0,0,0.04)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const IconButton = styled.button<{ $isRefreshing?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #0071e3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0077ed;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: #d2d2d7;
    cursor: not-allowed;
  }

  svg {
    animation: ${props => props.$isRefreshing ? 'spin 1.5s linear infinite' : 'none'};
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SmallIconButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  background: #f2f2f7;
  color: #1d1d1f;
  
  &:hover {
    background: #e5e5ea;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const SidebarFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #f2f2f7;
  background: white;
`;


const SearchForm = styled.form`
  display: flex;
  background: white;
  padding: 4px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  background: transparent;

  &::placeholder {
    color: #86868b;
  }
`;

const SearchButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0077ed;
  }

  &:disabled {
    background: #d2d2d7;
  }
`;


const ConfirmButton = styled(IconButton)`
  background: #ff3b30;
  &:hover { background: #ff453a; }
`;

const CrosshairContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ConfirmFab = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 16px rgba(0, 113, 227, 0.3);
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #0077ed;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div<{ $active: boolean; $isRefreshing: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isRefreshing ? '#ff9500' : props.$active ? '#34c759' : '#ff3b30'};
  box-shadow: 0 0 8px ${props => props.$isRefreshing ? 'rgba(255,149,0,0.5)' : props.$active ? 'rgba(52,199,89,0.5)' : 'rgba(255,59,48,0.5)'};
  animation: ${props => (props.$isRefreshing || !props.$active) ? 'pulse-dot 1.5s infinite' : 'none'};

  @keyframes pulse-dot {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

const StatusText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
  white-space: nowrap;
`;



const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0071e3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PopupContent = styled.div`
  min-width: 180px;
  max-width: 220px;
  padding: 4px;
`;

const PopupImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const PopupTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
`;

const CountdownWrapper = styled.div`
  margin-bottom: 12px;
`;

const ViewButton = styled.button`
  width: 100%;
  background: #0071e3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #0077ed;
  }
`;