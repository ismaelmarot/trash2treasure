import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { ItemCountdown } from '../../components/ItemCountdown/ItemCountdown';




// Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Photo {
  id: number;
  image_url: string;
}

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
  photos?: Photo[];
}


export function ItemDetailScreen() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, token } = useAuth();



  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [id]);

  const handleUnclaimClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmUnclaim = async () => {
    setIsModalOpen(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}/unclaim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al liberar el item');
      
      // Refresh item details
      const updatedResponse = await fetch(`${API_BASE_URL}/items/${id}`);
      const updatedData = await updatedResponse.json();
      setItem(updatedData);
    } catch (error) {
      console.error('Error unclaiming item:', error);
      alert('No se pudo liberar el item. Inténtalo de nuevo.');
    }
  };


  if (loading) return <Loading>Cargando detalles...</Loading>;

  if (!item) return <ErrorState>Tesoro no encontrado.</ErrorState>;


  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← Volver</BackButton>
      
      <ImageSection>
        {item.photos && item.photos.length > 0 ? (
          <MainImage src={`${API_BASE_URL.replace('/api', '')}${item.photos[0].image_url}`} alt={item.title} />
        ) : (
          <PlaceholderImage>📦</PlaceholderImage>
        )}
        <TagGroup>
          <CategoryBadge>{item.category}</CategoryBadge>
          <ItemCountdown createdAt={item.created_at} align="flex-start" />
          {item.user_id === user?.id && <OwnerBadge>Mi Reporte</OwnerBadge>}
          {item.claimed_by === user?.id && <ClaimStatusBadge>Reclamado por mí</ClaimStatusBadge>}
          {item.claimed_by && item.claimed_by !== user?.id && <ClaimStatusBadge $others>Ocupado</ClaimStatusBadge>}
        </TagGroup>


      </ImageSection>


      <ContentCard>
        <Header>
          <Title>{item.title}</Title>
        </Header>

        
        <Description>{item.description || 'Sin descripción adicional.'}</Description>
        
        <SectionTitle>Ubicación</SectionTitle>
        <MapWrapper>
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

  );
}

const Container = styled.div`
  background: #f5f5f7;
  min-height: 100vh;
  padding-bottom: 40px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  backdrop-filter: blur(4px);
`;

const ImageSection = styled.div`
  width: 100%;
  height: 350px;
  position: relative;
  background: #d2d2d7;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
`;

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #1d1d1f;
  backdrop-filter: blur(4px);
  text-transform: uppercase;
`;

const TagGroup = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
  background: ${props => props.$others ? '#ff3b30' : '#1d1d1f'};
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const OwnerBadge = styled.span`
  background: #34c759;
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.2);
`;


const ContentCard = styled.div`
  background: white;
  margin-top: -30px;
  position: relative;
  border-radius: 30px 30px 0 0;
  padding: 32px 24px;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
`;


const Description = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #424245;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 16px;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 32px;
  border: 1px solid #d2d2d7;
`;

const ClaimButton = styled.button`
  width: 100%;
  background: #0071e3;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 18px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #0077ed;
    transform: scale(1.02);
  }

  &:disabled {
    background: #d2d2d7;
    cursor: not-allowed;
    color: #86868b;
  }
`;

const UnclaimButton = styled.button`
  width: 100%;
  background: white;
  color: #ff3b30;
  border: 1px solid #ff3b30;
  padding: 16px;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fff5f5;
    transform: scale(1.01);
  }
  
  &:active {
    transform: scale(0.99);
  }
`;



const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #86868b;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ff3b30;
`;