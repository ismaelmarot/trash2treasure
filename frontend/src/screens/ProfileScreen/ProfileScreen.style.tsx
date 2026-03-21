import styled from 'styled-components'
import { COLORS, ICONS, SPACING } from '@/constants'
import { flex, size } from '@/mixins'

export const Container = styled.div`
    ${flex('column','center','flex-start')}
    gap: ${SPACING.xl};
    min-height: calc(100vh - 5rem);
    padding: ${SPACING.lg};
    background: ${COLORS.white};
`

export const Card = styled.div`
    width: 100%;
    max-width: 40rem;
    text-align: center;
    padding: ${SPACING.xxl};
    border-radius: ${SPACING.xl};
    box-shadow: 0 0.25rem 0.75rem ${COLORS.shadow};
    background: ${COLORS.allWhite};
`

export const Avatar = styled.div<{ $hasImage?: boolean; $bgColor?: string }>`
    ${flex('column','center','center')}
    ${size('5rem','5rem')}
    border-radius: 50%;
    margin: 0 auto ${SPACING.lg};
    font-size: 2rem;
    font-weight: 600;
    color: ${COLORS.white};
    background: ${props => props.$hasImage ? 'transparent' : props.$bgColor || COLORS.info};
    overflow: hidden;
`

export const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const Name = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: ${SPACING.xs};
`

export const Email = styled.p`
    margin-bottom: ${SPACING.md};
    color: ${COLORS.primaryDark};
`

export const EditProfileButton = styled.button`
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    padding: ${SPACING.sm} ${SPACING.xl};
    border-radius: 35px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: ${SPACING.sm};
    
    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
`

export const Section = styled.div`
    width: 100%;
    max-width: 40rem;
    margin-bottom: ${SPACING.xxl};
    padding: ${SPACING.xxl};
    border-radius: ${SPACING.xl};
    text-align: center;
    box-shadow: 0 0.25rem 0.75rem ${COLORS.shadow};
    background: ${COLORS.allWhite};
`

export const SectionTitle = styled.h3`
    font-size: 1.1rem;
    margin-bottom: ${SPACING.md};
`

export const Button = styled.button`
    background: ${COLORS.primary};
    color: ${COLORS.white};
    border: none;
    padding: ${SPACING.sm} ${SPACING.lg};
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: ${COLORS.primaryDark};
    }
`

export const LogoutButton = styled.button`
    font-weight: 600;
    border: none;
    cursor: pointer;
    background-color: ${COLORS.white};
`

export const MenuItem = styled.div`
    ${flex('row','center','space-between')}
    padding: ${SPACING.sm} ${SPACING.md};
    border-radius: ${SPACING.xl};
    background: ${COLORS.white};
    cursor: pointer;
    gap: ${SPACING.sm};
`

export const MenuIconWrapper = styled.div`
    ${flex('row','center','center')}
    ${size('2rem','2rem')}
    flex-shrink: 0;
`

export const MenuLabel = styled.span`
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
    color: ${COLORS.black};
`

export const ExitText = styled.span`
    color: ${COLORS.black};
    font-weight: 600;
`

export const IconCircle = styled(ICONS.iconCircle)`
    font-size: 1.5rem;
    color: ${COLORS.advertencia};
`

export const IconChevron = styled(ICONS.chevronRight)`
    margin-left: ${SPACING.sm};
    flex-shrink: 0;
`

export const GoOut = styled(ICONS.goOut)`
    font-size: 1.5rem;
    color: ${COLORS.danger};
`

export const PointsCard = styled.div`
    background: linear-gradient(135deg, #0071e3 0%, #00c6ff 100%);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 113, 227, 0.3);
    }
`

export const PointsLabel = styled.div`
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 4px;
`

export const PointsValue = styled.div`
    font-size: 32px;
    font-weight: 700;
`

export const StatsRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`

export const StatItem = styled.div`
    background: #f5f5f5;
    border-radius: 12px;
    padding: 12px;
    text-align: center;
`

export const StatValue = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: ${COLORS.black};
`

export const StatLabel = styled.div`
    font-size: 12px;
    color: ${COLORS.greyDark};
`
