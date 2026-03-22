import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { API_BASE_URL, COLORS } from '@/constants'
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
  BarHeader,
  BarLabel,
  BarValue,
  Container,
  Divider,
  DivisionBadge,
  DivisionCard,
  DivisionGrid,
  DivisionHeader,
  DivisionIcon,
  DivisionInfo,
  DivisionLevel,
  DivisionName,
  DivisionRange,
  Header,
  Loading,
  PointsCard,
  PointsHeader,
  PointsLabel,
  PointsValue,
  Position,
  ProgressBar,
  ProgressFill,
  ProgressStats,
  RankingItem,
  SectionTitle,
  StatItem,
  StatLabel,
  StatsRow,
  StatValue,
  Subtitle,
  Tab,
  TabContainer,
  TabContent,
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
  { level: '🌱 Nivel bajo', items: [
    { name: 'Curioso Verde', min: 0, max: 100, icon: '🌱' },
    { name: 'Recolector Novato', min: 0, max: 200, icon: '♻️' },
    { name: 'Semilla', min: 0, max: 150, icon: '🌿' },
    { name: 'Despertando', min: 0, max: 200, icon: '☀️' }
  ]},
  { level: '♻️ Nivel medio bajo', items: [
    { name: 'Eco Aprendiz', min: 200, max: 400, icon: '📚' },
    { name: 'Separador Serial', min: 300, max: 600, icon: '📊' },
    { name: 'Clasificador Ninja', min: 400, max: 700, icon: '🥷' },
    { name: 'Anti Basura', min: 300, max: 600, icon: '🚫' }
  ]},
  { level: '🌿 Nivel medio', items: [
    { name: 'Recuperador Urbano', min: 500, max: 900, icon: '🏙️' },
    { name: 'Guardián del Bosque', min: 600, max: 1000, icon: '🌲' },
    { name: 'Reutilizador Pro', min: 700, max: 1200, icon: '🔄' },
    { name: 'Eco Hacker', min: 800, max: 1200, icon: '💻' }
  ]},
  { level: '🌳 Nivel medio alto', items: [
    { name: 'Maestro del Reciclaje', min: 1000, max: 1500, icon: '🏆' },
    { name: 'Alquimista de Residuos', min: 1200, max: 1700, icon: '⚗️' },
    { name: 'Ingeniero Verde', min: 1300, max: 1800, icon: '🔧' },
    { name: 'Transformador', min: 1200, max: 1600, icon: '⚡' }
  ]},
  { level: '🌎 Nivel alto', items: [
    { name: 'Defensor del Planeta', min: 1500, max: 2000, icon: '🌍' },
    { name: 'Titán Verde', min: 1800, max: 2500, icon: '💪' },
    { name: 'Eco Estratega', min: 1700, max: 2300, icon: '🧠' },
    { name: 'Señor del Compost', min: 2000, max: 2500, icon: '👑' }
  ]},
  { level: '🚀 Nivel épico', items: [
    { name: 'Gaia Ascendido', min: 2000, max: Infinity, icon: '🚀' },
    { name: 'Leyenda Sustentable', min: 2500, max: Infinity, icon: '⭐' },
    { name: 'Arquitecto del Futuro', min: 3000, max: Infinity, icon: '🏗️' },
    { name: 'Deidad del Reciclaje', min: 5000, max: Infinity, icon: '💫' }
  ]}
]

const ACHIEVEMENTS = [
  { id: 'first_report', name: 'Primer Reporte', description: 'Reporta tu primer item', icon: '📸', points: 5 },
  { id: 'first_collect', name: 'Primera Recolección', description: 'Recolecta tu primer item', icon: '♻️', points: 10 },
  { id: 'reporter_5', name: 'Primer Paso', description: '5 items reportados', icon: '📸', points: 5 },
  { id: 'reporter_10', name: 'Reportero', description: '10 items reportados', icon: '📸', points: 10 },
  { id: 'reporter_25', name: 'Reportero Junior', description: '25 items reportados', icon: '📸', points: 15 },
  { id: 'reporter_50', name: 'Reportero Pro', description: '50 items reportados', icon: '📸', points: 25 },
  { id: 'reporter_75', name: 'Reportero Senior', description: '75 items reportados', icon: '📸', points: 35 },
  { id: 'reporter_100', name: 'Reportero Master', description: '100 items reportados', icon: '📸', points: 50 },
  { id: 'reporter_200', name: 'Reportero Legendario', description: '200 items reportados', icon: '📸', points: 100 },
  { id: 'reporter_500', name: 'Maestro Reportero', description: '500 items reportados', icon: '📸', points: 250 },
  { id: 'collector_5', name: 'Primera Misión', description: '5 items recolectados', icon: '♻️', points: 8 },
  { id: 'collector_10', name: 'Recolector', description: '10 items recolectados', icon: '♻️', points: 15 },
  { id: 'collector_25', name: 'Recolector Junior', description: '25 items recolectados', icon: '♻️', points: 20 },
  { id: 'collector_50', name: 'Recolector Pro', description: '50 items recolectados', icon: '♻️', points: 30 },
  { id: 'collector_75', name: 'Recolector Senior', description: '75 items recolectados', icon: '♻️', points: 45 },
  { id: 'collector_100', name: 'Recolector Master', description: '100 items recolectados', icon: '♻️', points: 60 },
  { id: 'collector_200', name: 'Recolector Legendario', description: '200 items recolectados', icon: '♻️', points: 120 },
  { id: 'collector_500', name: 'Maestro Recolector', description: '500 items recolectados', icon: '♻️', points: 300 },
  { id: 'streak_3', name: 'Racha de 3', description: '3 días seguidos activo', icon: '🔥', points: 4 },
  { id: 'streak_5', name: 'Racha de 5', description: '5 días seguidos activo', icon: '🔥', points: 6 },
  { id: 'streak_7', name: 'Una Semana', description: '7 días seguidos activo', icon: '🔥', points: 8 },
  { id: 'streak_10', name: 'Racha de 10', description: '10 días seguidos activo', icon: '🔥', points: 15 },
  { id: 'streak_14', name: 'Dos Semanas', description: '14 días seguidos activo', icon: '🔥', points: 20 },
  { id: 'streak_30', name: 'Un Mes', description: '30 días seguidos activo', icon: '🔥', points: 50 },
  { id: 'streak_60', name: 'Dos Meses', description: '60 días seguidos activo', icon: '🔥', points: 120 },
  { id: 'streak_100', name: 'Cien Días', description: '100 días seguidos activo', icon: '🔥', points: 250 },
  { id: 'eco_master', name: 'Eco Master', description: '5 items ECO en 1 día', icon: '🌱', points: 10 },
  { id: 'eco_warrior', name: 'Eco Warrior', description: '20 items ECO reportados', icon: '🌱', points: 25 },
  { id: 'tech_hunter', name: 'Tech Hunter', description: '3 items TECH en 1 día', icon: '⚡', points: 10 },
  { id: 'tech_expert', name: 'Tech Expert', description: '15 items TECH reportados', icon: '⚡', points: 25 },
  { id: 'heavy_duty', name: 'Heavy Duty', description: '2 items HEAVY en 1 día', icon: '🏗️', points: 10 },
  { id: 'heavy_lifter', name: 'Heavy Lifter', description: '10 items HEAVY reportados', icon: '🏗️', points: 25 },
  { id: 'packaging_master', name: 'Packaging Master', description: '30 items PACKAGING reportados', icon: '📦', points: 25 },
  { id: 'reuse_champion', name: 'Reuse Champion', description: '15 items REUSE reportados', icon: '👕', points: 25 },
  { id: 'balanced_cleaner', name: 'Balanced Cleaner', description: '1 de cada familia en 1 día', icon: '🌍', points: 20 },
  { id: 'family_diverse', name: 'Diversidad', description: 'Usa 4 familias distintas', icon: '🌈', points: 10 },
  { id: 'variety_3', name: 'Tres Familias', description: 'Reporta items de 3 familias diferentes', icon: '🌈', points: 10 },
  { id: 'variety_4', name: 'Cuatro Familias', description: 'Reporta items de 4 familias diferentes', icon: '🌈', points: 15 },
  { id: 'variety_5', name: 'Cinco Familias', description: 'Reporta items de 5 familias diferentes', icon: '🌈', points: 20 },
  { id: 'variety_6', name: 'Todas las Familias', description: 'Reporta items de las 6 familias', icon: '🌈', points: 30 },
  { id: 'speed_collector', name: 'Recolector Rápido', description: 'Recolecta en <1 hora', icon: '⚡', points: 3 },
  { id: 'speed_3', name: 'Triple Rápido', description: 'Recolecta 3 items en menos de 6 horas', icon: '⚡', points: 10 },
  { id: 'speed_5', name: 'Quíntuple Rápido', description: 'Recolecta 5 items en menos de 6 horas', icon: '⚡', points: 20 },
  { id: 'flash_collect', name: 'Flash Collect', description: 'Recolecta 1 item en menos de 30 minutos', icon: '⚡', points: 5 },
  { id: 'combo_2', name: 'Combo x2', description: '2 items misma familia', icon: '🔁', points: 2 },
  { id: 'combo_3', name: 'Combo x3', description: '3 items misma familia', icon: '🔁', points: 4 },
  { id: 'combo_5', name: 'Combo x5', description: '5 items misma familia', icon: '🔁', points: 7 },
  { id: 'night_owl', name: 'Búho Nocturno', description: 'Reporta un item entre 00:00 y 06:00', icon: '🦉', points: 5 },
  { id: 'early_bird', name: 'Madrugador', description: 'Reporta un item entre 05:00 y 07:00', icon: '🐦', points: 5 },
  { id: 'weekend_warrior', name: 'Guerrero del Fin de Semana', description: 'Reporta 5 items en un fin de semana', icon: '📅', points: 15 },
  { id: 'birthday_gift', name: 'Regalo de Cumpleaños', description: 'Reporta un item en tu cumpleaños', icon: '🎂', points: 10 }
]

export function PointsScreen() {
  const { token, user } = useAuth()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [pointsData, setPointsData] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('daily')
  const [activeStatsTab, setActiveStatsTab] = useState('ranking')
  const [refreshKey, setRefreshKey] = useState(0)

  const openAchievementModal = (achievement: any) => {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAchievement(null)
  }

  const refreshData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const pointsRes = await fetch(`${API_BASE_URL}/points/my-points`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await pointsRes.json()
      setPointsData(data)

      const rankingRes = await fetch(`${API_BASE_URL}/points/ranking`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (rankingRes.ok) {
        const rankingData = await rankingRes.json()
        setRanking(rankingData.ranking || [])
      } else {
        setRanking([])
      }
    } catch (err) {
      console.error('Error fetching points data:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  // Refrescar cuando cambia de ruta (al volver a esta pantalla)
  useEffect(() => {
    refreshData()
  }, [refreshKey, location.pathname, refreshData])

  // Exponer función de refresh globalmente para otras pantallas
  useEffect(() => {
    (window as any).refreshPointsData = () => {
      setRefreshKey(k => k + 1)
    }
    return () => {
      delete (window as any).refreshPointsData
    }
  }, [])

  if (loading) return <Loading>Cargando...</Loading>
  if (!pointsData) return <Loading>Error al cargar datos</Loading>

  const { points, division, achievements: achievementsFromBackend, challengeProgress: progressFromBackend, challenges } = pointsData

  // Usar los logros del backend (que ya tienen unlocked calculado)
  const achievements = achievementsFromBackend || ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  const challengeProgress = progressFromBackend || {}

  // Calcular totales
  const totalCategoryPoints = Object.values(points.category_points || {}).reduce((sum: number, v) => sum + (Number(v) || 0), 0)
  const totalFamilyReports = Object.values(points.family_reports || {}).reduce((sum: number, v) => sum + (Number(v) || 0), 0)

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

      {/* Pestañas de Stats */}
      <TabContainer>
        <Tab $active={activeStatsTab === 'ranking'} onClick={() => setActiveStatsTab('ranking')}>Ranking</Tab>
        <Tab $active={activeStatsTab === 'divisions'} onClick={() => setActiveStatsTab('divisions')}>Divisiones</Tab>
        <Tab $active={activeStatsTab === 'categories'} onClick={() => setActiveStatsTab('categories')}>Categorías</Tab>
        <Tab $active={activeStatsTab === 'families'} onClick={() => setActiveStatsTab('families')}>Familias</Tab>
      </TabContainer>

      {/* Ranking */}
      {activeStatsTab === 'ranking' && (
        <TabContent style={{ gridTemplateColumns: '1fr' }}>
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
        </TabContent>
      )}

      {/* Divisiones */}
      {activeStatsTab === 'divisions' && (
        <TabContent style={{ gridTemplateColumns: '1fr' }}>
          {DIVISIONS.map((level) => (
            <div key={level.level}>
              <DivisionLevel>{level.level}</DivisionLevel>
              <DivisionGrid>
                {level.items.map((div) => {
                  const isCurrent = div.name === division
                  const isPast = points.total_points >= div.max
                  const pointsFromMin = points.total_points - div.min
                  const pointsToMax = div.max - div.min
                  const progress = div.max === Infinity ? 100 : Math.min((pointsFromMin / pointsToMax) * 100, 100)
                  const pointsRemaining = div.max === Infinity ? 0 : Math.max(div.max - points.total_points, 0)
                  
                  return (
                    <DivisionCard key={div.name} $isCurrent={isCurrent} $isPast={isPast}>
                      <DivisionIcon $isCurrent={isCurrent}>{div.icon}</DivisionIcon>
                      <DivisionInfo>
                        <DivisionHeader>
                          <DivisionName>{div.name}</DivisionName>
                          <DivisionRange>{div.min} - {div.max === Infinity ? '∞' : div.max} pts</DivisionRange>
                        </DivisionHeader>
                        {isCurrent && (
                          <>
                            <ProgressBar>
                              <ProgressFill $progress={progress} />
                            </ProgressBar>
                            <ProgressStats>
                              <span>{pointsFromMin} pts</span>
                              <span>{pointsRemaining > 0 
                                ? `${pointsRemaining} pts para siguiente nivel` 
                                : 'Nivel máximo'}</span>
                            </ProgressStats>
                          </>
                        )}
                      </DivisionInfo>
                      {isCurrent && <span style={{ fontSize: '12px', color: 'white', fontWeight: '600', marginLeft: '12px' }}>Tú</span>}
                    </DivisionCard>
                  )
                })}
              </DivisionGrid>
            </div>
          ))}
        </TabContent>
      )}

      {/* Puntos por Categoría */}
      {activeStatsTab === 'categories' && (
        <TabContent style={{ gridTemplateColumns: '1fr' }}>
          <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: COLORS.primaryDark }}>
            Total: {totalCategoryPoints} pts
          </div>
          {Object.entries(points.category_points || {}).length > 0 ? (
            Object.entries(points.category_points || {}).map(([category, catPoints]) => (
              <BarChartRow key={category}>
                <BarHeader>
                  <BarLabel>
                    {CATEGORY_INFO[category]?.icon || '📦'} {CATEGORY_INFO[category]?.name || category}
                  </BarLabel>
                  <BarValue>{catPoints as number} pts</BarValue>
                </BarHeader>
                <BarContainer>
                  <BarFill 
                    $color={CATEGORY_INFO[category]?.color || '#0071e3'} 
                    $width={(Number(catPoints) / totalCategoryPoints) * 100} 
                  />
                </BarContainer>
              </BarChartRow>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '14px', padding: '20px' }}>
              Reporta o recolecta items para ganar puntos
            </p>
          )}
        </TabContent>
      )}

      {/* Actividad por Familia */}
      {activeStatsTab === 'families' && (
        <TabContent style={{ gridTemplateColumns: '1fr' }}>
          <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: COLORS.primaryDark }}>
            Total: {totalFamilyReports} items
          </div>
          {Object.entries(points.family_reports || {}).map(([family, count]) => (
            <BarChartRow key={family}>
              <BarHeader>
                <BarLabel>
                  {FAMILY_INFO[family]?.icon || '📦'} {FAMILY_INFO[family]?.name || family}
                </BarLabel>
                <BarValue>{count as number}</BarValue>
              </BarHeader>
              <BarContainer>
                <BarFill 
                  $color={FAMILY_INFO[family]?.color || '#0071e3'} 
                  $width={(Number(count) / totalFamilyReports) * 100} 
                />
              </BarContainer>
            </BarChartRow>
          ))}
        </TabContent>
      )}

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
              <AchievementIcon $unlocked={achievement.unlocked}>{achievement.icon}</AchievementIcon>
              <AchievementName $unlocked={achievement.unlocked}>{achievement.name}</AchievementName>
              <AchievementDesc $unlocked={achievement.unlocked}>{achievement.description}</AchievementDesc>
              <div style={{ fontSize: '12px', color: achievement.unlocked ? '#34c759' : '#ccc', marginTop: '4px', fontWeight: '600' }}>
                +{achievement.points} pts
              </div>
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </AchievementsSection>

      <Divider />

      {/* Desafíos con pestañas */}
      <SectionTitle>🎯 Desafíos</SectionTitle>
      <TabContainer>
        <Tab $active={activeTab === 'daily'} onClick={() => setActiveTab('daily')}>Diario</Tab>
        <Tab $active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')}>Semanal</Tab>
        <Tab $active={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')}>Mensual</Tab>
        <Tab $active={activeTab === 'annual'} onClick={() => setActiveTab('annual')}>Anual</Tab>
      </TabContainer>
      <TabContent>
        {(challenges || []).filter((c: any) => c.type === activeTab).map((challenge: any) => {
          const progress = challengeProgress[challenge.id] || { current_progress: 0, stars: 0, trophies: 0, completed_this_period: false }
          const isActive = progress.completed_this_period
          
          return (
            <AchievementCard 
              key={challenge.id} 
              $unlocked={isActive}
              onClick={() => openAchievementModal({
                id: challenge.id,
                name: challenge.name,
                description: challenge.description,
                icon: challenge.icon,
                points: challenge.reward,
                unlocked: isActive,
                stars: progress.stars,
                filled: Math.min(progress.current_progress, challenge.target),
                trophies: progress.trophies,
                max_stars: challenge.max_stars,
                type: 'challenge'
              })}
            >
              <AchievementIcon $unlocked={isActive}>{challenge.icon}</AchievementIcon>
              <AchievementName $unlocked={isActive}>{challenge.name}</AchievementName>
              <AchievementDesc $unlocked={isActive}>{challenge.description}</AchievementDesc>
              <div style={{ fontSize: '12px', color: isActive ? '#34c759' : '#ccc', marginTop: '4px', fontWeight: '600' }}>
                +{challenge.reward} pts
              </div>
            </AchievementCard>
          )
        })}
      </TabContent>

      <AchievementModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </Container>
  )
}
