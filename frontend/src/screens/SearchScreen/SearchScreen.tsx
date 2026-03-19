import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import type { ItemProps } from '@/interface'
import { API_BASE_URL, CATEGORIES } from '@/constants'
import { ItemCountdown } from '@/components'
import { getImageUrl, normalizeItems } from '@/utils/imageUtils'
import {
  CategoriesBar,
  CategoryBadge,
  CategoryChip,
  ClaimButton,
  ClaimStatusBadge,
  Container,
  Distance,
  EmptyIcon,
  EmptyResults,
  Header,
  ItemContent,
  ItemDesc,
  ItemHeader,
  ItemMeta,
  ItemThumbnail,
  ItemTitle,
  LoadingSpinner,
  LoadingWrapper,
  OwnerBadge,
  PlaceholderIcon,
  ResultCard,
  ResultsGrid,
  SearchForm,
  SearchIcon,
  SearchInput,
  SearchInputWrapper,
  TagGroup,
  Title
} from './SearchScreen.styles'

export function SearchScreen() {
  const [items, setItems] = useState<ItemProps[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const navigate = useNavigate()
  const { token, user } = useAuth()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Location not available for distance', err)
      )
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchItems(searchQuery, controller.signal)
    }, 300);
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [selectedCategory, searchQuery, token])

  const fetchItems = async (query = searchQuery, signal?: AbortSignal) => {
    const trimmedQuery = query.trim()
    setLoading(true)
    try {
      const url = new URL(`${API_BASE_URL}/items`)
      if (selectedCategory === 'reclamados') {
        url.searchParams.append('type', 'claimed')
      } else if (selectedCategory !== 'todos') {
        url.searchParams.append('category', selectedCategory)
      }
      if (trimmedQuery) url.searchParams.append('search', trimmedQuery)
      
      const response = await fetch(url.toString(), {
        signal,
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setItems(normalizeItems(data))
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching search results:', error)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchItems()
  }

  const deg2rad = (deg: number) => deg * (Math.PI/180)

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(1)} km`;
  }

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  return (
    <Container>
      <Header>
        <Title>Explore</Title>
        <SearchForm onSubmit={handleSearch}>
          <SearchInputWrapper>
            <SearchIcon />
            <SearchInput 
              type="text" 
              placeholder="Search for treasures..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>
        </SearchForm>
      </Header>

      <CategoriesBar>
        {CATEGORIES.map(cat => (
          <CategoryChip 
            key={cat.id} 
            $active={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </CategoryChip>
        ))}
      </CategoriesBar>

      {(loading && items.length === 0) ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <p>Searching treasures...</p>
        </LoadingWrapper>
      ) : (
        <ResultsGrid>
          {filteredItems.map(item => (
            <ResultCard key={item.id} onClick={() => navigate(`/item/${item.id}`)}>
              <ItemThumbnail>
                {item.main_image ? (
                  <img src={getImageUrl(item.main_image, API_BASE_URL)} alt={item.title} />
                ) : item.photos && item.photos.length > 0 ? (
                  <img src={getImageUrl(item.photos[0].image_url, API_BASE_URL)} alt={item.title} />
                ) : (
                  <PlaceholderIcon>📦</PlaceholderIcon>
                )}
                <TagGroup>
                  <CategoryBadge>{item.category}</CategoryBadge>
                  {item.user_id === user?.id && <OwnerBadge>Mi Reporte</OwnerBadge>}
                  {item.claimed_by === user?.id && <ClaimStatusBadge>Reclamado por mí</ClaimStatusBadge>}
                  {item.claimed_by && item.claimed_by !== user?.id && <ClaimStatusBadge $others>Ocupado</ClaimStatusBadge>}
                </TagGroup>
              </ItemThumbnail>
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemCountdown createdAt={item.created_at} />
                </ItemHeader>
                <ItemMeta>
                  {userLocation && item.latitude != null && item.longitude != null && (
                    <Distance>
                      {calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude)}
                    </Distance>
                  )}
                </ItemMeta>
                <ItemDesc>{item.description || 'Sin descripción'}</ItemDesc>

                <ClaimButton 
                  disabled={!!item.claimed_by}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.claimed_by) {
                      navigate(`/claimed/${item.id}`);
                    }
                  }}
                >
                  {item.claimed_by ? 'Reclamado' : 'Reclamar'}
                </ClaimButton>
              </ItemContent>
            </ResultCard>
          ))}
          {filteredItems.length === 0 && (
            <EmptyResults>
              <EmptyIcon>🔍</EmptyIcon>
              <p>No results found for "{searchQuery}"</p>
            </EmptyResults>
          )}
        </ResultsGrid>
      )}
    </Container>
  )
}