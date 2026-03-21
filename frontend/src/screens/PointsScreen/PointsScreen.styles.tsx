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
  background: linear-gradient(135deg, #0071e3 0%, #00c6ff 100%);
  border-radius: 24px;
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
    background: rgba(255,255,255,0.1);
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
  border-radius: 16px;
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
  border-radius: 16px;
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

export const AchievementIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`

export const AchievementName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.black};
  margin-bottom: 4px;
`

export const AchievementDesc = styled.div`
  font-size: 10px;
  color: ${COLORS.greyDark};
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
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`

export const BarLabel = styled.div`
  width: 80px;
  font-size: 13px;
  font-weight: 500;
  color: ${COLORS.black};
  display: flex;
  align-items: center;
  gap: 6px;
`

export const BarContainer = styled.div`
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`

export const BarFill = styled.div<{ $color: string; $width: number }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 12px;
  transition: width 0.5s ease;
`

export const BarValue = styled.div`
  width: 50px;
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.black};
  text-align: right;
`

// Logros con efecto zoom
export const AchievementCard = styled.div<{ $unlocked?: boolean }>`
  background: ${props => props.$unlocked ? COLORS.allWhite : '#f8f8f8'};
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 12px ${COLORS.shadow};
  opacity: ${props => props.$unlocked ? 1 : 0.6};
  border: 2px solid ${props => props.$unlocked ? 'rgba(0, 113, 227, 0.2)' : '#e8e8e8'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px ${COLORS.shadow};
    border-color: ${props => props.$unlocked ? '#0071e3' : '#d0d0d0'};
  }
`

export const FamilySection = styled.div`
  margin-top: 24px;
`
