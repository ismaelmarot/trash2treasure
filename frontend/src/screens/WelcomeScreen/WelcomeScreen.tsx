import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { appIcon } from '@/assets'
import {
  AppIcon,
  ButtonGroup,
  Container,
  Content,
  Footer,
  LogoContainer,
  LogoText,
  PrimaryButton,
  SecondaryButton,
  Subtitle,
  Title
} from './WelcomeScreen.styles'

export function WelcomeScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <LogoContainer>
          <AppIcon src={appIcon} alt="App logo" />
          <LogoText>{t('home.title')}</LogoText>
        </LogoContainer>
        
        <Title>{t('about.tagline')}</Title>
        <Subtitle>
          {t('welcome.tagline')}
        </Subtitle>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/register')}>
            {t('welcome.register')}
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/login')}>
            {t('auth.login')}
          </SecondaryButton>
        </ButtonGroup>

        <Footer>
          {t('welcome.termsAgree')}
        </Footer>
      </Content>
    </Container>
  )
}
