import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../constants'
import { useAuth } from '../../hooks/useAuth';

export function ClaimConfirmationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performClaim = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}/claim`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'No se pudo reclamar el tesoro.');
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error claiming item:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id && token) {
      performClaim();
    }
  }, [id, token]);

  if (loading) {
    return (
      <Container>
        <Card>
          <LoadingSpinner />
          <Title>Procesando tu reserva...</Title>
          <Subtitle>Espera un momento mientras aseguramos este tesoro para ti.</Subtitle>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Icon>⚠️</Icon>
          <Title>¡Ops! Algo salió mal</Title>
          <Subtitle>{error}</Subtitle>
          <ButtonGroup>
            <PrimaryButton onClick={() => navigate('/search')}>
              Volver a Explorar
            </PrimaryButton>
          </ButtonGroup>
        </Card>
      </Container>
    );
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
          <PrimaryButton onClick={() => navigate('/activity?tab=claimed')}>
            Ver mis Reclamados
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate('/')}>
            Ir al Mapa
          </SecondaryButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background: #f5f5f7;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 28px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0071e3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #86868b;
  line-height: 1.5;
  margin-bottom: 32px;
`;

const InfoBox = styled.div`
  background: #fbfbfd;
  border-radius: 20px;
  padding: 24px;
  text-align: left;
  margin-bottom: 32px;
  border: 1px solid #f0f0f2;
`;

const InfoTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #424245;
  line-height: 1.4;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Dot = styled.span`
  color: #0071e3;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0077ed;
  }
`;

const SecondaryButton = styled.button`
  background: none;
  border: none;
  color: #0071e3;
  padding: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;