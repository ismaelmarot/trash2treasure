import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RegisterForm } from '@/components'
import {
  Container,
  Card,
  Header,
  BackButton,
  Title,
  Subtitle,
  FooterText,
  StyledLink,
  Span,
} from './RegisterScreen.styles'
import { ICONS } from '@/constants'

export function RegisterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/welcome')}>
            <ICONS.arrowLeft /><Span>{t('common.back')}</Span>
          </BackButton>
        </Header>

        <Title>{t('auth.createAccount')}</Title>
        <Subtitle>{t('auth.createAccountSubtitle')}</Subtitle>

        <RegisterForm />

        <FooterText>
          {t('auth.hasAccount')} <StyledLink to='/login'>{t('auth.login')}</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}
