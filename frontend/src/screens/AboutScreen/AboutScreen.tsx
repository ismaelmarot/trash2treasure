import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { appIcon } from '@/assets'
import { ICONS } from '@/constants'
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
  AppIcon
} from './AboutScreen.styles'

export function AboutScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ICONS.arrowLeft />
          <span>{t('common.back')}</span>
        </BackButton>
        <Title>{t('about.title')}</Title>
      </Header>

      <ScrollContent>
        <HeroSection>
          <AppIcon src={appIcon} alt="App logo" />
          <AppName>Trash2Treasure</AppName>
          <AppVersion>{t('about.version')} 1.1.0 Stable</AppVersion>
          <USP>{t('about.tagline')}</USP>
        </HeroSection>

        <Section>
          <SectionTitle>
            <ICONS.leafIcon color='#34c759' /> {t('about.mission')}
          </SectionTitle>
          <TextStyled>
            {t('about.missionText1')}
          </TextStyled>
          <TextStyled>
            {t('about.missionText2')}
          </TextStyled>
        </Section>

        <Section>
          <SectionTitle>
            <ICONS.shielIcon color='#0071e3' /> {t('about.intellectualProperty')}
          </SectionTitle>
          <CopyrightBox>
            <CopyrightText>
              © {new Date().getFullYear()} Trash2Treasure. {t('about.copyright')}
            </CopyrightText>
            <LegalNotice>
              {t('about.legalNotice', { author: 'Ismael Marot', company: 'iM Projects' })}
            </LegalNotice>
          </CopyrightBox>
        </Section>

        <Section>
          <SectionTitle>
            <ICONS.hartIcon color='#ff2d55' /> {t('about.development')}
          </SectionTitle>
          <TextStyled>
            {t('about.developedBy', { author: 'Ismael Marot', company: 'iM Projects' })}
          </TextStyled>
          <LinkGroup>
            <ExternalLink href='https://github.com/ismaelmarot' target='_blank' rel="noopener noreferrer">
              <ICONS.gitHub /> {t('about.githubProfile')}
            </ExternalLink>
            <ExternalLink href='https://www.linkedin.com/in/ismael-marot/' target='_blank' rel="noopener noreferrer">
              <ICONS.linkedIn /> {t('about.linkedIn')}
            </ExternalLink>
            <ExternalLink href='#' target='_blank' rel="noopener noreferrer">
              <ICONS.externalLink /> {t('about.portfolio')}
            </ExternalLink>
          </LinkGroup>
        </Section>

        <Section>
          <SectionTitle>{t('about.technicalAttributions')}</SectionTitle>
          <AttributionGrid>
            <AttributionItem>
              <AttrLabel>{t('about.maps')}</AttrLabel>
              <AttrText>© OpenStreetMap contributors, CARTO</AttrText>
            </AttributionItem>
            <AttributionItem>
              <AttrLabel>{t('about.geocoding')}</AttrLabel>
              <AttrText>Nominatim API</AttrText>
            </AttributionItem>
            <AttributionItem>
              <AttrLabel>{t('about.technologies')}</AttrLabel>
              <AttrText>React, Leaflet, Node.js, SQLite</AttrText>
            </AttributionItem>
          </AttributionGrid>
        </Section>

        <Footer>
          <FooterLinks>
            <FooterLink onClick={() => navigate('/app/legal/privacy')}>{t('footer.privacyPolicy')}</FooterLink>
            <FooterLink onClick={() => navigate('/app/legal/terms')}>{t('footer.termsOfUse')}</FooterLink>
            <FooterLink onClick={() => navigate('/app/legal/legal')}>{t('footer.legal')}</FooterLink>
            <FooterLink onClick={() => navigate('/app/sitemap')}>{t('footer.siteMap')}</FooterLink>
          </FooterLinks>
          <FooterBottom>
            <FooterText>{t('footer.madeWith')}</FooterText>
            <FooterText>© {new Date().getFullYear()} iM Projects. {t('footer.rightsReserved')}</FooterText>
          </FooterBottom>
        </Footer>
      </ScrollContent>
    </Container>
  )
}
