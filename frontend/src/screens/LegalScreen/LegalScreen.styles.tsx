import styled from 'styled-components'
import { flex } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: ${COLORS.white};
    color: ${COLORS.white};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`

export const Header = styled.header`
    ${flex('column','flex-start','center')}
    padding: 20px;
    background: ${COLORS.allWhite};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid ${COLORS.shadow};
`

export const BackButton = styled.button`
    ${flex('row','center','center')}
    gap: 6px;
    padding: 0;
    border: none;
    font-size: 17px;
    font-weight: 500;
    color: ${COLORS.info};
    background: transparent;
    cursor: pointer;
    
    &:hover { opacity: 0.7; }
`

export const Title = styled.h1`
    flex: 1;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    margin-right: 70px;
`

export const ScrollContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 40px 20px;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
`

export const DocumentContainer = styled.div`
    width: 100%;
    max-width: 700px;
    padding: 40px;
    border-radius: 24px;
    background: ${COLORS.white};
    box-shadow: 0 4px 20px ${COLORS.shadow};

    @media (max-width: 768px) {
        padding: 24px;
        border-radius: 20px;
    }
`

export const DocTitle = styled.h2`
    font-size: 28px;
    font-weight: 800;
    margin: 0 0 24px 0;
    letter-spacing: -0.5px;
    color: ${COLORS.black};
    border-bottom: 2px solid ${COLORS.grey};
    padding-bottom: 16px;

    @media (max-width: 768px) {
        font-size: 24px;
        margin: 0 0 20px 0;
        padding-bottom: 12px;
    }
`

export const ContentBody = styled.div`
    color: ${COLORS.greyDark};
`

export const SectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: ${COLORS.black};
    margin: 24px 0 12px 0;

    @media (max-width: 768px) {
        font-size: 16px;
        margin: 20px 0 10px 0;
    }
`

export const Paragraph = styled.p`
    font-size: 15px;
    line-height: 1.6;
    margin: 0 0 16px 0;
    
    &:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 768px) {
        font-size: 14px;
        line-height: 1.5;
    }
`

// --- Hub Styled Components ---

export const HubContainer = styled.div`
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 40px 0;
`

export const HubTitle = styled.h1`
    font-size: 48px;
    font-weight: 700;
    color: ${COLORS.black};
    margin: 0 0 60px 0;
    letter-spacing: -0.015em;

    @media (max-width: 768px) {
        font-size: 40px;
        margin-bottom: 40px;
    }
`

export const CategorySection = styled.div`
    margin-bottom: 48px;
`

export const CategoryTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: ${COLORS.black};
    margin: 0 0 20px 0;
    padding-bottom: 16px;
    border-bottom: 3px solid ${COLORS.grey};

    @media (max-width: 768px) {
        font-size: 20px;
    }
`

export const CategoryList = styled.div`
    display: flex;
    flex-direction: column;
`

export const CategoryItem = styled.div`
    ${flex('row','center','space-between')}
    padding: 16px 0;
    cursor: pointer;
    border-bottom: 1px solid ${COLORS.grey};
    transition: opacity 0.2s;

    span {
        font-size: 17px;
        color: ${COLORS.info};
        font-weight: 400;
    }

    &:hover {
        span {
        text-decoration: underline;
        }
    }

    @media (max-width: 768px) {
        span {
        font-size: 16px;
        }
    }
`