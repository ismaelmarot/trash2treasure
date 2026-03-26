import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL, ICONS } from '@/constants'
import {
  BackButton,
  Card,
  Container,
  Divider,
  ErrorMessage,
  FooterText,
  Header,
  Input,
  InputGroup,
  Label,
  StyledLink,
  SubmitButton,
  Subtitle,
  Title,
  Span,
} from './ForgotPasswordScreen.styles'

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || t('forgotPassword.error'))
      }
    } catch (err) {
      setError(t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Container>
        <Card>
          <Header>
            <BackButton onClick={() => navigate('/login')}>
              <ICONS.arrowLeft /><Span>{t('common.back')}</Span>
            </BackButton>
          </Header>
          <Title>✓ {t('forgotPassword.emailSent')}</Title>
          <Subtitle>
            {t('forgotPassword.emailSentSubtitle')}
          </Subtitle>
          <FooterText style={{ marginTop: '24px' }}>
            <StyledLink to="/login">{t('forgotPassword.backToLogin')}</StyledLink>
          </FooterText>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/login')}>
            <ICONS.arrowLeft /><Span>{t('common.back')}</Span>
          </BackButton>
        </Header>
        <Title>{t('forgotPassword.title')}</Title>
        <Subtitle>{t('forgotPassword.subtitle')}</Subtitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>{t('auth.email')}</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder={t('auth.emailPlaceholder')}
              required 
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? t('forgotPassword.sending') : t('forgotPassword.sendButton')}
          </SubmitButton>
        </form>

        <Divider />
        
        <FooterText>
          {t('forgotPassword.remembered')} <StyledLink to="/login">{t('auth.login')}</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}
