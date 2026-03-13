import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaChevronRight } from 'react-icons/fa';

export function ProfileScreen() {
  const { user, logout: authLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    authLogout();
    navigate('/welcome');
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Card>
          <h1>Tu Perfil</h1>
          <p>Inicia sesión para ver tu actividad y gestionar tus publicaciones.</p>
          <Button onClick={() => navigate('/login')}>Ir a Login</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Avatar>{user?.name?.[0] || 'U'}</Avatar>
        <Name>{user?.name}</Name>
        <Email>{user?.email}</Email>
        
        <Section>
          <SectionTitle>Actividad</SectionTitle>
          <p>Aún no tienes publicaciones.</p>
        </Section>

        <Section>
          <SectionTitle>Aplicación</SectionTitle>
          <MenuItem onClick={() => navigate('/about')}>
            <MenuIconWrapper>
              <FaInfoCircle size={18} />
            </MenuIconWrapper>
            <MenuLabel>Acerca de Trash2Treasure</MenuLabel>
            <FaChevronRight size={14} color="#d2d2d7" />
          </MenuItem>
        </Section>

        <LogoutButton onClick={logout}>Cerrar Sesión</LogoutButton>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  padding: 24px;
  background: #f5f5f7;
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: #0071e3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  margin: 0 auto 20px;
`;

const Name = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Email = styled.p`
  color: #86868b;
  margin-bottom: 32px;
`;

const Section = styled.div`
  text-align: left;
  border-top: 1px solid #d2d2d7;
  padding-top: 24px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
`;

const Button = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #ff3b30;
  border: 1px solid #ff3b30;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff3b30;
    color: white;
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f7;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #eaeaeb;
  }
`;

const MenuIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0071e3;
  margin-right: 12px;
`;

const MenuLabel = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #1d1d1f;
`;