import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    ${size('100%','100%')}
    display: flex;
    position: relative;
    background: ${COLORS.white};
    overflow: hidden;

    .leaflet-popup-content-wrapper {
        border-radius: 34px;
        overflow: hidden;
        box-shadow: 0 4px 20px ${COLORS.shadow};
    }

    .leaflet-popup-content {
        margin: 0;
        width: auto !important;
    }

    .leaflet-popup-tip {
        display: none;
    }
`

export const SidebarContainer = styled.div<{ $isOpen: boolean }>`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 380px;
    background: white;
    z-index: 1500;
    box-shadow: -4px 0 20px ${COLORS.shadow};
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});

    @media (max-width: 768px) {
        ${size('100%','80%')}
        top: auto;
        bottom: 0;
        transform: translateY(${props => props.$isOpen ? '0' : '100%'});
        border-radius: 32px 32px 0 0;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 -10px 40px ${COLORS.shadow};
    }
`

export const DragHandleContainer = styled.div`
    display: none;
    width: 100%;
    padding: 12px 0 8px 0;
    justify-content: center;
    align-items: center;
    cursor: grab;

    @media (max-width: 768px) {
        display: flex;
    }
`

export const DragHandle = styled.div`
    width: 40px;
    height: 5px;
    background: ${COLORS.grey};
    border-radius: 10px;
`

export const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${COLORS.shadow};
    backdrop-filter: blur(3px);
    z-index: 1400;
    opacity: ${props => props.$isOpen ? 1 : 0};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: none;

    @media (max-width: 768px) {
        display: block;
    }
`

export const SidebarHeader = styled.div`
    padding: 0 24px 24px 24px;
    border-bottom: 1px solid ${COLORS.grey};
    background: transparent;
    
    @media (min-width: 769px) {
        padding-top: 24px;
    }
`

export const TitleRow = styled.div`
    ${flex('row','center','space-between')}
    margin-bottom: 24px;
`

export const SidebarTitle = styled.h2`
    font-size: 22px;
    font-weight: 700;
    color: #${COLORS.black};
    margin: 0;
`

export const ToggleButton = styled.button`
    ${flex('column','center','center')}
    ${size('36px','36px')}
    border: none;
    border-radius: 50%;
    color: ${COLORS.allWhite};
    background: ${COLORS.greyDark};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${COLORS.grey};
        color: ${COLORS.black};
    }
`

export const FilterSection = styled.div`
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
`

export const SectionLabel = styled.p`
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.greyDark};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const DistanceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
`

export const FilterChip = styled.button<{ $active: boolean }>`
    padding: 8px 4px;
    border-radius: 25px;
    border: 1px solid ${props => props.$active ? COLORS.info : COLORS.grey};
    background: ${props => props.$active ? '#0071e3' : 'transparent'};
    color: ${props => props.$active ? 'white' : COLORS.black};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: ${COLORS.info};
        color: ${props => props.$active ? COLORS.allWhite : COLORS.info};
    }
`

export const CategoryScroll = styled.div`
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
`

export const CategoryChip = styled.button<{ $active: boolean }>`
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background: ${props => props.$active ? COLORS.allWhite : 'transparent'};
    color: ${props => props.$active ? COLORS.info : COLORS.greyDark};
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        color: ${COLORS.info};
    }
`

export const ItemsList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: transparent;
`

export const ItemCard = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: ${COLORS.allWhite};
    border-radius: 20px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid ${COLORS.shadow};
    box-shadow: 0 2px 10px ${COLORS.shadow};

    &:hover {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 8px 16px ${COLORS.shadow};
    }

    &:active {
        transform: translateY(0) scale(0.98);
    }
`

export const ItemThumbnail = styled.img`
    ${size('64px','64px')}
    border-radius: 12px;
    object-fit: cover;
`

export const ItemInfo = styled.div`
    ${flex('column','flex-start','center')}
    flex: 1;
    gap: 4px;
`

export const ItemName = styled.h4`
    font-size: 15px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
`

export const ItemDescription = styled.p`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    font-size: 12px;
    -webkit-box-orient: vertical;
    width: 100%;
    margin: 2px 0 4px 0;
    overflow: hidden;
    line-height: 1.4;
    border-bottom: 1px solid ${COLORS.grey};
    color: ${COLORS.greyDark};
`

export const ItemMeta = styled.div`
    display: flex;
    align-items: center;
    font-size: 13px;
    color: ${COLORS.greyDark};
    margin-top: 4px;
`

export const DotDivider = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${COLORS.greyDark};
`

export const PublishedTime = styled.span`
    font-size: 12px;
    color: ${COLORS.greyDark};
    margin-top: 2px;
`

export const CountdownWrapper = styled.div`
    margin-top: 4px;
`

export const ViewDetailButton = styled.button`
    background: ${COLORS.grey};
    color: ${COLORS.info};
    border: none;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        background: ${COLORS.info};
        color: ${COLORS.allWhite};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`

export const EmptyState = styled.div`
    ${flex('column','center','center')}
    padding: 60px 24px;
    text-align: center;
    color: ${COLORS.greyDark};

    p {
        font-size: 16px;
        font-weight: 600;
        margin: 16px 0 8px 0;
        color: ${COLORS.black};
    }

    small {
        font-size: 14px;
    }
`

export const EmptyIcon = styled.div`
    font-size: 40px;
`


export const TopBar = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    width: auto;
    top: 20px;
    left: 50%;
    padding: 4px;
    transform: translateX(-50%);
    background: ${COLORS.allWhite};
    backdrop-filter: blur(25px) saturate(200%);
    -webkit-backdrop-filter: blur(25px) saturate(200%);
    border-radius: 40px;
    box-shadow: 0 10px 40px ${COLORS.shadow};
    border: 1px solid ${COLORS.grey};
    pointer-events: auto;
    z-index: 9999;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    @media (max-width: 768px) {
        width: 95%;
        justify-content: space-between;
    }
`

export const TopBarSegment = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px 0 14px;
`

export const VerticalDivider = styled.div`
    ${size('1px','24px')}
    margin: 0 2px;
    background: ${COLORS.grey};
`

export const ExploreSegment = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: ${props => props.$active ? COLORS.info : 'transparent'};
    color: ${props => props.$active ? 'white' : COLORS.black};
    padding: 10px 22px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;

    &:hover {
        background: ${props => props.$active ? COLORS.info : COLORS.grey};
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`

export const IconButton = styled.button<{ $isRefreshing?: boolean }>`
    ${flex('row','center','center')}
    ${size('36px','36px')}
    border-radius: 50%;
    border: none;
    background: ${COLORS.info};
    color: ${COLORS.grey};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${COLORS.info};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        background: ${COLORS.grey};
        cursor: not-allowed;
    }

    svg {
        animation: ${props => props.$isRefreshing ? 'spin 1.5s linear infinite' : 'none'};
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

export const SmallIconButton = styled(IconButton)`
    ${size('30px','30px')}
    color: ${COLORS.black};
    background: ${COLORS.white};
    
    &:hover {
        background: ${COLORS.grey};
    }
`

export const ActionGroup = styled.div`
    display: flex;
    gap: 6px;
`

export const SidebarFooter = styled.div`
    padding: 16px;
    border-top: 1px solid ${COLORS.grey};
    background: ${COLORS.allWhite};
`

export const SearchForm = styled.form`
    display: flex;
    padding: 4px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    background: ${COLORS.allWhite};
    box-shadow: 0 4px 20px ${COLORS.shadow};
    overflow: hidden;
`

export const SearchInput = styled.input`
    flex: 1;
    border: none;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    background: transparent;

    &::placeholder {
        color: #86868b;
    }
`

export const SearchButton = styled.button`
    ${flex('column','center','center')}
    ${size('40px','40px')}
    border: none;
    border-radius: 50%;
    color: ${COLORS.allWhite};
    background: ${COLORS.info};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${COLORS.info};
    }

    &:disabled {
        background: ${COLORS.grey};
    }
`

export const ConfirmButton = styled(IconButton)`
    background: ${COLORS.danger};

    &:hover { 
        background: ${COLORS.danger};
    }
`

export const CrosshairContainer = styled.div`
    ${flex('column','center','center')}
    gap: 16px;
`

export const ConfirmFab = styled.button`
    ${flex('row','center','center')}
    gap: 10px;
    background: ${COLORS.info};
    padding: 12px 24px;
    border: none;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.allWhite};
    box-shadow: 0 8px 16px ${COLORS.shadow};
    cursor: pointer;
    
    &:hover {
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
`

export const LocationStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const StatusDot = styled.div<{ $active: boolean; $isRefreshing: boolean }>`
    ${size('8px','8px')}
    border-radius: 50%;
    background: ${props => props.$isRefreshing ? '#ff9500' : props.$active ? '#34c759' : '#ff3b30'};
    box-shadow: 0 0 8px ${props => props.$isRefreshing ? 'rgba(255,149,0,0.5)' : props.$active ? 'rgba(52,199,89,0.5)' : 'rgba(255,59,48,0.5)'};
    animation: ${props => (props.$isRefreshing || !props.$active) ? 'pulse-dot 1.5s infinite' : 'none'};

    @keyframes pulse-dot {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
        100% { opacity: 1; transform: scale(1); }
    }
`

export const StatusText = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.black};
    white-space: nowrap;
`

export const Overlay = styled.div`
    ${flex('column','center','center')}
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${COLORS.grey};
    backdrop-filter: blur(4px);
    z-index: 1000;
`

export const Spinner = styled.div`
    ${size('40px','40px')}
    margin-bottom: 12px;
    border: 4px solid ${COLORS.allWhite};
    border-top: 4px solid ${COLORS.info};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

export const PopupContent = styled.div`
    min-width: 200px;
    max-width: 240px;
    padding: 4px;
    border-radius: 34px;
    overflow: hidden;
`

export const PopupImage = styled.img`
    ${size('100%','120px')}
    object-fit: cover;
    border-radius: 30px;
    margin-bottom: 8px;
`

export const PopupDistance = styled.span`
    font-size: 12px;
    color: ${COLORS.greyDark};
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
`

export const PopupTitle = styled.h3`
    font-size: 15px;
    font-weight: 700;
    color: ${COLORS.black};
    margin: 8px 0 4px 0;
    padding-top: 8px;
    border-top: 1px solid ${COLORS.grey};
`

export const PopupDescription = styled.p`
    font-size: 12px;
    color: ${COLORS.greyDark};
    margin: 0 0 10px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
`

export const ViewButton = styled.button`
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 34px;
    font-weight: 600;
    color: ${COLORS.allWhite};
    background: ${COLORS.black};
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
`