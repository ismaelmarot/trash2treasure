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
    margin-bottom: 1rem;
    padding: ${SPACING.sm} ${SPACING.md};
    border-radius: ${SPACING.xl};
    background: ${COLORS.white};
    cursor: pointer;
`

export const LanguageSelect = styled.select`
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #ddd;
    background: white;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    
    &:focus {
        border-color: ${COLORS.info};
    }
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
    background: ${COLORS.primaryDark};
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(66, 165, 159, 0.3);
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

export const CollapsibleSection = styled.div`
    width: 100%;
    max-width: 40rem;
    margin-bottom: ${SPACING.xxl};
    text-align: left;
`

export const CollapsibleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${SPACING.md};
    background: #f5f5f5;
    border-radius: ${SPACING.lg};
    cursor: pointer;
`

export const CollapsibleTitle = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${COLORS.black};
`

export const CollapsibleArrow = styled.span<{ $isOpen: boolean }>`
    font-size: 12px;
    transition: transform 0.3s;
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
    color: ${COLORS.greyDark};
`

export const CollapsibleContent = styled.div<{ $isOpen: boolean }>`
    max-height: ${props => props.$isOpen ? '500px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: ${COLORS.white};
    border-radius: ${SPACING.lg};
    margin-top: ${SPACING.sm};
`

export const InfoList = styled.div`
    padding: ${SPACING.md};
`

export const InfoItem = styled.div`
    display: flex;
    gap: ${SPACING.md};
    padding: ${SPACING.sm} 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
        border-bottom: none;
    }
`

export const InfoIcon = styled.span`
    font-size: 1.2rem;
    flex-shrink: 0;
`

export const InfoContent = styled.div`
    flex: 1;
`

export const InfoTitle = styled.div`
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
`

export const InfoDetail = styled.div`
    font-size: 14px;
    color: ${COLORS.greyDark};
    line-height: 1.5;
`

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

export const ModalContent = styled.div`
    background: ${COLORS.white};
    padding: ${SPACING.lg};
    border-radius: ${SPACING.lg};
    max-width: 90%;
    max-height: 80%;
    overflow-y: auto;
    width: 100%;
`

export const ModalTitle = styled.h3`
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: ${SPACING.md};
    text-align: center;
`

export const ModalClose = styled.button`
    position: absolute;
    top: ${SPACING.md};
    right: ${SPACING.md};
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${COLORS.greyDark};
`
