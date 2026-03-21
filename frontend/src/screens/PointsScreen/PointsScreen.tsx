import { useState, useEffect } from 'react'
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
  CollapsibleArrow,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleSection,
  CollapsibleTitle,
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
  ProgressBar,
  ProgressFill,
  ProgressStats,
  RankingItem,
  RankingList,
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
  { id: 'reporter_10', name: 'Reportero', description: '10 items reportados', icon: '📸', points: 10 },
  { id: 'reporter_50', name: 'Reportero Pro', description: '50 items reportados', icon: '📸', points: 25 },
  { id: 'reporter_100', name: 'Reportero Master', description: '100 items reportados', icon: '📸', points: 50 },
  { id: 'collector_10', name: 'Recolector', description: '10 items recolectados', icon: '♻️', points: 15 },
  { id: 'collector_50', name: 'Recolector Pro', description: '50 items recolectados', icon: '♻️', points: 30 },
  { id: 'collector_100', name: 'Recolector Master', description: '100 items recolectados', icon: '♻️', points: 60 },
  { id: 'streak_3', name: 'Racha de 3', description: '3 días seguidos activo', icon: '🔥', points: 4 },
  { id: 'streak_5', name: 'Racha de 5', description: '5 días seguidos activo', icon: '🔥', points: 6 },
  { id: 'streak_10', name: 'Racha de 10', description: '10 días seguidos activo', icon: '🔥', points: 15 },
  { id: 'eco_master', name: 'Eco Master', description: '5 items ECO en 1 día', icon: '🌱', points: 10 },
  { id: 'tech_hunter', name: 'Tech Hunter', description: '3 items TECH en 1 día', icon: '⚡', points: 10 },
  { id: 'heavy_duty', name: 'Heavy Duty', description: '2 items HEAVY en 1 día', icon: '🏗️', points: 10 },
  { id: 'balanced_cleaner', name: 'Balanced Cleaner', description: '1 de cada familia en 1 día', icon: '🌍', points: 20 },
  { id: 'family_diverse', name: 'Diversidad', description: 'Usa 4 familias distintas', icon: '🌈', points: 10 },
  { id: 'speed_collector', name: 'Recolector Rápido', description: 'Recolecta en <1 hora', icon: '⚡', points: 3 },
  { id: 'combo_2', name: 'Combo x2', description: '2 items misma familia', icon: '🔁', points: 2 },
  { id: 'combo_3', name: 'Combo x3', description: '3 items misma familia', icon: '🔁', points: 4 },
  { id: 'combo_5', name: 'Combo x5', description: '5 items misma familia', icon: '🔁', points: 7 }
]

const CHALLENGES = {
  daily: [
    { id: 'daily_report_3', name: 'Reportero Diario', description: 'Reporta 3 items', icon: '📸', target: 3, reward: 4, type: 'reports' },
    { id: 'daily_report_5', name: 'Reportero Intenso', description: 'Reporta 5 items', icon: '📸', target: 5, reward: 7, type: 'reports' },
    { id: 'daily_collect_3', name: 'Recolector Diario', description: 'Recolecta 3 items', icon: '♻️', target: 3, reward: 7, type: 'collected' },
    { id: 'daily_collect_5', name: 'Recolector Intenso', description: 'Recolecta 5 items', icon: '♻️', target: 5, reward: 12, type: 'collected' },
    { id: 'daily_families_2', name: 'Diversidad Diaria', description: 'Usa 2 familias', icon: '🌈', target: 2, reward: 10, type: 'families' },
    { id: 'daily_families_3', name: 'Multifamilia', description: 'Usa 3 familias', icon: '🌈', target: 3, reward: 20, type: 'families' },
    { id: 'daily_speed', name: 'Velocista', description: '3 items <6h', icon: '⚡', target: 3, reward: 3, type: 'speed' }
  ],
  weekly: [
    { id: 'weekly_report_10', name: 'Reportero Semanal', description: '10 items esta semana', icon: '📸', target: 10, reward: 30, type: 'reports' },
    { id: 'weekly_collect_10', name: 'Recolector Semanal', description: '10 items esta semana', icon: '♻️', target: 10, reward: 30, type: 'collected' },
    { id: 'weekly_categories_5', name: 'Variado', description: '5 categorías esta semana', icon: '📊', target: 5, reward: 10, type: 'categories' },
    { id: 'weekly_families_4', name: 'Multifamilia Semanal', description: '4 familias esta semana', icon: '🌈', target: 4, reward: 50, type: 'families' },
    { id: 'weekly_streak', name: 'Racha Semanal', description: '7 días activo', icon: '🔥', target: 7, reward: 15, type: 'streak' }
  ],
  monthly: [
    { id: 'monthly_report_50', name: 'Reportero Mensual', description: '50 items este mes', icon: '📸', target: 50, reward: 50, type: 'reports' },
    { id: 'monthly_report_100', name: 'Reportero Elite', description: '100 items este mes', icon: '📸', target: 100, reward: 120, type: 'reports' },
    { id: 'monthly_collect_50', name: 'Recolector Mensual', description: '50 items este mes', icon: '♻️', target: 50, reward: 100, type: 'collected' },
    { id: 'monthly_collect_100', name: 'Recolector Elite', description: '100 items este mes', icon: '♻️', target: 100, reward: 240, type: 'collected' },
    { id: 'monthly_families_5', name: 'Versatilidad', description: '50 items en 4+ familias', icon: '🌍', target: 50, reward: 400, type: 'families' }
  ],
  annual: [
    { id: 'annual_eco_200', name: 'Eco Impact', description: '200 items ECO', icon: '🌱', target: 200, reward: 1000, type: 'eco' },
    { id: 'annual_tech_100', name: 'Tech Guardian', description: '100 items TECH', icon: '⚡', target: 100, reward: 1200, type: 'tech' },
    { id: 'annual_heavy_80', name: 'City Cleaner', description: '80 items HEAVY', icon: '🏗️', target: 80, reward: 1200, type: 'heavy' },
    { id: 'annual_all_500', name: 'Legend Combo', description: '500 items + todas familias', icon: '👑', target: 500, reward: 2000, type: 'all' }
  ]
}

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
  const [activeTab, setActiveTab] = useState('daily')
  
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

  const { points, division, achievements: achievementsFromBackend, completedChallenges: completedFromBackend } = pointsData

  // Usar los logros del backend (que ya tienen unlocked calculado)
  const achievements = achievementsFromBackend || ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  const completedChallenges = completedFromBackend || []

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
                      <DivisionIcon>{div.icon}</DivisionIcon>
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
        </CollapsibleContent>
      </CollapsibleSection>

      {/* Puntos por Categoría (desplegable) */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
          <CollapsibleTitle>📊 Puntos por Categoría</CollapsibleTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primaryDark }}>{totalCategoryPoints} pts</span>
            <CollapsibleArrow $isOpen={isCategoriesOpen}>▼</CollapsibleArrow>
          </div>
        </CollapsibleHeader>
        <CollapsibleContent $isOpen={isCategoriesOpen}>
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
        </CollapsibleContent>
      </CollapsibleSection>

      {/* Actividad por Familia (desplegable) */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsFamiliesOpen(!isFamiliesOpen)}>
          <CollapsibleTitle>🏠 Actividad por Familia</CollapsibleTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primaryDark }}>{totalFamilyReports} items</span>
            <CollapsibleArrow $isOpen={isFamiliesOpen}>▼</CollapsibleArrow>
          </div>
        </CollapsibleHeader>
        <CollapsibleContent $isOpen={isFamiliesOpen}>
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
        {CHALLENGES[activeTab as keyof typeof CHALLENGES].map((challenge) => {
          const isUnlocked = completedChallenges.includes(challenge.id)
          return (
            <AchievementCard 
              key={challenge.id} 
              $unlocked={isUnlocked}
              onClick={() => openAchievementModal({
                id: challenge.id,
                name: challenge.name,
                description: challenge.description,
                icon: challenge.icon,
                points: challenge.reward,
                unlocked: isUnlocked
              })}
            >
              <AchievementIcon $unlocked={isUnlocked}>{challenge.icon}</AchievementIcon>
              <AchievementName $unlocked={isUnlocked}>{challenge.name}</AchievementName>
              <AchievementDesc $unlocked={isUnlocked}>{challenge.description}</AchievementDesc>
              <div style={{ fontSize: '12px', color: isUnlocked ? '#34c759' : '#ccc', marginTop: '4px', fontWeight: '600' }}>
                +{challenge.reward} pts
              </div>
            </AchievementCard>
          )
        })}
      </TabContent>

      <Divider />

      {/* Cómo obtener puntos (desplegable) */}
      <CollapsibleSection>
        <CollapsibleHeader onClick={() => setIsInfoOpen(!isInfoOpen)}>
          <CollapsibleTitle>ℹ️ Cómo obtener puntos</CollapsibleTitle>
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

      <AchievementModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </Container>
  )
}
