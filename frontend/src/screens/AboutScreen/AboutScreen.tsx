import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaGithub, FaExternalLinkAlt, FaHeart, FaShieldAlt, FaLeaf } from 'react-icons/fa';

export function AboutScreen() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaChevronLeft />
          <span>Volver</span>
        </BackButton>
        <Title>Acerca del Proyecto</Title>
      </Header>

      <ScrollContent>
        <HeroSection>
          <LogoWrapper>♻️</LogoWrapper>
          <AppName>Trash2Treasure</AppName>
          <AppVersion>Versión 1.0.2 Stable</AppVersion>
          <USP>Refiniendo el concepto de "desperdicio" en valor compartido.</USP>
        </HeroSection>

        <Section>
          <SectionTitle>
            <FaLeaf color="#34c759" /> Nuestra Misión
          </SectionTitle>
          <Text>
            Trash2Treasure es una plataforma pionera de economía circular diseñada para transformar 
            la forma en que nuestras comunidades manejan los excedentes. Nuestra misión es simple 
            pero ambiciosa: **eliminar el concepto de 'basura'** conectando objetos infrautilizados 
            con personas que pueden renovarlos, reutilizarlos o reciclarlos.
          </Text>
          <Text>
            Cada item reportado en este mapa es una oportunidad para reducir la huella de carbono 
            y fortalecer los lazos vecinales a través de la generosidad y el cuidado del medio ambiente.
          </Text>
        </Section>

        <Section>
          <SectionTitle>
            <FaShieldAlt color="#0071e3" /> Propiedad Intelectual
          </SectionTitle>
          <CopyrightBox>
            <CopyrightText>
              © {new Date().getFullYear()} Trash2Treasure. Todos los derechos reservados.
            </CopyrightText>
            <LegalNotice>
              Este software y su metodología de "matching" geolocalizado son propiedad intelectual 
              de Ismael Marot y iM Projects. Prohibida la reproducción total o parcial del código, 
              diseño UX/UI o arquitectura del sistema sin autorización expresa por escrito.
            </LegalNotice>
          </CopyrightBox>
        </Section>

        <Section>
          <SectionTitle>
            <FaHeart color="#ff2d55" /> Desarrollo y Créditos
          </SectionTitle>
          <Text>
            Conceptualizado y desarrollado íntegramente por **Ismael Marot** bajo el sello de **iM Projects**.
          </Text>
          <LinkGroup>
            <ExternalLink href="https://github.com/ismaelmarot" target="_blank" rel="noopener noreferrer">
              <FaGithub /> Perfil de GitHub
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt /> Portfolio Profesional
            </ExternalLink>
          </LinkGroup>
        </Section>

        <Section>
          <SectionTitle>Atribuciones Técnicas</SectionTitle>
          <AttributionGrid>
            <AttributionItem>
              <AttrLabel>Mapas</AttrLabel>
              <AttrText>&copy; OpenStreetMap contributors, CARTO</AttrText>
            </AttributionItem>
            <AttributionItem>
              <AttrLabel>Geocodificación</AttrLabel>
              <AttrText>Nominatim API</AttrText>
            </AttributionItem>
            <AttributionItem>
              <AttrLabel>Tecnologías</AttrLabel>
              <AttrText>React, Leaflet, Node.js, SQLite</AttrText>
            </AttributionItem>
          </AttributionGrid>
        </Section>

        <Footer>
          <FooterLinks>
            <FooterLink onClick={() => navigate('/legal/privacy')}>Privacy Policy</FooterLink>
            <FooterLink onClick={() => navigate('/legal/terms')}>Terms of Use</FooterLink>
            <FooterLink onClick={() => navigate('/legal/legal')}>Legal</FooterLink>
            <FooterLink onClick={() => navigate('/sitemap')}>Site Map</FooterLink>
          </FooterLinks>
          <FooterBottom>
            <FooterText>Hecho con pasión por un futuro más sostenible.</FooterText>
            <FooterText>© {new Date().getFullYear()} iM Projects. All rights reserved.</FooterText>
          </FooterBottom>
        </Footer>
      </ScrollContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f7;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const Header = styled.header`
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #0071e3;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  margin-right: 70px; /* Offset for balance */
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 40px;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 40px;
  text-align: center;
`;

const LogoWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
`;

const AppName = styled.h2`
  font-size: 34px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const AppVersion = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #86868b;
  background: #eaeaeb;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
`;

const USP = styled.p`
  font-size: 19px;
  font-weight: 500;
  color: #424245;
  max-width: 300px;
  line-height: 1.4;
`;

const Section = styled.section`
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #1d1d1f;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #424245;
  margin: 0 0 16px 0;
  &:last-child { margin-bottom: 0; }
  
  strong {
    color: #1d1d1f;
    font-weight: 600;
  }
`;

const CopyrightBox = styled.div`
  background: #f5f5f7;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e5e5ea;
`;

const CopyrightText = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
`;

const LegalNotice = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #86868b;
  margin: 0;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0071e3;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AttributionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AttributionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AttrLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AttrText = styled.span`
  font-size: 14px;
  color: #1d1d1f;
  line-height: 1.4;
`;



const Footer = styled.footer`
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border-top: 1px solid #e5e5ea;
  margin-top: 20px;
  padding-top: 30px;
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 13px;
  color: #86868b;
  margin: 0;
  line-height: 1.5;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 0; /* Handled by padding on the links */
  width: 100%;
`;

const FooterLink = styled.button`
  background: transparent;
  border: none;
  padding: 4px 14px;
  cursor: pointer;
  color: #515154;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  position: relative;
  
  &:hover {
    color: #1d1d1f;
    text-decoration: underline;
  }

  /* Elegante separador | utilizando CSS (evita separadores colgados al hacer wrap) */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 12px;
    background-color: #d2d2d7;
  }

  /* Ajuste para móviles muy pequeños */
  @media (max-width: 380px) {
    padding: 4px 10px;
    font-size: 12px;
  }
`;
