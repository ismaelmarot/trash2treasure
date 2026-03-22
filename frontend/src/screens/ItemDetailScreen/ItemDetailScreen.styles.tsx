import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    background:${COLORS.allWhite};
    min-height: 100vh;
`

export const BackButton = styled.button`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
    background:${COLORS.allWhite};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: none;
    padding: 12px 18px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${COLORS.black};
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.02);
    }
`

export const ImageSection = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    aspect-ratio: 1 / 1;
    position: relative;
    background: ${COLORS.white};
`

export const MainImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const PlaceholderImage = styled.div`
    ${flex('column', 'center', 'center')}
    ${size('100%', '100%')}
    font-size: 80px;
    background: ${COLORS.white};
`

export const BadgeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16px;
`

export const MetaInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const CategoryBadge = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${COLORS.black};
    background: ${COLORS.grey};
`

export const TagGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

export const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${COLORS.allWhite};
    background: ${props => props.$others ? COLORS.grey : COLORS.black};
`

export const OwnerBadge = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${COLORS.allWhite};
    background: ${COLORS.exito};
`

export const ContentCard = styled.div`
    background: ${COLORS.allWhite};
    margin-top: -24px;
    position: relative;
    border-radius: 24px 24px 0 0;
    padding: 32px 24px;
    box-shadow: 0 -4px 30px rgba(194, 86, 86, 0.08);
`

export const MetaRow = styled.div`
    display: flex;
    align-items: center;
`

export const DistanceBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 2px 12px;
    border-radius: 35px;
    font-size: 13px;
    font-weight: 700;
    color: ${COLORS.black};
    background: ${COLORS.grey};
`

export const Header = styled.div`
    ${flex('row', 'center', 'flex-start')}
    margin: 1rem 0 .5rem;
    border-top: 2px solid ${COLORS.grey};
`

export const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${COLORS.black};
    line-height: 1.2;
    letter-spacing: -0.5px;
`

export const Description = styled.p`
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: ${COLORS.greyDark};
    border-bottom: 2px solid ${COLORS.grey};
`

export const SectionTitle = styled.h2`
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 1rem 0 .3rem;
    color: ${COLORS.grey};
`

export const MapWrapper = styled.div`
    ${size('100%', '180px')}
    border-radius: 16px;
    margin-bottom: 28px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`

export const NavigateButton = styled.button`
    width: 100%;
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    padding: 16px;
    border-radius: 35px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 28px;
    transition: all 0.2s ease;
    letter-spacing: -0.2px;
    
    &:hover {
        transform: scale(1.01);
        opacity: 0.9;
    }
`

export const ClaimButton = styled.button`
    width: 100%;
    background: ${COLORS.black};
    color: ${COLORS.allWhite};
    border: none;
    padding: 18px;
    border-radius: 34px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: -0.2px;
    
    &:hover:not(:disabled) {
        transform: scale(1.01);
        opacity: 0.9;
    }

    &:disabled {
        background: ${COLORS.white};
        color: ${COLORS.grey};
        cursor: not-allowed;
    }
`

export const ProximityHint = styled.p`
    font-size: 13px;
    color: #666666;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 0;
`

export const UnclaimButton = styled.button`
    width: 100%;
    background: transparent;
    color: ${COLORS.danger};
    border: 1.5px solid ${COLORS.danger};
    padding: 16px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 12px;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${COLORS.danger}10;
    }
`

export const Loading = styled.div`
    ${flex('column', 'center', 'center')}
    height: 100vh;
    color: ${COLORS.greyDark};
    font-size: 15px;
`

export const ErrorState = styled.div`
    ${flex('column', 'center', 'center')}
    height: 100vh;
    color: ${COLORS.danger};
    font-size: 17px;
`
