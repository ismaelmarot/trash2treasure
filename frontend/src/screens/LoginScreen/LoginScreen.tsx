import { useState } from 'react'
import { useNavigate, Form } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL, ICONS } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
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
  PasswordWrapper,
  SocialButton,
  SocialButtons,
  StyledLink,
  SubmitButton,
  Subtitle,
  Title,
  ToggleButton,
  Span,
} from './LoginScreen.styles'

export function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
        if (data.user.must_change_password) {
          navigate('/change-password');
        } else {
          navigate('/app');
        }
      } else {
        setError(data.error || t('auth.loginError'))
      }
    } catch (err) {
      setError(t('auth.connectionError'));
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/welcome')}>
            <ICONS.arrowLeft /><Span>{t('common.back')}</Span>
          </BackButton>
        </Header>
        <Title>{t('auth.loginTitle')}</Title>
        <Subtitle>{t('auth.loginSubtitle')}</Subtitle>

        
        <Form onSubmit={handleSubmit}>
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
          
          <InputGroup>
            <Label>{t('auth.password')}</Label>
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

          <StyledLink 
            to="/forgot-password" 
            style={{ fontSize: '12px', color: '#666', textAlign: 'right', display: 'block', marginTop: '-8px', marginBottom: '16px' }}
          >
            {t('auth.forgotPassword')}
          </StyledLink>


          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit">{t('auth.login')}</SubmitButton>
        </Form>

        <Divider><span>{t('auth.continueWith')}</span></Divider>

        <SocialButtons>
          <SocialButton $provider="facebook">Facebook</SocialButton>
          <SocialButton $provider="apple">Apple</SocialButton>
        </SocialButtons>

        <FooterText>
          {t('auth.noAccount')} <StyledLink to="/register">{t('auth.register')}</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}
