import styled from 'styled-components'
import { COLORS } from '@/constants'

export const Container = styled.div`
  padding: 20px;
  background: ${COLORS.white};
  min-height: calc(100vh - 80px);
  padding-bottom: 120px;
`

export const Header = styled.div`
  margin-bottom: 24px;
`

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 0 0 4px 0;
`

export const Subtitle = styled.p`
  font-size: 15px;
  color: ${COLORS.greyDark};
  margin: 0;
`

export const PointsCard = styled.div`
  background: ${COLORS.primaryDark};
  border-radius: 25px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
  }
`

export const PointsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

export const PointsLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`

export const PointsValue = styled.div`
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
`

export const DivisionBadge = styled.div`
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`

export const StatItem = styled.div`
  background: rgba(255,255,255,0.15);
  border-radius: 25px;
  padding: 12px;
  text-align: center;
`

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
`

export const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 24px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const RankingItem = styled.div<{ $isCurrentUser?: boolean; $position?: number }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: ${props => {
    if (props.$position === 1) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
    if (props.$position === 2) return 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)';
    if (props.$position === 3) return 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)';
    if (props.$isCurrentUser) return '#f0f7ff';
    return COLORS.allWhite;
  }};
  border-radius: 35px;
  box-shadow: 0 2px 12px ${COLORS.shadow};
  border: ${props => props.$isCurrentUser ? '2px solid #0071e3' : '1px solid rgba(0,0,0,0.05)'};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
  }
`

export const Position = styled.div<{ $top?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  background: ${props => {
    if (props.$top === true) return '#FFD700';
    return '#f0f0f0';
  }};
  color: ${props => props.$top ? '#333' : COLORS.greyDark};
`

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0071e3;
  color: white;
  font-weight: 700;
  font-size: 16px;
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const UserInfo = styled.div`
  flex: 1;
`

export const UserName = styled.div`
  font-weight: 600;
  color: ${COLORS.black};
`

export const UserDivision = styled.div`
  font-size: 12px;
  color: ${COLORS.greyDark};
`

export const UserPoints = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: #0071e3;
`

export const CategorySection = styled.div`
  margin-top: 24px;
`

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`

export const CategoryCard = styled.div`
  background: ${COLORS.allWhite};
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px ${COLORS.shadow};
`

export const CategoryIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

export const CategoryName = styled.div`
  font-size: 12px;
  color: ${COLORS.greyDark};
  margin-bottom: 4px;
`

export const CategoryPoints = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${COLORS.black};
`

export const AchievementsSection = styled.div`
  margin-top: 24px;
`

export const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: ${COLORS.greyDark};
  font-size: 15px;
`

export const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 24px 0;
`

// Gráficas estilo Duolingo
export const ChartContainer = styled.div`
  background: ${COLORS.allWhite};
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px ${COLORS.shadow};
  margin-bottom: 16px;
`

export const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const BarChartRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

export const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

export const BarLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.black};
  display: flex;
  align-items: center;
  gap: 6px;
`

export const BarContainer = styled.div`
  width: 100%;
  height: 16px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`

export const BarFill = styled.div<{ $color: string; $width: number }>`
  height: 100%;
  width: ${props => Math.min(props.$width, 100)}%;
  background: ${props => props.$color};
  border-radius: 8px;
  transition: width 0.5s ease;
`

export const BarValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.black};
`

// Logros con efecto zoom
export const AchievementCard = styled.div<{ $unlocked?: boolean }>`
  background: ${props => props.$unlocked ? COLORS.allWhite : '#f5f5f5'};
  border-radius: 25px;
  padding: 16px;
  text-align: center;
  box-shadow: ${props => props.$unlocked ? '0 2px 12px rgba(0,0,0,0.1)' : 'none'};
  border: 2px solid ${props => props.$unlocked ? '#34c759' : '#e0e0e0'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px ${COLORS.shadow};
  }
`

export const AchievementIcon = styled.div<{ $unlocked?: boolean }>`
  font-size: 32px;
  margin-bottom: 8px;
  filter: ${props => props.$unlocked ? 'none' : 'grayscale(100%)'};
  opacity: ${props => props.$unlocked ? 1 : 0.4};
`

export const AchievementName = styled.div<{ $unlocked?: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$unlocked ? COLORS.black : '#999'};
  margin-bottom: 4px;
`

export const AchievementDesc = styled.div<{ $unlocked?: boolean }>`
  font-size: 10px;
  color: ${props => props.$unlocked ? COLORS.greyDark : '#bbb'};
`

export const FamilySection = styled.div`
  margin-top: 24px;
`

// Secciones desplegables
export const CollapsibleSection = styled.div`
  background: ${COLORS.allWhite};
  border-radius: 25px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px ${COLORS.shadow};
  overflow: hidden;
`

export const CollapsibleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f8f8;
  }
`

export const CollapsibleTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: ${COLORS.black};
`

export const CollapsibleSummary = styled.div`
  font-size: 14px;
  color: ${COLORS.greyDark};
`

export const CollapsibleArrow = styled.span<{ $isOpen?: boolean }>`
  font-size: 12px;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: ${COLORS.greyDark};
`

export const CollapsibleContent = styled.div<{ $isOpen?: boolean }>`
  max-height: ${props => props.$isOpen ? '5000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
  padding: ${props => props.$isOpen ? '0 20px 20px' : '0 20px'};
`

// Divisiones
export const DivisionsSection = styled.div`
  margin-top: 24px;
`

export const DivisionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const DivisionItem = styled.div<{ $isCurrent?: boolean; $isPast?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 25px;
  background: ${props => {
    if (props.$isCurrent) return 'linear-gradient(135deg, #34c759 0%, #30d158 100%)';
    if (props.$isPast) return '#f0f0f0';
    return '#f8f8f8';
  }};
  color: ${props => {
    if (props.$isCurrent) return 'white';
    if (props.$isPast) return COLORS.greyDark;
    return '#999';
  }};
  border: ${props => props.$isCurrent ? '2px solid #28a745' : '1px solid #eee'};
`

// Info de cómo obtener puntos
export const InfoSection = styled.div`
  margin-top: 24px;
`

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 12px;
`

export const InfoIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`

export const InfoContent = styled.div`
  flex: 1;
`

export const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${COLORS.black};
  margin-bottom: 4px;
`

export const InfoDetail = styled.div`
  font-size: 12px;
  color: ${COLORS.greyDark};
  line-height: 1.4;
`

// Divisiones
export const DivisionLevel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 16px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
`

export const DivisionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

export const DivisionCard = styled.div<{ $isCurrent?: boolean; $isPast?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-radius: 35px;
  background: ${props => props.$isCurrent ? COLORS.primaryDark : '#f0f0f0'};
  color: ${props => props.$isCurrent ? 'white' : '#999'};
  border: ${props => props.$isCurrent ? '2px solid rgba(66, 165, 159, 0.5)' : '1px solid #e0e0e0'};
  opacity: ${props => props.$isCurrent ? 1 : 0.6};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: ${props => props.$isCurrent ? 'translateX(4px)' : 'none'};
  }
`

export const DivisionIcon = styled.div<{ $isCurrent?: boolean }>`
  font-size: 20px;
  flex-shrink: 0;
  margin-right: 12px;
  filter: ${props => props.$isCurrent ? 'none' : 'grayscale(100%)'};
  opacity: ${props => props.$isCurrent ? 1 : 0.5};
`

export const DivisionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const DivisionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const DivisionName = styled.div`
  font-weight: 600;
  font-size: 14px;
`

export const DivisionRange = styled.div`
  font-size: 12px;
  opacity: 0.8;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
`

export const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.9;
`

// Tabs para Desafíos
export const TabContainer = styled.div`
  display: flex;
  background: ${COLORS.grey};
  padding: 4px;
  border-radius: 25px;
  margin-bottom: 16px;
`

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 25px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? COLORS.black : COLORS.primaryDark};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s ease;
`

export const TabContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`
