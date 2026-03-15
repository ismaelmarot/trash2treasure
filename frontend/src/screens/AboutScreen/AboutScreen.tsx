
import { useNavigate } from 'react-router-dom'
import { appIcon } from '@/assets'
import {
  AppName,
  AppVersion,
  AttributionGrid,
  AttributionItem,
  AttrLabel,
  AttrText,
  BackButton,
  Container,
  CopyrightBox,
  CopyrightText,
  ExternalLink,
  Footer,
  FooterBottom,
  FooterLink,
  FooterLinks,
  FooterText,
  Header,
  HeroSection,
  LegalNotice,
  LinkGroup,
  ScrollContent,
  Section,
  SectionTitle,
  TextStyled,
  Title,
  USP,
  Span,
} from './AboutScreen.styles'
import { ICONS } from '../../constants'


export function AboutScreen() {
  const navigate = useNavigate()

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ICONS.arrowLeft />
          <span>Volver</span>
        </BackButton>
        <Title>Acerca del Proyecto</Title>
      </Header>

      <ScrollContent>
        <HeroSection>
          <img src={appIcon} alt="App logo" style={{width:'8rem'}} />
          <AppName>Trash2Treasure</AppName>
          <AppVersion>Versión 1.0.2 Stable</AppVersion>
          <USP>Refiniendo el concepto de "desperdicio" en valor compartido.</USP>
        </HeroSection>

        <Section>
          <SectionTitle>
            <ICONS.leafIcon color='#34c759' /> Nuestra Misión
          </SectionTitle>
          <TextStyled>
            Trash2Treasure es una plataforma de economía circular diseñada para transformar 
            la forma en que nuestras comunidades manejan los excedentes. Nuestra misión es simple 
            pero ambiciosa: <Span>eliminar el concepto de 'basura'</Span> conectando objetos infrautilizados 
            con personas que pueden renovarlos, reutilizarlos o reciclarlos.
          </TextStyled>
          <TextStyled>
            Cada item reportado en este mapa es una oportunidad para reducir la huella de carbono 
            y fortalecer los lazos vecinales a través de la generosidad y el cuidado del medio ambiente.
          </TextStyled>
        </Section>

        <Section>
          <SectionTitle>
            <ICONS.shielIcon color='#0071e3' /> Propiedad Intelectual
          </SectionTitle>
          <CopyrightBox>
            <CopyrightText>
              © {new Date().getFullYear()} Trash2Treasure. Todos los derechos reservados.
            </CopyrightText>
            <LegalNotice>
              Este software y su metodología de "matching" geolocalizado son propiedad intelectual 
              de <Span>Ismael Marot</Span> y <Span>iM Projects</Span>. Prohibida la reproducción total o parcial del código, 
              diseño UX/UI o arquitectura del sistema sin autorización expresa por escrito.
            </LegalNotice>
          </CopyrightBox>
        </Section>

        <Section>
          <SectionTitle>
            <ICONS.hartIcon color='#ff2d55' /> Desarrollo y Créditos
          </SectionTitle>
          <TextStyled>
            Conceptualizado y desarrollado íntegramente por <Span>Ismael Marot</Span> bajo el sello de <Span>iM Projects</Span>.
          </TextStyled>
          <LinkGroup>
            <ExternalLink href='https://github.com/ismaelmarot' target='_blank' rel="noopener noreferrer">
              <ICONS.gitHub /> Perfil de GitHub
            </ExternalLink>
            <ExternalLink href='#' target='_blank' rel="noopener noreferrer">
              <ICONS.externalLink /> Portfolio Profesional
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
  )
}