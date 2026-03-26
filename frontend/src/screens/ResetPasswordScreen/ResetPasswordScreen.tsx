import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL, ICONS } from '@/constants'
import {
  BackButton,
  Card,
  Container,
  ErrorMessage,
  FooterText,
  Header,
  Input,
  InputGroup,
  Label,
  PasswordWrapper,
  StyledLink,
  SubmitButton,
  Subtitle,
  Title,
  ToggleButton,
  Span,
} from './ResetPasswordScreen.styles'

export function ResetPasswordScreen() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError(t('resetPassword.invalidLink'))
      return
    }

    if (password.length < 6) {
      setError(t('changePassword.minLength'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('changePassword.mustMatch'))
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || t('resetPassword.error'))
      }
    } catch (err) {
      setError(t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Container>
        <Card>
          <Header>
            <BackButton onClick={() => navigate('/login')}>
              <ICONS.arrowLeft /><Span>{t('common.back')}</Span>
            </BackButton>
          </Header>
          <Title>{t('resetPassword.invalidLinkTitle')}</Title>
          <Subtitle>
            {t('resetPassword.invalidLinkSubtitle')}
          </Subtitle>
          <FooterText style={{ marginTop: '24px' }}>
            <StyledLink to="/forgot-password">{t('resetPassword.requestNew')}</StyledLink>
          </FooterText>
        </Card>
      </Container>
    )
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
          <Title>{t('resetPassword.successTitle')}</Title>
          <Subtitle>
            {t('resetPassword.successSubtitle')}
          </Subtitle>
          <FooterText style={{ marginTop: '24px' }}>
            <StyledLink to="/login">{t('auth.login')}</StyledLink>
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
        <Title>{t('resetPassword.newPasswordTitle')}</Title>
        <Subtitle>{t('resetPassword.newPasswordSubtitle')}</Subtitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>{t('changePassword.newPassword')}</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <ICONS.eyeOpen /> : <ICONS.eyeClosed />}
              </ToggleButton>
            </PasswordWrapper>
          </InputGroup>

          <InputGroup>
            <Label>{t('changePassword.confirmNewPassword')}</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </PasswordWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? t('resetPassword.resetting') : t('resetPassword.resetButton')}
          </SubmitButton>
        </form>
      </Card>
    </Container>
  )
}
