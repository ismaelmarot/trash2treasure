import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../hooks/useAuth';
import { ItemCountdown } from '../../components/ItemCountdown/ItemCountdown';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';

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

export function ActivityScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'mine' | 'claimed') || 'mine';

  const setActiveTab = (tab: 'mine' | 'claimed') => {
    setSearchParams({ tab });
  };

  const { token, user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, [activeTab, token]);

  const fetchItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/items`);
      url.searchParams.append('type', activeTab);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnclaimClick = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmUnclaim = async () => {
    if (!selectedItemId) return;
    setIsModalOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/items/${selectedItemId}/unclaim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al liberar el item');
      
      fetchItems();
    } catch (error) {
      console.error('Error unclaiming item:', error);
      alert('No se pudo liberar el item. Inténtalo de nuevo.');
    } finally {
      setSelectedItemId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItemId) return;
    setIsDeleteModalOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/items/${selectedItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar el tesoro');
      
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('No se pudo eliminar el tesoro. Inténtalo de nuevo.');
    } finally {
      setSelectedItemId(null);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Actividad</Title>
        <Subtitle>Gestiona tus reportes y explora la comunidad</Subtitle>
      </Header>

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
            <ItemCard key={item.id} onClick={() => navigate(`/item/${item.id}`)}>
              <ImageWrapper>
                {item.main_image ? (
                  <ItemImage src={`${API_BASE_URL.replace('/api', '')}${item.main_image}`} alt={item.title} />
                ) : (
                  <PlaceholderImage>📦</PlaceholderImage>
                )}
                <TagGroup>
                  <CategoryBadge>{item.category}</CategoryBadge>
                  {item.user_id === user?.id && <OwnerBadge>Mío</OwnerBadge>}
                  {item.claimed_by === user?.id && <ClaimedBadge>Reclamado por mí</ClaimedBadge>}
                  {item.claimed_by && item.claimed_by !== user?.id && <ClaimedBadge $others>Reclamado</ClaimedBadge>}
                </TagGroup>
              </ImageWrapper>

              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemCountdown createdAt={item.created_at} />
                </ItemHeader>
                <ItemDescription>{item.description || 'Sin descripción'}</ItemDescription>
                
                <CardFooter>
                  <div />
                  <ButtonGroup>
                    {activeTab === 'mine' && (
                      <DeleteButton onClick={(e) => handleDeleteClick(e, item.id)}>
                        Eliminar
                      </DeleteButton>
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
  );
}


const Container = styled.div`
  padding: 24px;
  background: #f5f5f7;
  min-height: calc(100vh - 80px);
  padding-bottom: 120px;
`;

const Header = styled.header`
  margin-bottom: 28px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -1px;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #86868b;
  margin-top: 4px;
`;

const TabGroup = styled.div`
  display: flex;
  background: #e5e5ea;
  padding: 4px;
  border-radius: 14px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1d1d1f' : '#86868b'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s ease;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  background: #f0f0f2;
`;

const ItemImage = styled.img`
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
  font-size: 40px;
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

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1d1d1f;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
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

const ClaimedBadge = styled.span<{ $others?: boolean }>`
  background: ${props => props.$others ? '#ff9500' : '#1d1d1f'};
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
`;

const ItemContent = styled.div`
  padding: 14px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ItemTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const ItemDescription = styled.p`
  font-size: 13px;
  color: #86868b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #86868b;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0071e3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #86868b;
`;

const EmptyIcon = styled.div`
  font-size: 56px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  margin-top: 24px;
  background: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #0077ed;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteButton = styled.button`
  background: #fff;
  border: 1px solid #ff3b30;
  color: #ff3b30;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff3b30;
    color: white;
  }
`;

const UnclaimButton = styled.button`
  background: #fff;
  border: 1px solid #0071e3;
  color: #0071e3;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0071e3;
    color: white;
  }
`;