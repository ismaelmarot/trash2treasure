import styled from 'styled-components'

export const BottomNavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.85); /* Apple Glass base */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1); /* Sutil línea superior */
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 12px); /* Adaptación iPhone Notch */
  padding-top: 8px;
  height: calc(56px + env(safe-area-inset-bottom, 12px));
  position: relative;
  z-index: 2000;
  width: 100%;
  box-sizing: border-box;
`

export const BottomNavItem = styled.button<{ $active: boolean }>`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  height: 100%;
  color: ${({ $active }) => ($active ? '#0071e3' : '#8e8e93')};
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 4px 0;

  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  
  span {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: ${({ $active }) => ($active ? '-0.2px' : '0px')};
    line-height: 1;
  }
  
  svg {
    font-size: 24px;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: ${({ $active }) => ($active ? 'scale(1.15)' : 'scale(1)')};
  }

  &:hover {
    color: ${({ $active }) => ($active ? '#0071e3' : '#1d1d1f')};
    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    opacity: 0.7;
    svg {
      transform: scale(0.95);
    }
  }
`

export const UserAvatar = styled.div<{ $hasImage?: boolean; $bgColor?: string }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$hasImage ? 'transparent' : props.$bgColor || '#0071e3'};
  font-size: 12px;
  font-weight: 700;
  color: white;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  flex-shrink: 0;
`

export const AvatarImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`