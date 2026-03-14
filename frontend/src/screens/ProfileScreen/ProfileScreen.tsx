import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ICONS } from '../../constants'

import {
  Avatar,
  Button,
  Card,
  Container,
  Email,
  LogoutButton,
  MenuIconWrapper,
  MenuItem,
  MenuLabel,
  Name,
  Section,
  SectionTitle
} from './ProfileScreen.style'

export function ProfileScreen() {
  const { user, logout: authLogout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const logout = () => {
    authLogout();
    navigate('/welcome')
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
              <ICONS.iconCircle size={18} />
            </MenuIconWrapper>
            <MenuLabel>Acerca de Trash2Treasure</MenuLabel>
            <ICONS.chevronRight size={14} color="#d2d2d7" />
          </MenuItem>
        </Section>

        <LogoutButton onClick={logout}>Cerrar Sesión</LogoutButton>
      </Card>
    </Container>
  )
}