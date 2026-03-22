import { useState, useEffect, useCallback } from 'react'
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
  BarHeader,
  BarLabel,
  BarValue,
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
  if (!pointsData) return <Loading>Error al cargar datos</Loading>

  const { points, division } = pointsData

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
                <StatValue>{points.total_reports}</StatValue>
                <StatLabel>Reportes</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{points.total_collected}</StatValue>
                <StatLabel>Recolectados</StatLabel>
              </StatItem>
            </StatsRow>
          </PointsCard>

          <Subtitle>Top Categorías</Subtitle>
          <TabContent style={{ gridTemplateColumns: '1fr', gap: '8px' }}>
            {Object.entries(points.category_points || {}).sort(([,a]: [string, any], [,b]: [string, any]) => Number(b) - Number(a)).slice(0, 5).map(([cat, pts]) => {
              const maxPts = Math.max(...Object.values(points.category_points || {}).map((v: any) => Number(v)), 1)
              const percentage = (Number(pts) / maxPts) * 100
              const catColor = cat === 'electronics' ? '#3498db' : cat === 'organic' ? '#27ae60' : cat === 'construction' ? '#e67e22' : '#9b59b6'
              return (
                <BarChartRow key={cat}>
                  <BarHeader>
                    <BarLabel>
                      <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                    </BarLabel>
                    <BarValue>{String(pts)} pts</BarValue>
                  </BarHeader>
                  <BarContainer>
                    <BarFill $color={catColor} $width={percentage} />
                  </BarContainer>
                </BarChartRow>
              )
            })}
          </TabContent>
          
          <Subtitle>Por Familia</Subtitle>
          <TabContent style={{ gridTemplateColumns: '1fr', gap: '8px' }}>
            {Object.entries(points.family_reports || {}).map(([family, count]) => {
              const maxCount = Math.max(...Object.values(points.family_reports || {}).map((v: any) => Number(v)), 1)
              const percentage = (Number(count) / maxCount) * 100
              const familyColor = family === 'eco' ? '#27ae60' : family === 'tech' ? '#3498db' : family === 'heavy' ? '#e67e22' : '#9b59b6'
              return (
                <BarChartRow key={family}>
                  <BarHeader>
                    <BarLabel>
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
