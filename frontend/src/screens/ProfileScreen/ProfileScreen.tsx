import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import {
  Avatar,
  AvatarImage,
  Button,
  Card,
  Container,
  EditProfileButton,
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

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

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

  const avatarColor = getAvatarColor(user?.name || 'U')

  return (
    <Container>
      <Card>
        <Avatar $hasImage={!!user?.profile_image} $bgColor={avatarColor}>
          {user?.profile_image ? (
            <AvatarImage src={user.profile_image} alt="Profile" />
          ) : (
            user?.name?.[0]?.toUpperCase() || 'U'
          )}
        </Avatar>
        <Name>{user?.name}</Name>
        <Email>{user?.email}</Email>
        <EditProfileButton onClick={() => navigate('/edit-profile')}>
          Editar Perfil
        </EditProfileButton>
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