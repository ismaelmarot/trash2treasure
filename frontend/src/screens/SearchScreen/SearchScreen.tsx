import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/api';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { ItemCountdown } from '../../components/ItemCountdown/ItemCountdown';


interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  created_at: string;
  user_id: number;
  claimed_by: number | null;
  main_image: string | null;
}

const CATEGORIES = [
  { id: 'todos', label: 'All', icon: '🌟' },
  { id: 'carton', label: 'Cardboard', icon: '📦' },
  { id: 'botellas', label: 'Bottles', icon: '🍾' },
  { id: 'metal', label: 'Metal', icon: '🔩' },
  { id: 'mixto', label: 'Mixed', icon: '♻️' },
  { id: 'otros', label: 'Others', icon: '✨' },
];


export function SearchScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Location not available for distance', err)
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchItems(searchQuery, controller.signal);
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCategory, searchQuery, token]);

  const fetchItems = async (query = searchQuery, signal?: AbortSignal) => {
    const trimmedQuery = query.trim();
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/items`);
      if (selectedCategory === 'reclamados') {
        url.searchParams.append('type', 'claimed');
      } else if (selectedCategory !== 'todos') {
        url.searchParams.append('category', selectedCategory);
      }
      if (trimmedQuery) url.searchParams.append('search', trimmedQuery);
      
      const response = await fetch(url.toString(), {
        signal,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setItems(data);
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching search results:', error);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const deg2rad = (deg: number) => deg * (Math.PI/180);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(1)} km`;
  };

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

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
                  <img src={`${API_BASE_URL.replace('/api', '')}${item.main_image}`} alt={item.title} />
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
                  {userLocation && (
                    <Distance>
                      {calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude)}
                    </Distance>
                  )}
                  <CategoryBadge style={{ position: 'static', background: '#f5f5f7' }}>{item.category}</CategoryBadge>
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
  );
}

const Container = styled.div`
  background: #f5f5f7;
  min-height: calc(100vh - 80px);
  max-width: 100%;
  overflow-x: hidden;
`;

const Header = styled.header`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 20px;
`;

const SearchForm = styled.form`
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 16px;
  color: #86868b;
  font-size: 18px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 48px;
  border-radius: 14px;
  border: 1px solid #d2d2d7;
  background: white;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }
`;

const CategoriesBar = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 24px;
  width: 100%;
  &::-webkit-scrollbar { display: none; }
`;

const CategoryChip = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 20px;
  border: none;
  background: ${props => props.$active ? '#0071e3' : 'white'};
  color: ${props => props.$active ? 'white' : '#1d1d1f'};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }
`;

const ItemThumbnail = styled.div`
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  position: relative;
  background: #f5f5f7;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  color: #1d1d1f;
  backdrop-filter: blur(4px);
  text-transform: uppercase;
`;

const TagGroup = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`;

const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
  background: ${props => props.$others ? '#ff3b30' : '#1d1d1f'};
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const OwnerBadge = styled.span`
  background: #34c759;
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`;

const ItemContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
  min-width: 0;
`;

const ItemTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

const Distance = styled.span`
  font-size: 11px;
  color: #86868b;
  font-weight: 600;
  background: #f5f5f7;
  padding: 4px 10px;
  border-radius: 8px;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;


const ItemDesc = styled.p`
  font-size: 14px;
  color: #86868b;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  flex: 1;
`;

const ClaimButton = styled.button`
  width: 100%;
  background: #1d1d1f;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #000;
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #86868b;
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0071e3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #86868b;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;