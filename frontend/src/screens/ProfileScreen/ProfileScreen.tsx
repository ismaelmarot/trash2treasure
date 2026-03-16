import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import {
  Avatar,
  Button,
  Card,
  Container,
  Email,
  GoOut,
  IconChevron,
  IconCircle,
  LogoutButton,
  MenuIconWrapper,
  MenuItem,
  MenuLabel,
  Name,
  Section,
  SectionTitle,
  ExitText,
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
      </Card>

      <Section>
        <SectionTitle>Actividad</SectionTitle>
          <p>Aún no tienes publicaciones.</p>
        </Section>
      <Section>
      <SectionTitle>Aplicación</SectionTitle>
        <MenuItem onClick={() => navigate('/about')}>
          <MenuIconWrapper>
            <IconCircle />
          </MenuIconWrapper>
          <MenuLabel>Acerca de Trash2Treasure</MenuLabel>
            <IconChevron />
          </MenuItem>
      </Section>

      <Section>
        <SectionTitle>Configuración</SectionTitle>
        <MenuItem onClick={() => navigate('/about')}>
            <ExitText>Cerrar Sesión</ExitText>
          <MenuIconWrapper>
            <LogoutButton onClick={logout}>
              <GoOut />
            </LogoutButton>
          </MenuIconWrapper>
          </MenuItem>
      </Section>

    </Container>
  )
}