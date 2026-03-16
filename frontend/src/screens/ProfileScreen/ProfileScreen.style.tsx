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
    border-radius: ${SPACING.lg};
    box-shadow: 0 0.25rem 0.75rem ${COLORS.shadow};
    background: ${COLORS.allWhite};
`

export const Avatar = styled.div`
    ${flex('column','center','center')}
    ${size('5rem','5rem')}
    border-radius: 50%;
    margin: 0 auto ${SPACING.lg};
    font-size: 2rem;
    font-weight: 600;
    color: ${COLORS.white};
    background: ${COLORS.info};
`

export const Name = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: ${SPACING.xs};
`

export const Email = styled.p`
    margin-bottom: ${SPACING.xxl};
    color: ${COLORS.primaryDark};
`

export const Section = styled.div`
    width: 100%;
    max-width: 40rem;
    margin-bottom: ${SPACING.xxl};
    padding: ${SPACING.xxl};
    border-radius: ${SPACING.lg};
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
    padding: ${SPACING.sm} ${SPACING.lg};
    border: none;
    border-radius: 1rem;
    background-color: ${COLORS.danger};
    font-weight: 600;
    cursor: pointer;
`

export const MenuItem = styled.div`
    ${flex('row','center','space-between')}
    padding: ${SPACING.sm} ${SPACING.md};
    border-radius: ${SPACING.md};
    background: ${COLORS.white};
    cursor: pointer;
`

export const MenuIconWrapper = styled.div`
    ${flex('row','center','center')}
    ${size('2rem','2rem')}
    border-radius: ${SPACING.sm};
    margin-right: ${SPACING.md};
    color: ${COLORS.primary};
    background: ${COLORS.white};
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
    color: ${COLORS.advertencia};
`

export const IconChevron = styled(ICONS.chevronRight)`
    color: ${COLORS.grey};
`

export const GoOut = styled(ICONS.goOut)`
    font-size: 1.5rem;
    color: ${COLORS.allWhite}
`
