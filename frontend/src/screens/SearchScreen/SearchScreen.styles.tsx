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
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    @media (max-width: 360px) {
        grid-template-columns: 1fr;
    }
`

export const ResultCard = styled.div`
    display: flex;
    flex-direction: column;
    background: ${COLORS.allWhite};
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 15px ${COLORS.shadow};
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px ${COLORS.shadow};
    }

    &:active {
        transform: scale(0.98);
    }
`

export const ItemThumbnail = styled.div`
    width: 100%;
    padding-top: 75%;
    position: relative;
    background: ${COLORS.white};
    overflow: hidden;
    
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

export const CategoryBadge = styled.span`
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 700;
    color: ${COLORS.black};
    background: ${COLORS.allWhite};
    box-shadow: 0 2px 8px ${COLORS.shadow};
    text-transform: uppercase;
`

export const TagGroup = styled.div`
    ${flex('column','flex-start','center')}
    position: absolute;
    top: 8px;
    left: 8px;
    gap: 4px;
`

export const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
    background: ${props => props.$others ? COLORS.danger : COLORS.black};
    color: ${COLORS.allWhite};
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 2px 8px ${COLORS.shadow};
`

export const OwnerBadge = styled.span`
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${COLORS.allWhite};
    background: ${COLORS.exito};
    box-shadow: 0 2px 8px ${COLORS.shadow};
`

export const PlaceholderIcon = styled.div`
    ${flex('column','center','center')}
    ${size('100%','100%')}
    position: absolute;
    top: 0;
    left: 0;
    font-size: 40px;
`

export const ItemContent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding: 14px;
`

export const ItemHeader = styled.div`
    ${flex('column','flex-start','space-between')}
    gap: 4px;
    min-width: 0;
    margin-bottom: 6px;
`

export const ItemTitle = styled.h3`
    min-width: 0;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    color: ${COLORS.black};

    @media (max-width: 480px) {
        font-size: 14px;
    }
`

export const Distance = styled.span`
    font-size: 11px;
    color: ${COLORS.greyDark};
    font-weight: 600;
    background: ${COLORS.grey};
    padding: 4px 8px;
    border-radius: 8px;
    white-space: nowrap;
`

export const ItemMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
`

export const ItemDesc = styled.p`
    font-size: 13px;
    color: ${COLORS.greyDark};
    margin: 0 0 14px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    flex: 1;

    @media (max-width: 480px) {
        font-size: 12px;
        margin-bottom: 10px;
        -webkit-line-clamp: 1;
    }
`

export const ClaimButton = styled.button`
    width: 100%;
    background: ${COLORS.black};
    color: ${COLORS.allWhite};
    border: none;
    padding: 10px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #000;
    }
    
    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        background: ${COLORS.grey};
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
