import styled from 'styled-components'
import { flex }from '../../mixins'
import { COLORS } from '../../constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    height: 100vh;
    background: ${COLORS.white};
    color: ${COLORS.black};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`

export const Header = styled.header`
    display: flex;
    align-items: center;
    padding: 20px;
    width: 100%;
    background: ${COLORS.allWhite};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid ${COLORS.shadow};
`

export const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: ${COLORS.info};
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    
    &:hover { opacity: 0.7; }
`

export const Title = styled.h1`
    flex: 1;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    margin-right: 70px;
`

export const ScrollContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 40px 20px 60px;

    @media (max-width: 768px) {
        padding: 32px 16px 40px;
    }
`

export const DirectoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    max-width: 980px;
    margin: 0 auto;
    padding: 0 20px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px 24px;
        width: 90%;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 28px;
        padding: 0;
    }
`

export const DirectoryColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;

    @media (max-width: 900px) {
        margin-bottom: 12px;
    }
`

export const ColumnTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: ${COLORS.black};
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const DirectoryLink = styled.button`
    background: transparent;
    border: none;
    padding: 0;
    text-align: left;
    font-size: 1rem;
    color: ${COLORS.greyDark};
    cursor: pointer;
    transition: color 0.2s;
    padding-block: 2px; /* Subtle touch target increase */
  
    &:hover {
        color: ${COLORS.black};
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        padding-block: 6px;
        font-size: 15px; 
        border-bottom: 1px solid ${COLORS.shadow}; /* Very subtle divider on mobile */
        padding-bottom: 12px;
        margin-bottom: 4px;
    }
`