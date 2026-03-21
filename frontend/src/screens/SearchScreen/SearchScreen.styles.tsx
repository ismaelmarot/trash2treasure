import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS, SPACING, ICONS} from '@/constants'

export const Container = styled.div`
    width: 100%;
    max-width: 100%;
    padding: ${SPACING.lg};
    background: ${COLORS.white};
    min-height: calc(100vh - 80px);
    box-sizing: border-box;

    @media (max-width: 480px) {
        padding: ${SPACING.md};
    }
`

export const Header = styled.header`
    width: 100%;
    max-width: 100%;
    margin-bottom: 24px;
    box-sizing: border-box;
`

export const Title = styled.h1`
    margin: 0 0 16px 0;
    letter-spacing: -1px;
    font-size: 32px;
    font-weight: 700;
    color: ${COLORS.black};

    @media (max-width: 480px) {
        font-size: 24px;
        margin-bottom: 12px;
    }
`

export const SearchForm = styled.form`
    width: 100%;
    max-width: 100%;
`

export const SearchInputWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    position: relative;
`

export const SearchIcon = styled(ICONS.search)`
    position: absolute;
    left: 16px;
    color: ${COLORS.greyDark};
    font-size: 18px;
    pointer-events: none;
`

export const SearchInput = styled.input`
    width: 100%;
    max-width: 100%;
    padding: 14px 14px 14px 48px;
    border-radius: ${SPACING.xl};
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: ${COLORS.allWhite};
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    
    &:focus {
        border-color: ${COLORS.info};
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const CategoriesBar = styled.div`
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar { 
        display: none; 
    }
`

export const CategoryChip = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 20px;
    border: none;
    flex-shrink: 0;
    background: ${props => props.$active ? COLORS.info : COLORS.allWhite};
    color: ${props => props.$active ? COLORS.allWhite : COLORS.black};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px ${COLORS.shadow};
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
    }
`

export const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }

    @media (min-width: 1200px) {
        grid-template-columns: repeat(6, 1fr);
        gap: 16px;
    }
`

export const ResultCard = styled.div`
    background: ${COLORS.allWhite};
    border-radius: ${SPACING.lg};
    overflow: hidden;
    box-shadow: 0 4px 20px ${COLORS.shadow};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    
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

export const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: ${SPACING.md};
`

export const DistanceBadge = styled.span`
    font-size: 13px;
    color: ${COLORS.greyDark};
    font-weight: 500;
    margin-bottom: 4px;
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

export const ClaimButton = styled.button`
    width: 100%;
    background: ${COLORS.black};
    color: ${COLORS.allWhite};
    border: none;
    padding: 14px;
    border-radius: 34px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        transform: scale(1.01);
        opacity: 0.9;
    }

    &:disabled {
        background: ${COLORS.grey};
        color: ${COLORS.greyDark};
        cursor: not-allowed;
    }
`

export const LoadingWrapper = styled.div`
    ${flex('column','center','center')}
    padding: 60px 0;
    color: ${COLORS.greyDark};
    width: 100%;
`

export const LoadingSpinner = styled.div`
    ${size('32px','32px')}
    border: 3px solid ${COLORS.grey};
    border-top: 3px solid ${COLORS.info};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
    
    @keyframes spin { 
        100% { 
            transform: rotate(360deg); 
        } 
    }
`

export const EmptyResults = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: ${COLORS.greyDark};
    width: 100%;
    box-sizing: border-box;
`

export const EmptyIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
`
