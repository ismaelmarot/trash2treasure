import { useState } from 'react'
import { useNavigate, Form } from 'react-router-dom'
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
        navigate('/app');
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/welcome')}>
            <ICONS.arrowLeft /><Span>Volver</Span>
          </BackButton>
        </Header>
        <Title>Bienvenido de nuevo</Title>
        <Subtitle>Ingresa a tu cuenta de Trash2Treasure</Subtitle>

        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com"
              required 
            />
          </InputGroup>
          
          <InputGroup>
            <Label>Contraseña</Label>
            <PasswordWrapper>
              <Input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="********"
                required 
              />
              <ToggleButton 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <ICONS.eyeOpen /> : <ICONS.eyeClosed />}
              </ToggleButton>
            </PasswordWrapper>
          </InputGroup>

          <StyledLink 
            to="/forgot-password" 
            style={{ fontSize: '12px', color: '#666', textAlign: 'right', display: 'block', marginTop: '-8px', marginBottom: '16px' }}
          >
            ¿Olvidaste tu contraseña?
          </StyledLink>


          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
        </Form>

        <Divider><span>O continúa con</span></Divider>

        <SocialButtons>
          <SocialButton $provider="facebook">Facebook</SocialButton>
          <SocialButton $provider="apple">Apple</SocialButton>
        </SocialButtons>

        <FooterText>
          ¿No tienes cuenta? <StyledLink to="/register">Regístrate</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}