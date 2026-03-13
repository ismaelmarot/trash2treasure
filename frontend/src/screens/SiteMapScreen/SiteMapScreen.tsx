import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaMapMarkedAlt, FaUser, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

export function SiteMapScreen() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaChevronLeft />
          <span>Volver</span>
        </BackButton>
        <Title>Site Map</Title>
      </Header>
      
      <ScrollContent>
        <DirectoryGrid>
          <DirectoryColumn>
            <ColumnTitle>
              <FaMapMarkedAlt size={14} /> Explorar
            </ColumnTitle>
            <DirectoryLink onClick={() => navigate('/')}>Mapa Principal</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/search')}>Buscar Tesoros</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/add')}>Publicar un Tesoro</DirectoryLink>
          </DirectoryColumn>

          <DirectoryColumn>
            <ColumnTitle>
              <FaUser size={14} /> Tu Cuenta
            </ColumnTitle>
            <DirectoryLink onClick={() => navigate('/profile')}>Perfil de Usuario</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/activity')}>Tu Actividad</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/login')}>Iniciar Sesión</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/register')}>Crear Cuenta</DirectoryLink>
          </DirectoryColumn>

          <DirectoryColumn>
            <ColumnTitle>
              <FaInfoCircle size={14} /> Proyecto
            </ColumnTitle>
            <DirectoryLink onClick={() => navigate('/about')}>Acerca de Trash2Treasure</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/welcome')}>Pantalla de Bienvenida</DirectoryLink>
          </DirectoryColumn>

          <DirectoryColumn>
            <ColumnTitle>
              <FaShieldAlt size={14} /> Legal
            </ColumnTitle>
            <DirectoryLink onClick={() => navigate('/legal/privacy')}>Privacy Policy</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/legal/terms')}>Terms of Use</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/legal/license')}>Software License Agreements</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/legal/ethics')}>Ethics & Compliance</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/legal/legal')}>Legal Information</DirectoryLink>
            <DirectoryLink onClick={() => navigate('/sitemap')}>Site Map</DirectoryLink>
          </DirectoryColumn>
        </DirectoryGrid>
      </ScrollContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f7;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const Header = styled.header`
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #0071e3;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  
  &:hover { opacity: 0.7; }
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  margin-right: 70px;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px 60px;

  @media (max-width: 768px) {
    padding: 32px 16px 40px;
  }
`;



const DirectoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 0;
  }
`;

const DirectoryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;

  @media (max-width: 900px) {
    margin-bottom: 12px;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DirectoryLink = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  font-size: 14px;
  color: #515154;
  cursor: pointer;
  transition: color 0.2s;
  padding-block: 2px; /* Subtle touch target increase */
  
  &:hover {
    color: #1d1d1f;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    padding-block: 6px;
    font-size: 15px; 
    border-bottom: 1px solid rgba(0,0,0,0.05); /* Very subtle divider on mobile */
    padding-bottom: 12px;
    margin-bottom: 4px;
  }
`;
