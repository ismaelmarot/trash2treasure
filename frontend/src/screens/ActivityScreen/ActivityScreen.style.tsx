import styled from 'styled-components'

export const Container = styled.div`
  padding: 24px;
  background: #f5f5f7;
  min-height: calc(100vh - 80px);
  padding-bottom: 120px;
`

export const Header = styled.header`
  margin-bottom: 28px;
`

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -1px;
  margin: 0;
`

export const Subtitle = styled.p`
  font-size: 16px;
  color: #86868b;
  margin-top: 4px;
`

export const TabGroup = styled.div`
  display: flex;
  background: #e5e5ea;
  padding: 4px;
  border-radius: 14px;
  margin-bottom: 24px;
`

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1d1d1f' : '#86868b'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s ease;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
`

export const ItemCard = styled.div`
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  }
`

export const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  background: #f0f0f2;
`

export const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`

export const TagGroup = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`

export const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1d1d1f;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
`

export const OwnerBadge = styled.span`
  background: #34c759;
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
`

export const ClaimedBadge = styled.span<{ $others?: boolean }>`
  background: ${props => props.$others ? '#ff9500' : '#1d1d1f'};
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
`

export const ItemContent = styled.div`
  padding: 14px;
`

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`

export const ItemTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`

export const ItemDescription = styled.p`
  font-size: 13px;
  color: #86868b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #86868b;
`

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0071e3;
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
  color: #86868b;
`

export const EmptyIcon = styled.div`
  font-size: 56px;
  margin-bottom: 20px;
`

export const ActionButton = styled.button`
  margin-top: 24px;
  background: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #0077ed;
  }
`

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

export const DeleteButton = styled.button`
  background: #fff;
  border: 1px solid #ff3b30;
  color: #ff3b30;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff3b30;
    color: white;
  }
`

export const UnclaimButton = styled.button`
  background: #fff;
  border: 1px solid #0071e3;
  color: #0071e3;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0071e3;
    color: white;
  }
`