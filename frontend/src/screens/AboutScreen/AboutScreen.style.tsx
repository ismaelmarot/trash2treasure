import styled from 'styled-components'
import { flex, size } from '../../mixins'
import { COLORS, SPACING } from '../../constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    height: 100vh;
    background: ${COLORS.white};
    color: ${COLORS.black};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`

export const Header = styled.header`
    ${flex('row','center','center')};
    width: 100%;
    top: 0;
    padding: ${SPACING.md};
    background: ${COLORS.allWhite};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: sticky;
    z-index: 100;
    border-bottom: 1px solid ${COLORS.grey};
`

export const BackButton = styled.button`
    ${flex('row','center','center')}
    gap: ${SPACING.sm};
    background: transparent;
    border: none;
    color: ${COLORS.info};
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
        opacity: 0.7;
    }
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
    padding: 0 20px 40px;
`

export const HeroSection = styled.div`
    ${flex('column','center','center')}
    padding: 60px 0 40px;
    text-align: center;
`

export const LogoWrapper = styled.div`
    font-size: 80px;
    margin-bottom: ${SPACING.lg};
`

export const AppName = styled.h2`
    font-size: 34px;
    font-weight: 800;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
`;

export const AppVersion = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${COLORS.primaryDark};
    background: ${COLORS.white};
    padding: 4px 12px;
    border-radius: ${SPACING.lg};
    margin-bottom: ${SPACING.lg};
`;

export const USP = styled.p`
    max-width: 300px;
    font-size: 19px;
    font-weight: 500;
    color: ${COLORS.black};
    line-height: 1.4;
`

export const Section = styled.section`
    padding: ${SPACING.lg};
    margin-bottom: ${SPACING.md};
    border-radius: ${SPACING.lg};
    background: ${COLORS.allWhite};
    box-shadow: 0 2px 10px ${COLORS.shadow};
`

export const SectionTitle = styled.h3`
    ${flex('row','center','flex-start')}
    gap: ${SPACING.md};
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: ${COLORS.black};
`

export const TextStyled = styled.p`
    font-size: 15px;
    line-height: 1.6;
    color: ${COLORS.black};
    margin: 0 0 16px 0;
    &:last-child { margin-bottom: 0; }
    
    strong {
        color: ${COLORS.black};
        font-weight: 600;
    }
`

export const CopyrightBox = styled.div`
    padding: ${SPACING.md};
    border-radius: ${SPACING.md};
    border: 1px solid ${COLORS.allWhite};
    background: ${COLORS.white};
`

export const CopyrightText = styled.p`
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.black};
`

export const LegalNotice = styled.p`
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: ${COLORS.black};
`

export const LinkGroup = styled.div`
    ${flex('column','flex-start','center')}
    gap: ${SPACING.md};
    margin: ${SPACING.md};
`

export const ExternalLink = styled.a`
    ${flex('row','center','center')}
    gap: 10px;
    color: ${COLORS.info};
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    &:hover {
        text-decoration: underline;
    }
`

export const AttributionGrid = styled.div`
    ${flex('column','flex-start','center')}
    gap: 16px;
`;

export const AttributionItem = styled.div`
    ${flex('column','flex-start','center')}
    gap: 4px;
`

export const AttrLabel = styled.span`
    font-size: 12px;
    font-weight: 700;
    color: ${COLORS.primaryDark};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const AttrText = styled.span`
    font-size: 14px;
    color: ${COLORS.black};
    line-height: 1.4;
`

export const Footer = styled.footer`
    ${flex('column','center','center')}
    gap: ${SPACING.sm};
    padding: ${SPACING.xl};
    margin-top: ${SPACING.xs};
    border-top: 1px solid ${COLORS.grey};
`

export const FooterBottom = styled.div`
    ${flex('column','center','center')}
    gap: 6px;
`

export const FooterText = styled.p`
    font-size: 13px;
    color: ${COLORS.primaryDark};
    margin: 0;
    line-height: 1.5;
`

export const FooterLinks = styled.div`
    ${flex('row','center','center')}
    flex-wrap: wrap;
    row-gap: 12px;
    column-gap: 0;
    width: 100%;
`

export const FooterLink = styled.button`
    background: transparent;
    border: none;
    padding: ${SPACING.xs} ${SPACING.md};
    cursor: pointer;
    color: ${COLORS.black};
    text-decoration: none;
    font-size: 13px;
    font-weight: 400;
    position: relative;

    /* Separator | */
    &:not(:last-child)::after {
        ${size('1px','12px')}
        right: 0;
        top: 50%;
        content: '';
        position: absolute;
        transform: translateY(-50%);
        background-color: ${COLORS.grey};
    }

    /* Ajust small mobiles */
    @media (max-width: 380px) {
        padding: 4px 10px;
        font-size: 12px;
    }
`