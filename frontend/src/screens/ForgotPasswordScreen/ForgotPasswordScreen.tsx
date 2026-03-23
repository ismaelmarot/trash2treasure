import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  SuccessMessage,
} from './LoginScreen.styles'

export function ForgotPasswordScreen() {
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
        setError(data.error || 'Error al procesar la solicitud')
      }
    } catch (err) {
      setError('Error de conexión')
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
              <ICONS.arrowLeft /><Span>Volver</Span>
            </BackButton>
          </Header>
          <Title>✓ Email enviado</Title>
          <Subtitle>
            Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
          </Subtitle>
          <FooterText style={{ marginTop: '24px' }}>
            <StyledLink to="/login">Volver a iniciar sesión</StyledLink>
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
            <ICONS.arrowLeft /><Span>Volver</Span>
          </BackButton>
        </Header>
        <Title>Olvidé mi contraseña</Title>
        <Subtitle>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</Subtitle>

        <form onSubmit={handleSubmit}>
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

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </SubmitButton>
        </form>

        <Divider />
        
        <FooterText>
          ¿Recordaste tu contraseña? <StyledLink to="/login">Iniciar sesión</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}