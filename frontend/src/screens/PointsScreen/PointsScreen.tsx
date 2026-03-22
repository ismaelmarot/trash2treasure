import { useState, useEffect, useCallback, useRef } from 'react'
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
  Container,
  DivisionBadge,
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
  Subtitle,
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
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [activeSection, setActiveSection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pointsData, setPointsData] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])
  const [challengeProgress, setChallengeProgress] = useState<any>({})
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeStatsTab, setActiveStatsTab] = useState('ranking')
  const [activeChallengeTab, setActiveChallengeTab] = useState('daily')
  const [refreshKey, setRefreshKey] = useState(0)
  const [sectionLoaded, setSectionLoaded] = useState<{[key: number]: boolean}>({ 0: false, 1: false, 2: false })

  const openAchievementModal = (achievement: any) => {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAchievement(null)
  }

  const fetchBasicData = useCallback(async () => {
    if (!token) return
    try {
      const pointsRes = await fetch(`${API_BASE_URL}/points/my-points`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await pointsRes.json()
      setPointsData(data)
      setAchievements(data.achievements || [])
      setChallenges(data.challenges || [])
      setChallengeProgress(data.challengeProgress || {})
    } catch (err) {
      console.error('Error fetching points data:', err)
    }
  }, [token])

  const fetchRanking = useCallback(async () => {
    if (!token) return
    try {
      const rankingRes = await fetch(`${API_BASE_URL}/points/ranking`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (rankingRes.ok) {
        const rankingData = await rankingRes.json()
        setRanking(rankingData.ranking || [])
      }
    } catch (err) {
      console.error('Error fetching ranking:', err)
    }
  }, [token])

  useEffect(() => {
    const loadSection = async () => {
      setLoading(true)
      await fetchBasicData()
      if (activeSection === 0) {
        await fetchRanking()
      }
      setLoading(false)
      setSectionLoaded(prev => ({ ...prev, [activeSection]: true }))
    }
    loadSection()
  }, [refreshKey, activeSection, fetchBasicData, fetchRanking])

  useEffect(() => {
    if (!sectionLoaded[activeSection]) {
      setRefreshKey(k => k + 1)
    }
  }, [activeSection])

  if (loading && !sectionLoaded[activeSection]) return <Loading>Cargando...</Loading>
  if (!pointsData) return <Loading>Error al cargar datos</Loading>

  const { points, division } = pointsData

  const sectionTitles = ['Eco Points', 'Logros', 'Desafíos']

  const renderEcoPoints = () => (
    <>
      <Header>
        <Title>🍃 Tu impacto en la comunidad</Title>
      </Header>

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

      <TabContainer>
        <Tab $active={activeStatsTab === 'ranking'} onClick={() => setActiveStatsTab('ranking')}>Ranking</Tab>
        <Tab $active={activeStatsTab === 'stats'} onClick={() => setActiveStatsTab('stats')}>Stats</Tab>
      </TabContainer>

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

      {activeStatsTab === 'stats' && (
        <TabContent style={{ gridTemplateColumns: '1fr', gap: '8px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Top Categorías</div>
            {Object.entries(points.category_points || {}).sort(([,a]: [string, any], [,b]: [string, any]) => Number(b) - Number(a)).slice(0, 3).map(([cat, pts]) => (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                <span style={{ fontWeight: 'bold' }}>{String(pts)} pts</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Por Familia</div>
            {Object.entries(points.family_reports || {}).map(([family, count]) => (
              <div key={family} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ textTransform: 'capitalize' }}>{family}</span>
                <span style={{ fontWeight: 'bold' }}>{String(count)} items</span>
              </div>
            ))}
          </div>
        </TabContent>
      )}
    </>
  )

  const renderLogros = () => (
    <>
      <Header>
        <Title>🏆 Logros</Title>
        <Subtitle>Tu historial de reconocimientos</Subtitle>
      </Header>

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
    </>
  )

  const renderDesafios = () => (
    <>
      <Header>
        <Title>🎯 Desafíos</Title>
        <Subtitle>Completa para ganar estrellas y copas</Subtitle>
      </Header>

      <TabContainer>
        <Tab $active={activeChallengeTab === 'daily'} onClick={() => setActiveChallengeTab('daily')}>Diario</Tab>
        <Tab $active={activeChallengeTab === 'weekly'} onClick={() => setActiveChallengeTab('weekly')}>Semanal</Tab>
        <Tab $active={activeChallengeTab === 'monthly'} onClick={() => setActiveChallengeTab('monthly')}>Mensual</Tab>
        <Tab $active={activeChallengeTab === 'annual'} onClick={() => setActiveChallengeTab('annual')}>Anual</Tab>
      </TabContainer>

      <TabContent>
        {(challenges || []).filter((c: any) => c.type === activeChallengeTab).map((challenge: any) => {
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
  )

  const sections = [renderEcoPoints(), renderLogros(), renderDesafios()]

  return (
    <Container ref={containerRef}>
      {/* Indicador de sección con estilo Tab */}
      <TabContainer style={{ position: 'fixed', top: '56px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%' }}>
        {sectionTitles.map((title, idx) => (
          <Tab
            key={idx}
            $active={idx === activeSection}
            onClick={() => {
              setActiveSection(idx)
              containerRef.current?.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' })
            }}
          >
            {title}
          </Tab>
        ))}
      </TabContainer>

      <div 
        ref={containerRef as any}
        onScroll={(e: any) => {
          const scrollTop = e.target.scrollTop
          const sectionHeight = window.innerHeight
          const newSection = Math.round(scrollTop / sectionHeight)
          if (newSection !== activeSection && newSection >= 0 && newSection <= 2) {
            setActiveSection(newSection)
          }
        }}
        style={{ 
          overflowY: 'auto', 
          height: 'calc(100vh - 60px)',
          scrollSnapType: 'y mandatory'
        }}
      >
        <div style={{ minHeight: '100vh', scrollSnapAlign: 'start', paddingTop: '80px' }}>
          {sections[0]}
        </div>
        <div style={{ minHeight: '100vh', scrollSnapAlign: 'start', paddingTop: '80px' }}>
          {sections[1]}
        </div>
        <div style={{ minHeight: '100vh', scrollSnapAlign: 'start', paddingTop: '80px' }}>
          {sections[2]}
        </div>
      </div>

      <AchievementModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </Container>
  )
}
