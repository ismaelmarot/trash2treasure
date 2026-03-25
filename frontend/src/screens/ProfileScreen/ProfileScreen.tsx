import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '@/hooks'
import { API_BASE_URL } from '@/constants'
import achievement01 from '@/assets/achievements-img/achievement-01.png'
import achievement02 from '@/assets/achievements-img/achievement-02.png'
import achievement03 from '@/assets/achievements-img/achievement-03.png'
import achievement04 from '@/assets/achievements-img/achievement-04.png'
import achievement05 from '@/assets/achievements-img/achievement-05.png'
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
  const [isEcoModalOpen, setIsEcoModalOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleSendInvite = async () => {
    if (!inviteEmail) return
    try {
      await fetch(`${API_BASE_URL}/users/invite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      })
      setInviteEmail('')
      setIsInviteModalOpen(false)
      alert('¡Invitación enviada! 🎉')
    } catch (err) {
      console.error('Error sending invite:', err)
    }
  }

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
        <MenuItem onClick={() => setIsEcoModalOpen(true)}>
          <MenuIconWrapper>
            <IconCircle />
          </MenuIconWrapper>
          <MenuLabel>¿Qué son los Eco Points?</MenuLabel>
          <IconChevron />
        </MenuItem>
        <MenuItem onClick={() => setIsModalOpen(true)}>
          <MenuIconWrapper>
            <IconCircle />
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
        <MenuItem onClick={() => setIsComingSoonOpen(true)}>
          <MenuIconWrapper>
            <IconCircle />
          </MenuIconWrapper>
          <MenuLabel>Próximamente</MenuLabel>
          <IconChevron />
        </MenuItem>
      </Section>

      <Section>
        <SectionTitle>Compartir app</SectionTitle>
        <MenuItem onClick={() => setIsQrModalOpen(true)}>
          <MenuIconWrapper>
            <span style={{ fontSize: '1.2rem' }}>📱</span>
          </MenuIconWrapper>
          <MenuLabel>Código QR</MenuLabel>
          <IconChevron />
        </MenuItem>
        <MenuItem onClick={() => window.open('mailto:?subject=Trash2Treasure&body=¡Descubrí Trash2Treasure! Una app para reportar y reciclar residuos en tu zona. 🌍%0A%0Ahttps://trash2treasure-app.vercel.app')}>
          <MenuIconWrapper>
            <span style={{ fontSize: '1.2rem' }}>✉️</span>
          </MenuIconWrapper>
          <MenuLabel>Enviar por mail</MenuLabel>
          <IconChevron />
        </MenuItem>
        <MenuItem onClick={() => setIsInviteModalOpen(true)}>
          <MenuIconWrapper>
            <span style={{ fontSize: '1.2rem' }}>📨</span>
          </MenuIconWrapper>
          <MenuLabel>Invitar amigo</MenuLabel>
          <IconChevron />
        </MenuItem>
        <MenuItem onClick={() => window.open('https://wa.me/?text=¡Descubrí Trash2Treasure! 🌍 Una app para reportar y reciclar residuos en tu zona.%0A%0Ahttps://trash2treasure-app.vercel.app')}>
          <MenuIconWrapper>
            <span style={{ fontSize: '1.2rem' }}>💬</span>
          </MenuIconWrapper>
          <MenuLabel>WhatsApp</MenuLabel>
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

      {isEcoModalOpen && (
        <ModalOverlay onClick={() => setIsEcoModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>ℹ️ ¿Qué son los Eco Points?</ModalTitle>
            <InfoList>
              <InfoItem>
                <InfoIcon>🌍</InfoIcon>
                <InfoContent>
                  <InfoTitle>Tu impacto ambiental</InfoTitle>
                  <InfoDetail>Los Eco Points son puntos que ganás al reportar residuos en tu zona o reclamarlos para reciclar. Reflejan tu contribución activa al cuidado del medio ambiente.</InfoDetail>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>📈</InfoIcon>
                <InfoContent>
                  <InfoTitle>Nivel y división</InfoTitle>
                  <InfoDetail>Cuantos más puntos acumules, más alto será tu nivel (de G a A+++) y tu división en la comunidad Trash2Treasure.</InfoDetail>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>🏆</InfoIcon>
                <InfoContent>
                  <InfoTitle>Ranking y logros</InfoTitle>
                  <InfoDetail>Competí con otros usuarios en el ranking semanal y desbloqueá logros y desafíos exclusivos mientras ayudás a tu comunidad.</InfoDetail>
                </InfoContent>
              </InfoItem>
            </InfoList>
            <ModalClose onClick={() => setIsEcoModalOpen(false)}>×</ModalClose>
          </ModalContent>
        </ModalOverlay>
      )}

      {isQrModalOpen && (
        <ModalOverlay onClick={() => setIsQrModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <ModalTitle>📱 Código QR</ModalTitle>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <QRCodeSVG
                  value="https://trash2treasure-app.vercel.app"
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#1d1d1f"
                  level="H"
                  imageSettings={{
                    src: '/icon-192.png',
                    height: 56,
                    width: 56,
                    excavate: true
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>Escaneá para descargar Trash2Treasure</p>
            <ModalClose onClick={() => setIsQrModalOpen(false)}>×</ModalClose>
          </ModalContent>
        </ModalOverlay>
      )}

      {isComingSoonOpen && (
        <ModalOverlay onClick={() => setIsComingSoonOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ padding: '24px 16px' }}>
            <ModalTitle>🎖️ Logros</ModalTitle>
            <p style={{ textAlign: 'center', color: '#000000', marginBottom: '24px', fontSize: '18px' }}>
              Próximamente habrá imagenes personalizadas por los logros obtenidos.
            </p>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '8px 0'
            }}>
              <img src={achievement01} alt="Achievement 1" style={{ width: '80%', margin: '0 auto', borderRadius: '16px' }} />
              <img src={achievement02} alt="Achievement 2" style={{ width: '80%', margin: '0 auto', borderRadius: '16px' }} />
              <img src={achievement03} alt="Achievement 3" style={{ width: '80%', margin: '0 auto', borderRadius: '16px' }} />
              <img src={achievement04} alt="Achievement 4" style={{ width: '80%', margin: '0 auto', borderRadius: '16px' }} />
              <img src={achievement05} alt="Achievement 5" style={{ width: '80%', margin: '0 auto', borderRadius: '16px' }} />
            </div>
            <ModalClose onClick={() => setIsComingSoonOpen(false)}>×</ModalClose>
          </ModalContent>
        </ModalOverlay>
      )}

      {isInviteModalOpen && (
        <ModalOverlay onClick={() => setIsInviteModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ padding: '24px 16px', textAlign: 'center' }}>
            <ModalTitle>📨 Invitar amigo</ModalTitle>
            <p style={{ color: '#86868b', fontSize: '14px', marginBottom: '20px' }}>
              El recibirá un email con el diseño de Trash2Treasure
            </p>
            <input
              type="email"
              placeholder="email@ejemplo.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #e5e5ea',
                fontSize: '16px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <Button 
              onClick={handleSendInvite}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: '#42a59f',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Enviar invitación
            </Button>
            <ModalClose onClick={() => setIsInviteModalOpen(false)}>×</ModalClose>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}