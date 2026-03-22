import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { API_BASE_URL } from '@/constants'
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
  PointsCard,
  PointsLabel,
  PointsValue,
  StatsRow,
  StatItem,
  StatValue,
  StatLabel
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
  const { user, token, logout: authLogout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [pointsData, setPointsData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`${API_BASE_URL}/points/my-points`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setPointsData(data))
        .catch(err => console.error('Error fetching points:', err))

      fetch(`${API_BASE_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProfileData(data))
        .catch(err => console.error('Error fetching profile:', err))
    }
  }, [isAuthenticated, token])

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
        {profileData?.city && (
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            📍 {profileData.city}{profileData.state && `, ${profileData.state}`}{profileData.country && `, ${profileData.country}`}
          </div>
        )}
        <EditProfileButton onClick={() => navigate('/app/edit-profile')}>
          Editar Perfil
        </EditProfileButton>
      </Card>

      <Section>
        <SectionTitle>🌿 Eco Points</SectionTitle>
        <PointsCard onClick={() => navigate('/points')}>
          <PointsLabel>Total Eco Points</PointsLabel>
          <PointsValue>{pointsData?.points?.total_points || 0}</PointsValue>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            {pointsData?.division || 'Curioso Verde'}
          </div>
        </PointsCard>
        <StatsRow>
          <StatItem>
            <StatValue>{pointsData?.points?.total_reports || 0}</StatValue>
            <StatLabel>Reportes</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{pointsData?.points?.total_collected || 0}</StatValue>
            <StatLabel>Recolectados</StatLabel>
          </StatItem>
        </StatsRow>
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