import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
import { AchievementModal } from '@/components/AchievementModal'
import {
  AchievementCard,
  AchievementDesc,
  AchievementIcon,
  AchievementName,
  AchievementsGrid,
  AchievementsSection,
  AvatarImage,
  BarChartRow,
  BarContainer,
  BarFill,
  BarLabel,
  BarValue,
  CollapsibleArrow,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleSection,
  CollapsibleSummary,
  CollapsibleTitle,
  Container,
  Divider,
  DivisionBadge,
  DivisionItem,
  DivisionList,
  DivisionName,
  DivisionRange,
  Header,
  InfoContent,
  InfoDetail,
  InfoIcon,
  InfoItem,
  InfoList,
  InfoTitle,
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

const CATEGORY_INFO: Record<string, { icon: string; name: string; color: string }> = {
  organic: { icon: '🍏', name: 'Orgánico', color: '#34c759' },
  garden: { icon: '🌿', name: 'Jardín', color: '#30d158' },
  recycle: { icon: '♻️', name: 'Reciclaje', color: '#00c7be' },
  electronics: { icon: '📱', name: 'Electrónicos', color: '#5856d6' },
  batteries: { icon: '🔋', name: 'Baterías', color: '#ff9500' },
  construction: { icon: '🧱', name: 'Construcción', color: '#af52de' },
  furniture: { icon: '🪑', name: 'Muebles', color: '#8e8e93' },
  wood: { icon: '🪵', name: 'Madera', color: '#a2845e' },
  cardboard: { icon: '📦', name: 'Cartón', color: '#bf8f68' },
  paper: { icon: '📄', name: 'Papel', color: '#ffd60a' },
  plastic: { icon: '🧴', name: 'Plástico', color: '#64d2ff' },
  bottle: { icon: '🍾', name: 'Botellas', color: '#5ac8fa' },
  glass: { icon: '🪟', name: 'Vidrio', color: '#a0d8ef' },
  clothes: { icon: '👕', name: 'Ropa', color: '#ff375f' },
  books: { icon: '📚', name: 'Libros', color: '#ff6b6b' },
  carton: { icon: '📦', name: 'Cartón', color: '#bf8f68' },
  botellas: { icon: '🍾', name: 'Botellas', color: '#5ac8fa' },
  metal: { icon: '🔩', name: 'Metal', color: '#8e8e93' },
  mixto: { icon: '♻️', name: 'Mixto', color: '#00c7be' },
  otros: { icon: '✨', name: 'Otros', color: '#ffd60a' }
}

const FAMILY_INFO: Record<string, { icon: string; name: string; color: string }> = {
  eco: { icon: '🌱', name: 'ECO', color: '#34c759' },
  tech: { icon: '⚡', name: 'TECH', color: '#5856d6' },
  heavy: { icon: '🏗️', name: 'HEAVY', color: '#af52de' },
  packaging: { icon: '📦', name: 'PACKAGING', color: '#bf8f68' },
  reuse: { icon: '👕', name: 'REUSE', color: '#ff375f' },
  special: { icon: '✨', name: 'SPECIAL', color: '#ffd60a' }
}

const DIVISIONS = [
  { name: 'Curioso Verde', min: 0, max: 100, icon: '🌱' },
  { name: 'Recolector Novato', min: 100, max: 200, icon: '♻️' },
  { name: 'Semilla', min: 200, max: 400, icon: '🌿' },
  { name: 'Eco Aprendiz', min: 400, max: 700, icon: '🌳' },
  { name: 'Guardián del Bosque', min: 700, max: 1000, icon: '🌲' },
  { name: 'Maestro del Reciclaje', min: 1000, max: 1500, icon: '🏆' },
  { name: 'Defensor del Planeta', min: 1500, max: 2000, icon: '🌍' },
  { name: 'Titán Verde', min: 2000, max: 2500, icon: '⚡' },
  { name: 'Gaia Ascendido', min: 2500, max: 3000, icon: '🚀' },
  { name: 'Leyenda Sustentable', min: 3000, max: Infinity, icon: '👑' }
]

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

export function PointsScreen() {
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pointsData, setPointsData] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Estados para secciones desplegables
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isFamiliesOpen, setIsFamiliesOpen] = useState(false)
  const [isDivisionsOpen, setIsDivisionsOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const openAchievementModal = (achievement: any) => {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAchievement(null)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pointsRes = await fetch(`${API_BASE_URL}/points/my-points`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const pointsData = await pointsRes.json()
        setPointsData(pointsData)

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

  const maxCategoryPoints = Math.max(...Object.values(points.category_points || {}).map(v => Number(v) || 0), 1)
  const maxFamilyReports = Math.max(...Object.values(points.family_reports || {}).map(v => Number(v) || 0), 1)
  
  // Totales para resumen
  const totalCategories = Object.keys(points.category_points || {}).length
  const totalFamilies = Object.values(points.family_reports || {}).filter(v => Number(v) > 0).length

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
            $position={index + 1}
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

      {/* Divisiones */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsDivisionsOpen(!isDivisionsOpen)}>
          <CollapsibleTitle>🏅 Divisiones</CollapsibleTitle>
          <CollapsibleArrow $isOpen={isDivisionsOpen}>▼</CollapsibleArrow>
        </CollapsibleHeader>
        <CollapsibleContent $isOpen={isDivisionsOpen}>
          <DivisionList>
            {DIVISIONS.map((div) => {
              const isCurrent = div.name === division
              const isPast = points.total_points >= div.max
              return (
                <DivisionItem key={div.name} $isCurrent={isCurrent} $isPast={isPast}>
                  <DivisionName>
                    {div.icon} {div.name}
                    {isCurrent && ' (Tú)'}
                  </DivisionName>
                  <DivisionRange>{div.min} - {div.max === Infinity ? '∞' : div.max} pts</DivisionRange>
                </DivisionItem>
              )
            })}
          </DivisionList>
        </CollapsibleContent>
      </CollapsibleSection>

      {/* Puntos por Categoría (desplegable) */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
          <CollapsibleTitle>
            📊 Puntos por Categoría
          </CollapsibleTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CollapsibleSummary>{totalCategories} categorías</CollapsibleSummary>
            <CollapsibleArrow $isOpen={isCategoriesOpen}>▼</CollapsibleArrow>
          </div>
        </CollapsibleHeader>
        <CollapsibleContent $isOpen={isCategoriesOpen}>
          {Object.entries(points.category_points || {}).length > 0 ? (
            Object.entries(points.category_points || {}).map(([category, catPoints]) => (
              <BarChartRow key={category}>
                <BarLabel>
                  {CATEGORY_INFO[category]?.icon || '📦'} {CATEGORY_INFO[category]?.name || category}
                </BarLabel>
                <BarContainer>
                  <BarFill 
                    $color={CATEGORY_INFO[category]?.color || '#0071e3'} 
                    $width={(Number(catPoints) / maxCategoryPoints) * 100} 
                  />
                </BarContainer>
                <BarValue>{catPoints as number}</BarValue>
              </BarChartRow>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '14px' }}>
              Reporta o recolecta items para ganar puntos
            </p>
          )}
        </CollapsibleContent>
      </CollapsibleSection>

      {/* Actividad por Familia (desplegable) */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsFamiliesOpen(!isFamiliesOpen)}>
          <CollapsibleTitle>
            🏠 Actividad por Familia
          </CollapsibleTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CollapsibleSummary>{totalFamilies} familias</CollapsibleSummary>
            <CollapsibleArrow $isOpen={isFamiliesOpen}>▼</CollapsibleArrow>
          </div>
        </CollapsibleHeader>
        <CollapsibleContent $isOpen={isFamiliesOpen}>
          {Object.entries(points.family_reports || {}).map(([family, count]) => (
            <BarChartRow key={family}>
              <BarLabel>
                {FAMILY_INFO[family]?.icon || '📦'} {FAMILY_INFO[family]?.name || family}
              </BarLabel>
              <BarContainer>
                <BarFill 
                  $color={FAMILY_INFO[family]?.color || '#0071e3'} 
                  $width={(Number(count) / maxFamilyReports) * 100} 
                />
              </BarContainer>
              <BarValue>{count as number}</BarValue>
            </BarChartRow>
          ))}
        </CollapsibleContent>
      </CollapsibleSection>

      <Divider />

      {/* Cómo obtener puntos (desplegable) */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsInfoOpen(!isInfoOpen)}>
          <CollapsibleTitle>
            ℹ️ Cómo obtener puntos
          </CollapsibleTitle>
          <CollapsibleArrow $isOpen={isInfoOpen}>▼</CollapsibleArrow>
        </CollapsibleHeader>
        <CollapsibleContent $isOpen={isInfoOpen}>
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
        </CollapsibleContent>
      </CollapsibleSection>

      <Divider />

      {/* Logros */}
      <SectionTitle>🏅 Logros</SectionTitle>
      <AchievementsSection>
        <AchievementsGrid>
          {achievements.map((achievement: any) => (
            <AchievementCard 
              key={achievement.id} 
              $unlocked={achievement.unlocked}
              onClick={() => openAchievementModal(achievement)}
            >
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <AchievementName>{achievement.name}</AchievementName>
              <AchievementDesc>{achievement.description}</AchievementDesc>
              {achievement.unlocked && (
                <div style={{ fontSize: '12px', color: '#34c759', marginTop: '4px', fontWeight: '600' }}>
                  +{achievement.points} pts
                </div>
              )}
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </AchievementsSection>

      <AchievementModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </Container>
  )
}
