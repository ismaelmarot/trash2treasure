import styled from 'styled-components'
import { COLORS, SPACING } from '@/constants'
import { flex, size } from '@/mixins'

export const Container = styled.div`
    padding: ${SPACING.lg};
    background: ${COLORS.white};
    min-height: calc(100vh - 80px);
    padding-bottom: 120px;
`

export const Header = styled.header`
    margin-bottom: 28px;
`

export const Title = styled.h2`
    margin: 0;
    letter-spacing: -1px;
    font-size: 32px;
    font-weight: 700;
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    font-size: 16px;
    color: ${COLORS.primaryDark};
    margin-top: 4px;
`

export const TabGroup = styled.div`
    display: flex;
    background: ${COLORS.grey};
    padding: 4px;
    border-radius: 25px;
    margin-bottom: 24px;
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

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
`

export const ItemCard = styled.div`
    background: ${COLORS.allWhite};
    border-radius: ${SPACING.lg};
    overflow: hidden;
    box-shadow: 0 4px 20px ${COLORS.shadow};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
        transform: translateY(-6px);
    }
`

export const ImageWrapper = styled.div`
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    background: ${COLORS.white};
`

export const ItemImage = styled.img`
    ${size('100%','100%')}
    object-fit: cover;
`

export const PlaceholderImage = styled.div`
    ${flex('column','center','center')}
    ${size('100%','100%')}
    font-size: 40px;
`

export const TagGroup = styled.div`
    ${flex('column','flex-start','center')}
    position: absolute;
    top: ${SPACING.sm};
    left: ${SPACING.sm};
    gap: 6px;
`

export const CategoryBadge = styled.span`
    background: ${COLORS.allWhite};
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    color: ${COLORS.black};
    border: 1px solid ${COLORS.allWhite};
`

export const OwnerBadge = styled.span`
    background: ${COLORS.advertencia};
    color: ${COLORS.allWhite};
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 2px 8px ${COLORS.shadow};
`

export const ClaimedBadge = styled.span<{ $others?: boolean }>`
    background: ${props => props.$others ? COLORS.exito : COLORS.black};
    color: ${COLORS.allWhite};
    padding: ${SPACING.xs} ${SPACING.sm};
    border-radius: 35px;
    font-size: 10px;
    font-weight: 700;
`

export const ItemContent = styled.div`
    padding: ${SPACING.md};
`

export const ItemHeader = styled.div`
    ${flex('column','flex-end','center')}
    margin-bottom: ${SPACING.md};
`

export const ItemTitle = styled.h3`
    flex: 1;
    padding-top: ${SPACING.md};
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-top: 1px solid ${COLORS.grey};
    color: ${COLORS.black};
`

export const ItemDescription = styled.p`
    display: -webkit-box;
    font-size: 13px;
    color: ${COLORS.primaryDark};
    margin-bottom: ${SPACING.md};
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
`

export const LoadingWrapper = styled.div`
    ${flex('column','center','center')}
    padding: 80px 0;
    color: ${COLORS.primaryDark};
`

export const LoadingSpinner = styled.div`
    ${size('32px','32px')}
    border: 3px solid ${COLORS.allWhite};
    border-top: 3px solid ${COLORS.info};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

export const EmptyState = styled.div`
    text-align: center;
    padding: 80px 20px;
    color: ${COLORS.greyDark};
`

export const EmptyIcon = styled.div`
    font-size: 56px;
    margin-bottom: 20px;
`

export const ActionButton = styled.button`
    margin-top: 24px;
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    padding: 12px 24px;
    border-radius: 35px;
    font-weight: 600;
    cursor: pointer;
    
    &:hover {
        background: ${COLORS.info};
    }
`

export const CardFooter = styled.div`
    ${flex('row','center','space-between')}
    margin-top: ${SPACING.sm};
`

export const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`

export const DeleteButton = styled.button`
    background: ${COLORS.allWhite};
    border: 1px solid ${COLORS.danger};
    color: ${COLORS.danger};
    padding: ${SPACING.sm} ${SPACING.md};
    border-radius: ${SPACING.lg};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${COLORS.danger};
        color: ${COLORS.allWhite};
    }
`

export const UnclaimButton = styled.button`
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    padding: ${SPACING.sm} ${SPACING.md};
    border-radius: 25px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  
    &:hover {
        background: ${COLORS.danger};
        color: ${COLORS.allWhite};
    }
`