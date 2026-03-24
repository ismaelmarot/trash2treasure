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
  MenuIconWrapper,
  MenuItem,
  MenuLabel,
  Name,
  PointsCard,
  PointsLabel,
  PointsValue,
  Section,
  SectionTitle,
  StatItem,
  StatLabel,
  StatValue,
  StatsRow,
  ExitText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalClose,
  InfoList,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoTitle,
  InfoDetail,
} from './ProfileScreen.style'

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

const POINTS_INFO = [
  { icon: '🌍', title: '¿Qué son los Eco Points?', detail: 'Los Eco Points son puntos que ganás al reportar residuos en tu zona o reclamarlos para reciclar. Cuantos más puntos tengas, más alto será tu nivel y división en la comunidad Trash2Treasure.' },
  { icon: '📸', title: 'Reportar', detail: '+1 punto por cada reporte. +3 extra si la categoría es crítica (baterías, electrónicos, construcción, muebles)' },
  { icon: '♻️', title: 'Recolectar', detail: '+3 puntos por cada recolección. +3 extra si la categoría es crítica. +1 a +3 extra por rapidez (<3h: +1, <1h: +3)' },
  { icon: '⏱️', title: 'Bonus por tiempo', detail: '<1 hora: +3 puntos extra. <3 horas: +1 punto extra' },
  { icon: '🔥', title: 'Streak diario', detail: '3 días: +4 pts. 5 días: +6 pts. 10 días: +15 pts' },
  { icon: '🔁', title: 'Combo misma familia', detail: '2 items: +2 pts. 3 items: +4 pts. 5 items: +7 pts' },
  { icon: '🌈', title: 'Combo mixto', detail: '2 familias: +4 pts. 3 familias: +8 pts. 4 familias: +10 pts' },
  { icon: '🥇', title: 'First del día', detail: 'Primero en reportar: +5 pts. Primero en recolectar: +6 pts' },
  { icon: '🏆', title: 'Top del día', detail: '1°: +20 pts. 2°: +15 pts. 3°: +10 pts' }
]

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
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const avatarColor = getAvatarColor(profileData?.name || user?.name || 'U')
  const displayProfileImage = profileData?.profile_image || user?.profile_image

  return (
    <Container>
      <Card>
        <Avatar $hasImage={!!displayProfileImage} $bgColor={avatarColor}>
          {displayProfileImage ? (
            <AvatarImage src={displayProfileImage} alt="Profile" />
          ) : (
            user?.name?.[0]?.toUpperCase() || 'U'
          )}
        </Avatar>
        <Name>{profileData?.name || user?.name}</Name>
        <Email>{profileData?.email || user?.email}</Email>
        {profileData?.city && (
          <div style={{ fontSize: '10px', color: '#666', margin: '.5rem 0 3rem 0' }}>
            📍 {profileData.city}{profileData.state && `, ${profileData.state}`}{profileData.country && `, ${profileData.country}`}
          </div>
        )}
        <EditProfileButton onClick={() => navigate('/app/edit-profile')}>
          Editar Perfil
        </EditProfileButton>
      </Card>

      <Section>
        <SectionTitle>🌿 Eco Points</SectionTitle>
        <PointsCard onClick={() => navigate('/app/points')}>
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
        <MenuItem onClick={() => setIsModalOpen(true)}>
          <MenuIconWrapper>
            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
          </MenuIconWrapper>
          <MenuLabel>Cómo obtener puntos</MenuLabel>
          <IconChevron />
        </MenuItem>
        <MenuItem onClick={() => navigate('/app/about')}>
          <MenuIconWrapper>
            <IconCircle />
          </MenuIconWrapper>
          <MenuLabel>Acerca de Trash2Treasure</MenuLabel>
          <IconChevron />
        </MenuItem>
      </Section>

      <Section>
        <SectionTitle>Configuración</SectionTitle>
        <MenuItem onClick={logout}>
            <ExitText>Cerrar Sesión</ExitText>
          <MenuIconWrapper>
            <GoOut />
          </MenuIconWrapper>
          </MenuItem>
      </Section>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>ℹ️ Cómo obtener puntos</ModalTitle>
            <InfoList>
              {POINTS_INFO.map((info, index) => (
                <InfoItem key={index}>
                  <InfoIcon>{info.icon}</InfoIcon>
                  <InfoContent>
                    <InfoTitle>{info.title}</InfoTitle>
                    <InfoDetail>{info.detail}</InfoDetail>
                  </InfoContent>
                </InfoItem>
              ))}
            </InfoList>
            <ModalClose onClick={() => setIsModalOpen(false)}>×</ModalClose>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  )
}