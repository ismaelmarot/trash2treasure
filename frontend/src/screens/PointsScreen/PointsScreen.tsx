import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
import {
  AchievementCard,
  AchievementDesc,
  AchievementIcon,
  AchievementName,
  AchievementsGrid,
  AchievementsSection,
  AvatarImage,
  CategoryCard,
  CategoryGrid,
  CategoryIcon,
  CategoryName,
  CategoryPoints,
  CategorySection,
  Container,
  Divider,
  DivisionBadge,
  Header,
  Loading,
  PointsCard,
  PointsHeader,
  PointsLabel,
  PointsValue,
  Position,
  RankingItem,
  RankingList,
  SectionTitle,
  StatItem,
  StatLabel,
  StatsRow,
  StatValue,
  Subtitle,
  Title,
  UserAvatar,
  UserDivision,
  UserInfo,
  UserName,
  UserPoints
} from './PointsScreen.styles'

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const CATEGORY_INFO: Record<string, { icon: string; name: string }> = {
  organic: { icon: '🍏', name: 'Orgánico' },
  garden: { icon: '🌿', name: 'Jardín' },
  recycle: { icon: '♻️', name: 'Reciclaje' },
  electronics: { icon: '📱', name: 'Electrónicos' },
  batteries: { icon: '🔋', name: 'Baterías' },
  construction: { icon: '🧱', name: 'Construcción' },
  furniture: { icon: '🪑', name: 'Muebles' },
  wood: { icon: '🪵', name: 'Madera' },
  cardboard: { icon: '📦', name: 'Cartón' },
  paper: { icon: '📄', name: 'Papel' },
  plastic: { icon: '🧴', name: 'Plástico' },
  bottle: { icon: '🍾', name: 'Botellas' },
  glass: { icon: '🪟', name: 'Vidrio' },
  clothes: { icon: '👕', name: 'Ropa' },
  books: { icon: '📚', name: 'Libros' },
  carton: { icon: '📦', name: 'Cartón' },
  botellas: { icon: '🍾', name: 'Botellas' },
  metal: { icon: '🔩', name: 'Metal' },
  mixto: { icon: '♻️', name: 'Mixto' },
  otros: { icon: '✨', name: 'Otros' }
}

export function PointsScreen() {
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pointsData, setPointsData] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener puntos del usuario
        const pointsRes = await fetch(`${API_BASE_URL}/points/my-points`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const pointsData = await pointsRes.json()
        setPointsData(pointsData)

        // Obtener ranking
        const rankingRes = await fetch(`${API_BASE_URL}/points/ranking`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const rankingData = await rankingRes.json()
        setRanking(rankingData.ranking)
      } catch (err) {
        console.error('Error fetching points data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (loading) return <Loading>Cargando...</Loading>
  if (!pointsData) return <Loading>Error al cargar datos</Loading>

  const { points, division, achievements } = pointsData

  return (
    <Container>
      <Header>
        <Title>🌿 Eco Points</Title>
        <Subtitle>Tu impacto en la comunidad</Subtitle>
      </Header>

      {/* Tarjeta de puntos principal */}
      <PointsCard>
        <PointsHeader>
          <div>
            <PointsLabel>Total Eco Points</PointsLabel>
            <PointsValue>{points.total_points}</PointsValue>
          </div>
          <DivisionBadge>{division}</DivisionBadge>
        </PointsHeader>
        <StatsRow>
          <StatItem>
            <StatValue>{points.total_reports}</StatValue>
            <StatLabel>Reportes</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{points.total_collected}</StatValue>
            <StatLabel>Recolectados</StatLabel>
          </StatItem>
        </StatsRow>
      </PointsCard>

      {/* Ranking */}
      <SectionTitle>🏆 Ranking</SectionTitle>
      <RankingList>
        {ranking.map((item, index) => (
          <RankingItem 
            key={item.user_id} 
            $isCurrentUser={item.isCurrentUser || item.user_id === user?.id}
          >
            <Position $top={index < 3}>
              {item.position}
            </Position>
            <UserAvatar>
              {item.profile_image ? (
                <AvatarImage src={item.profile_image} alt={item.name} />
              ) : (
                <span style={{ background: getAvatarColor(item.name), width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.name.charAt(0).toUpperCase()}
                </span>
              )}
            </UserAvatar>
            <UserInfo>
              <UserName>{item.name}</UserName>
              <UserDivision>{item.division}</UserDivision>
            </UserInfo>
            <UserPoints>{item.total_points} pts</UserPoints>
          </RankingItem>
        ))}
      </RankingList>

      <Divider />

      {/* Puntos por categoría */}
      <SectionTitle>📊 Puntos por Categoría</SectionTitle>
      <CategorySection>
        <CategoryGrid>
          {Object.entries(points.category_points || {}).map(([category, catPoints]) => (
            <CategoryCard key={category}>
              <CategoryIcon>{CATEGORY_INFO[category]?.icon || '📦'}</CategoryIcon>
              <CategoryName>{CATEGORY_INFO[category]?.name || category}</CategoryName>
              <CategoryPoints>{catPoints as number} pts</CategoryPoints>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </CategorySection>

      <Divider />

      {/* Logros */}
      <SectionTitle>🏅 Logros</SectionTitle>
      <AchievementsSection>
        <AchievementsGrid>
          {achievements.map((achievement: any) => (
            <AchievementCard key={achievement.id} $unlocked={achievement.unlocked}>
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <AchievementName>{achievement.name}</AchievementName>
              <AchievementDesc>{achievement.description}</AchievementDesc>
              {achievement.unlocked && (
                <div style={{ fontSize: '12px', color: '#0071e3', marginTop: '4px', fontWeight: '600' }}>
                  +{achievement.points} pts
                </div>
              )}
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </AchievementsSection>
    </Container>
  )
}
