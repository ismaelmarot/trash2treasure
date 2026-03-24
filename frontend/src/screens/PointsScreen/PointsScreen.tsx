import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL, CATEGORIES } from '@/constants'
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
  DivisionBadge,
  EcoScoreCard,
  EcoScoreSubtitle,
  EcoScoreTitle,
  EcoScoreLetter,
  Header,
  Loading,
  PointsCard,
  PointsHeader,
  PointsLabel,
  PointsValue,
  RankingItem,
  StatItem,
  StatLabel,
  StatsRow,
  StatValue,
  Tab,
  TabContainer,
  TabContent,
  Title,
  UserAvatar,
  UserDivision,
  UserInfo,
  UserName,
  UserPoints,
  Position,
} from './PointsScreen.styles'

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function PointsScreen() {
  const { token, user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [pointsData, setPointsData] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])
  const [challengeProgress, setChallengeProgress] = useState<any>({})
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [activeChallengePeriod, setActiveChallengePeriod] = useState('daily')
  const [activeSummaryTab, setActiveSummaryTab] = useState('categories')
  const [activeChartTab, setActiveChartTab] = useState('daily')
  const [expandedLevels, setExpandedLevels] = useState<string[]>(['bajo'])

  const openAchievementModal = (achievement: any) => {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAchievement(null)
  }

  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      // Sync para poblar historial (ejecutar una sola vez)
      if (!localStorage.getItem('history_sync_done')) {
        await fetch(`${API_BASE_URL}/points/sync`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {})
        localStorage.setItem('history_sync_done', 'true')
      }

      const pointsRes = await fetch(`${API_BASE_URL}/points/my-points`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await pointsRes.json()
      setPointsData(data)
      setAchievements(data.achievements || [])
      setChallenges(data.challenges || [])
      setChallengeProgress(data.challengeProgress || {})
      
      const rankingRes = await fetch(`${API_BASE_URL}/points/ranking`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (rankingRes.ok) {
        const rankingData = await rankingRes.json()
        setRanking(rankingData.ranking || [])
      }
    } catch (err) {
      console.error('Error fetching points data:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading>Cargando...</Loading>
  if (!pointsData || !pointsData.points) return <Loading>Error al cargar datos</Loading>

  const { points, division, ecoScore } = pointsData

  return (
    <Container>
      <Header>
        <Title>🍃 Tu impacto en la comunidad</Title>
      </Header>

      <TabContainer>
        <Tab $active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>Resumen</Tab>
        <Tab $active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')}>Ranking</Tab>
        <Tab $active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>Logros</Tab>
        <Tab $active={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')}>Desafíos</Tab>
      </TabContainer>

      {/* Resumen */}
      {activeTab === 'summary' && (
        <>
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
                <StatValue>{points.total_reports || 0}</StatValue>
                <StatLabel>Reportes</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{points.total_collected || 0}</StatValue>
                <StatLabel>Recolectados</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{points.report_points || 0}</StatValue>
                <StatLabel>Pts Reportes</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{points.collect_points || 0}</StatValue>
                <StatLabel>Pts Recolectados</StatLabel>
              </StatItem>
            </StatsRow>
          </PointsCard>

          {ecoScore && (
            <EcoScoreCard $bgColor={ecoScore.gradeColor}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <EcoScoreTitle style={{ color: '#fff', marginBottom: '4px' }}>Eco Impacto semanal</EcoScoreTitle>
                  <EcoScoreLetter style={{ color: '#fff', fontSize: '48px', fontWeight: '700', margin: '4px 0' }}>{ecoScore.grade}</EcoScoreLetter>
                  <EcoScoreSubtitle style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>{ecoScore.message}</EcoScoreSubtitle>
                </div>
                <div style={{ textAlign: 'right', color: '#fff' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>Semana anterior: {ecoScore.prevWeeklyScore || 0} pts</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>actual: {ecoScore.weeklyScore || 0} pts</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '8px' }}>
                    {ecoScore.trend === 'up' ? '↑' : ecoScore.trend === 'down' ? '↓' : '→'}
                    {ecoScore.scoreChange > 0 ? `+${ecoScore.scoreChange}` : ecoScore.scoreChange} pts
                  </div>
                </div>
              </div>
            </EcoScoreCard>
          )}

          {/* Gráficas de historial */}
          <TabContainer>
            <Tab $active={activeChartTab === 'daily'} onClick={() => setActiveChartTab('daily')}>Últimos 7 días</Tab>
            <Tab $active={activeChartTab === 'weekly'} onClick={() => setActiveChartTab('weekly')}>Semanas</Tab>
            <Tab $active={activeChartTab === 'monthly'} onClick={() => setActiveChartTab('monthly')}>Meses</Tab>
          </TabContainer>

          {activeChartTab === 'daily' && (() => {
                const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
                const history = pointsData?.history?.daily || []
                // Generar los últimos 7 días
                const days = []
                for (let i = 6; i >= 0; i--) {
                  const d = new Date()
                  d.setDate(d.getDate() - i)
                  const key = d.toISOString().split('T')[0]
                  const entry = history.find((h: any) => h.period === key)
                  days.push({
                    label: dayNames[d.getDay()],
                    reports: entry?.reports || 0,
                    collected: entry?.collected || 0,
                    points: entry?.points || 0
                  })
                }
                const maxVal = Math.max(...days.map(d => Math.max(d.reports, d.collected)), 1)
                return (
                  <div style={{ background: '#fff', borderRadius: '34px', padding: '20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '160px', padding: '10px 0' }}>
                      {days.map((d, i) => {
                        const reportH = (d.reports / maxVal) * 100
                        const collectH = (d.collected / maxVal) * 100
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '120px' }}>
                              <div style={{ width: '14px', height: `${Math.max(reportH, 2)}%`, background: '#3498db', borderRadius: '8px 8px 0 0' }} title={`Reportes: ${d.reports}`} />
                              <div style={{ width: '14px', height: `${Math.max(collectH, 2)}%`, background: '#27ae60', borderRadius: '8px 8px 0 0' }} title={`Reclamos: ${d.collected}`} />
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{d.label}</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>{d.points} pts</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

          {activeChartTab === 'weekly' && (() => {
                const history = pointsData?.history?.weekly || []
                const now = new Date()
                const year = now.getFullYear()
                // Generar todas las semanas del año
                const weeks = []
                for (let w = 1; w <= 52; w++) {
                  const key = `${year}-W${String(w).padStart(2, '0')}`
                  const entry = history.find((h: any) => h.period === key)
                  weeks.push({
                    label: `S${w}`,
                    reports: entry?.reports || 0,
                    collected: entry?.collected || 0,
                    points: entry?.points || 0
                  })
                }
                const maxVal = Math.max(...weeks.map(d => Math.max(d.reports, d.collected)), 1)
                return (
                  <div style={{ background: '#fff', borderRadius: '34px', padding: '20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '160px', padding: '10px 0', minWidth: '600px' }}>
                      {weeks.map((d, i) => {
                        const reportH = (d.reports / maxVal) * 100
                        const collectH = (d.collected / maxVal) * 100
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '120px' }}>
                              <div style={{ width: '4px', height: `${Math.max(reportH, 2)}%`, background: '#3498db', borderRadius: '4px 4px 0 0' }} />
                              <div style={{ width: '4px', height: `${Math.max(collectH, 2)}%`, background: '#27ae60', borderRadius: '4px 4px 0 0' }} />
                            </div>
                            {i % 4 === 0 && <div style={{ fontSize: '8px', color: '#999' }}>{d.label}</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

          {activeChartTab === 'monthly' && (() => {
                const history = pointsData?.history?.monthly || []
                const year = new Date().getFullYear()
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                const months = monthNames.map((name, i) => {
                  const key = `${year}-${String(i + 1).padStart(2, '0')}`
                  const entry = history.find((h: any) => h.period === key)
                  return {
                    label: name,
                    reports: entry?.reports || 0,
                    collected: entry?.collected || 0,
                    points: entry?.points || 0
                  }
                })
                const maxVal = Math.max(...months.map(d => Math.max(d.reports, d.collected)), 1)
                return (
                  <div style={{ background: '#fff', borderRadius: '34px', padding: '20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '160px', padding: '10px 0' }}>
                      {months.map((d, i) => {
                        const reportH = (d.reports / maxVal) * 100
                        const collectH = (d.collected / maxVal) * 100
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '120px' }}>
                              <div style={{ width: '10px', height: `${Math.max(reportH, 2)}%`, background: '#3498db', borderRadius: '8px 8px 0 0' }} title={`Reportes: ${d.reports}`} />
                              <div style={{ width: '10px', height: `${Math.max(collectH, 2)}%`, background: '#27ae60', borderRadius: '8px 8px 0 0' }} title={`Reclamos: ${d.collected}`} />
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>{d.label}</div>
                            <div style={{ fontSize: '9px', color: '#999' }}>{d.points} pts</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

          <TabContainer style={{ marginTop: '16px' }}>
            <Tab $active={activeSummaryTab === 'categories'} onClick={() => setActiveSummaryTab('categories')}>Categorías</Tab>
            <Tab $active={activeSummaryTab === 'families'} onClick={() => setActiveSummaryTab('families')}>Familias</Tab>
            <Tab $active={activeSummaryTab === 'level'} onClick={() => setActiveSummaryTab('level')}>Nivel</Tab>
          </TabContainer>

          {activeSummaryTab === 'categories' && (
            <TabContent style={{ gridTemplateColumns: '1fr', gap: '8px', padding: '0 8px' }}>
              {CATEGORIES.filter(c => c.id !== 'todos').map((cat) => {
                const pts = (points.category_points || {})[cat.id] || 0
                const allPts = CATEGORIES.filter(c => c.id !== 'todos').map(c => (points.category_points || {})[c.id] || 0)
                const maxPts = Math.max(...allPts, 1)
                const percentage = (pts / maxPts) * 100
                const catColor = cat.id === 'electronics' ? '#3498db' : cat.id === 'organic' ? '#27ae60' : cat.id === 'construction' ? '#e67e22' : cat.id === 'plastic' ? '#9b59b6' : cat.id === 'paper' ? '#e67e22' : cat.id === 'glass' ? '#00bcd4' : cat.id === 'metal' ? '#607d8b' : cat.id === 'clothes' ? '#e91e63' : cat.id === 'batteries' ? '#f44336' : cat.id === 'furniture' ? '#795548' : cat.id === 'wood' ? '#8d6e63' : cat.id === 'garden' ? '#4caf50' : cat.id === 'carton' ? '#ff9800' : cat.id === 'botellas' ? '#0097a7' : cat.id === 'books' ? '#3f51b5' : cat.id === 'mixto' ? '#9e9e9e' : '#999'
                return (
                  <BarChartRow key={cat.id}>
                    <BarHeader>
                      <BarLabel>
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </BarLabel>
                      <BarValue>{pts} pts</BarValue>
                    </BarHeader>
                    <BarContainer>
                      <BarFill $color={catColor} $width={percentage} />
                    </BarContainer>
                  </BarChartRow>
                )
              })}
            </TabContent>
          )}

          {activeSummaryTab === 'families' && (
            <TabContent style={{ gridTemplateColumns: '1fr', gap: '8px', padding: '0 8px' }}>
              {Object.entries(points.family_reports || {}).map(([family, count]) => {
                const maxCount = Math.max(...Object.values(points.family_reports || {}).map((v: any) => Number(v)), 1)
                const percentage = (Number(count) / maxCount) * 100
                const familyIcon = family === 'eco' ? '🍃' : family === 'tech' ? '⚡' : family === 'heavy' ? '🧱' : family === 'packaging' ? '📦' : family === 'reuse' ? '👕' : '✨'
                const familyColor = family === 'eco' ? '#27ae60' : family === 'tech' ? '#3498db' : family === 'heavy' ? '#e67e22' : family === 'packaging' ? '#9b59b6' : family === 'reuse' ? '#e91e63' : '#9e9e9e'
                return (
                  <BarChartRow key={family}>
                    <BarHeader>
                      <BarLabel>
                        <span>{familyIcon}</span>
                        <span style={{ textTransform: 'capitalize' }}>{family}</span>
                      </BarLabel>
                      <BarValue>{String(count)} items</BarValue>
                    </BarHeader>
                    <BarContainer>
                      <BarFill $color={familyColor} $width={percentage} />
                    </BarContainer>
                  </BarChartRow>
                )
              })}
            </TabContent>
          )}

          {activeSummaryTab === 'level' && (
            <TabContent style={{ gridTemplateColumns: '1fr', gap: '12px', padding: '0 8px' }}>
              {[
                { id: 'bajo', icon: '🌱', name: 'Nivel bajo', levels: [
                  { name: 'Curioso Verde', min: 0, max: 100 },
                  { name: 'Recolector Novato', min: 0, max: 200 },
                  { name: 'Semilla', min: 0, max: 150 },
                  { name: 'Despertando', min: 0, max: 200 },
                ]},
                { id: 'mediobajo', icon: '♻️', name: 'Nivel medio bajo', levels: [
                  { name: 'Eco Aprendiz', min: 200, max: 400 },
                  { name: 'Separador Serial', min: 300, max: 600 },
                  { name: 'Clasificador Ninja', min: 400, max: 700 },
                  { name: 'Anti Basura', min: 300, max: 600 },
                ]},
                { id: 'medio', icon: '🌿', name: 'Nivel medio', levels: [
                  { name: 'Recuperador Urbano', min: 500, max: 900 },
                  { name: 'Guardián del Bosque', min: 600, max: 1000 },
                  { name: 'Reutilizador Pro', min: 700, max: 1200 },
                  { name: 'Eco Hacker', min: 800, max: 1200 },
                ]},
                { id: 'medioalto', icon: '🌳', name: 'Nivel medio alto', levels: [
                  { name: 'Maestro del Reciclaje', min: 1000, max: 1500 },
                  { name: 'Alquimista de Residuos', min: 1200, max: 1700 },
                  { name: 'Ingeniero Verde', min: 1300, max: 1800 },
                  { name: 'Transformador', min: 1200, max: 1600 },
                ]},
                { id: 'alto', icon: '🌎', name: 'Nivel alto', levels: [
                  { name: 'Defensor del Planeta', min: 1500, max: 2000 },
                  { name: 'Titán Verde', min: 1800, max: 2500 },
                  { name: 'Eco Estratega', min: 1700, max: 2300 },
                  { name: 'Señor del Compost', min: 1800, max: 2500 },
                ]},
                { id: 'epico', icon: '🚀', name: 'Nivel épico', levels: [
                  { name: 'Gaia Ascendido', min: 2000, max: Infinity },
                  { name: 'Leyenda Sustentable', min: 2500, max: Infinity },
                  { name: 'Arquitecto del Futuro', min: 3000, max: Infinity },
                  { name: 'Deidad del Reciclaje', min: 4000, max: Infinity },
                ]},
              ].map((tier) => {
                const isExpanded = expandedLevels.includes(tier.id)
                const isCurrentTier = tier.levels.some(l => l.name === division)
                return (
                  <>
                    <div 
                      key={`header-${tier.id}`}
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedLevels(expandedLevels.filter(e => e !== tier.id))
                        } else {
                          setExpandedLevels([...expandedLevels, tier.id])
                        }
                      }}
                      style={{ 
                        padding: '14px 16px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: 'rgba(66, 165, 159, 1)',
                        color: 'rgba(26, 26, 26, 1)',
                        borderRadius: '35px',
                        opacity: isCurrentTier ? 1 : 0.5,
                        filter: isCurrentTier ? 'none' : 'grayscale(100%)',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{tier.icon}</span> {tier.name}
                      </span>
                      <span style={{ fontSize: '12px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
                        ▼
                      </span>
                    </div>
                    
                    {isExpanded && (
                      <div style={{ padding: '12px 0' }}>
                        {tier.levels.map((level) => {
                          const isCurrent = level.name === division
                          const isPast = level.max === Infinity ? points.total_points >= level.min : points.total_points >= level.max
                          const percentage = level.max === Infinity 
                            ? Math.min(points.total_points / level.min * 100, 100)
                            : Math.min(Math.max(0, (points.total_points - level.min) / (level.max - level.min) * 100), 100)
                          const pointsInLevel = Math.max(0, points.total_points - level.min)
                          const pointsRemaining = level.max === Infinity ? level.min - points.total_points : Math.max(0, level.max - points.total_points)
                          
                          return (
                            <div key={level.name} style={{ 
                              padding: '0 4px',
                              marginBottom: '16px',
                              opacity: isCurrent ? 1 : 0.5,
                              filter: isCurrent ? 'none' : 'grayscale(100%)',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontWeight: isCurrent ? 'bold' : 'normal', color: isPast ? '#27ae60' : '#666', fontSize: '14px' }}>
                                  {level.name}
                                </span>
                                <span style={{ fontSize: '12px', color: '#999' }}>
                                  {level.max === Infinity ? `${level.min}+ pts` : `${level.min}–${level.max} pts`}
                                </span>
                              </div>
                              <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                                <div style={{ height: '100%', width: `${percentage}%`, background: '#27ae60', borderRadius: '3px', transition: 'width 0.3s' }} />
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999' }}>
                                <span>{pointsInLevel} pts</span>
                                <span style={{ color: '#27ae60' }}>
                                  {isPast ? 'Completado' : `Faltan ${pointsRemaining}`}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )
              })}
            </TabContent>
          )}
        </>
      )}

      {/* Ranking */}
      {activeTab === 'ranking' && (
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

      {/* Logros */}
      {activeTab === 'achievements' && (
        <AchievementsSection>
          <AchievementsGrid>
            {achievements.map((achievement) => (
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
      )}

      {/* Desafíos */}
      {activeTab === 'challenges' && (
        <>
          <TabContainer>
            <Tab $active={activeChallengePeriod === 'daily'} onClick={() => setActiveChallengePeriod('daily')}>Diario</Tab>
            <Tab $active={activeChallengePeriod === 'weekly'} onClick={() => setActiveChallengePeriod('weekly')}>Semanal</Tab>
            <Tab $active={activeChallengePeriod === 'monthly'} onClick={() => setActiveChallengePeriod('monthly')}>Mensual</Tab>
            <Tab $active={activeChallengePeriod === 'annual'} onClick={() => setActiveChallengePeriod('annual')}>Anual</Tab>
          </TabContainer>
          <TabContent>
            {challenges.filter((c: any) => c.type === activeChallengePeriod).map((challenge: any) => {
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
        </>
      )}

      <AchievementModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </Container>
  )
}
