import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS, SPACING, ICONS} from '@/constants'

export const Container = styled.div`
    padding: ${SPACING.lg};
    background: ${COLORS.white};
    min-height: calc(100vh - 80px);
    padding-bottom: 120px;
`

export const Header = styled.header`
    margin-bottom: 28px;
`

export const Title = styled.h1`
    margin: 0;
    letter-spacing: -1px;
    font-size: 32px;
    font-weight: 700;
    color: ${COLORS.black};
`

export const SearchForm = styled.form`
    width: 100%;
`

export const SearchInputWrapper = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`

export const SearchIcon = styled(ICONS.search)`
    position: absolute;
    left: 16px;
    color: ${COLORS.greyDark};
    font-size: 18px;
`

export const SearchInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 14px 14px 14px 48px;
    border-radius: ${SPACING.xl};
    border: 1px solid ${COLORS.greyDark};
    font-size: 16px;
    background: ${COLORS.allWhite};
    outline: none;
    transition: all 0.2s ease;
    
    &:focus {
        border-color: ${COLORS.info};
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const CategoriesBar = styled.div`
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 12px;
    margin-bottom: 24px;
    width: 100%;
    &::-webkit-scrollbar { display: none; }
`

export const CategoryChip = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 20px;
    border: none;
    background: ${props => props.$active ? COLORS.info : COLORS.allWhite};
    color: ${props => props.$active ? COLORS.allWhite : COLORS.black};
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: 0 2px 8px ${COLORS.shadow};
    transition: all 0.2s ease;
`

export const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
`

export const ResultCard = styled.div`
    display: flex;
    flex-direction: column;
    background: ${COLORS.allWhite};
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 15px ${COLORS.shadow};
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px ${COLORS.shadow};
    }
`

export const ItemThumbnail = styled.div`
    width: 100%;
    padding-top: 75%; /* 4:3 Aspect Ratio */
    position: relative;
    background: ${COLORS.white};
    
    img {
        position: absolute;
        top: 0;
        left: 0;
        ${size('100%','100%')}
        object-fit: cover;
    }
`

export const CategoryBadge = styled.span`
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 700;
    color: ${COLORS.black};
    background: ${COLORS.allWhite};
    box-shadow: 0 10px 25px ${COLORS.shadow};
    backdrop-filter: blur(4px);
    text-transform: uppercase;
`

export const TagGroup = styled.div`
    ${flex('column','flex-start','center')}
    position: absolute;
    top: 12px;
    left: 12px;
    gap: 6px;
`

export const ClaimStatusBadge = styled.span<{ $others?: boolean }>`
    background: ${props => props.$others ? '#ff3b30' : '#1d1d1f'};
    color: ${COLORS.allWhite};
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 2px 8px ${COLORS.shadow};
`

export const OwnerBadge = styled.span`
    padding: 4px 10px;
    border-radius: 10px;
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
    padding: 16px;
`

export const ItemHeader = styled.div`
    ${flex('column','flex-start','space-between')}
    gap: 8px;
    min-width: 0;
    margin-bottom: 8px;
`

export const ItemTitle = styled.h3`
    min-width: 0;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    color: ${COLORS.black};
`

export const Distance = styled.span`
    font-size: 11px;
    color: #86868b;
    font-weight: 600;
    background: #f5f5f7;
    padding: 4px 10px;
    border-radius: 8px;
`

export const ItemMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`

export const ItemDesc = styled.p`
    font-size: 14px;
    color: #86868b;
    margin: 0 0 20px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    flex: 1;
`

export const ClaimButton = styled.button`
    width: 100%;
    background: #1d1d1f;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #000;
        transform: scale(1.02);
    }
    
    &:active {
        transform: scale(0.98);
    }
`

export const LoadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #86868b;
`

export const LoadingSpinner = styled.div`
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #0071e3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
    @keyframes spin { 100% { transform: rotate(360deg); } }
`

export const EmptyResults = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #86868b;
`

export const EmptyIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
`


