import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS, SPACING } from '@/constants'

export const Container = styled.div`
    background: ${COLORS.allWhite};
    min-height: 100vh;
    padding-bottom: 40px;
`

export const BackButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    background: ${COLORS.allWhite};
    border: none;
    padding: ${SPACING.md} ${SPACING.md};
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 10px ${COLORS.shadow};
`

export const ImageSection = styled.div`
    ${size('100%','350px')}
    position: relative;
    background: ${COLORS.allWhite};
`;

export const MainImage = styled.img`
    ${size('100%','100%')}
    object-fit: cover;
`

export const PlaceholderImage = styled.div`
    ${flex('column','center','center')}
    ${size('100%','100%')}
    font-size: 80px;
`

export const CategoryBadge = styled.span`
    padding: ${SPACING.xs} ${SPACING.lg};
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    backdrop-filter: blur(4px);
    text-transform: uppercase;
    color: ${COLORS.black};
    background: ${COLORS.allWhite};
`

export const TagGroup = styled.div`
    ${flex('column','flex-start','center')}
    position: absolute;
    top: 0px;
    left: 20px;
    height: 90%;
    gap: 8px;
`

export const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
    padding: 6px 14px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 4px 12px ${COLORS.shadow};
    color: ${COLORS.allWhite};
    background: ${props => props.$others ? COLORS.danger : COLORS.black};
`

export const OwnerBadge = styled.span`
    padding: 6px 14px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${COLORS.allWhite};
    background: ${COLORS.exito};
    box-shadow: 0 4px 12px ${COLORS.shadow};
`

export const ContentCard = styled.div`
    background: ${COLORS.allWhite};
    margin-top: -30px;
    position: relative;
    border-radius: 30px 30px 0 0;
    padding: 32px 24px;
    box-shadow: 0 -10px 30px ${COLORS.shadow};
`

export const Header = styled.div`
    ${flex('row','center','flex-start')}
    margin-bottom: 2rem;
`

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: ${COLORS.black};
`

export const Description = styled.p`
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 32px;
    color: ${COLORS.greyDark};
`

export const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${COLORS.black};
`

export const MapWrapper = styled.div`
    ${size('100%','200px')}
    border-radius: 35px;
    margin-bottom: 32px;
    overflow: hidden;
`

export const ClaimButton = styled.button`
    width: 100%;
    background: ${COLORS.info};
    color: ${COLORS.info};
    border: none;
    padding: 18px;
    border-radius: 35px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        background: ${COLORS.grey};
        transform: scale(1.02);
    }

    &:disabled {
        background: ${COLORS.grey};
        cursor: not-allowed;
        color: ${COLORS.greyDark};
    }
`

export const UnclaimButton = styled.button`
    width: 100%;
    background: ${COLORS.allWhite};
    color: ${COLORS.danger};
    border: 1px solid ${COLORS.danger};
    padding: 16px;
    border-radius: 18px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 12px;
    transition: all 0.2s ease;
    border: 1rem solid red;
    
    &:hover {
        background: ${COLORS.allWhite};
        transform: scale(1.01);
    }
    
    &:active {
        transform: scale(0.99);
    }
`

export const Loading = styled.div`
    ${flex('column','center','center')}
    height: 100vh;
    color: ${COLORS.greyDark};
`

export const ErrorState = styled.div`
    ${flex('column','center','center')}
    height: 100vh;
    color: ${COLORS.danger};
`