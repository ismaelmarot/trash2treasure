import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
      setError('Enlace inválido o expirado')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
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
        setError(data.error || 'Error al restablecer la contraseña')
      }
    } catch (err) {
      setError('Error de conexión')
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
              <ICONS.arrowLeft /><Span>Volver</Span>
            </BackButton>
          </Header>
          <Title>Enlace inválido</Title>
          <Subtitle>
            Este enlace de recuperación no es válido o ha expirado.
          </Subtitle>
          <FooterText style={{ marginTop: '24px' }}>
            <StyledLink to="/forgot-password">Solicitar nuevo enlace</StyledLink>
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
              <ICONS.arrowLeft /><Span>Volver</Span>
            </BackButton>
          </Header>
          <Title>Contraseña actualizada</Title>
          <Subtitle>
            Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión.
          </Subtitle>
          <FooterText style={{ marginTop: '24px' }}>
            <StyledLink to="/login">Iniciar sesión</StyledLink>
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
        <Title>Nueva contraseña</Title>
        <Subtitle>Ingresa tu nueva contraseña</Subtitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nueva contraseña</Label>
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

          <InputGroup>
            <Label>Confirmar contraseña</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                required
              />
            </PasswordWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </SubmitButton>
        </form>
      </Card>
    </Container>
  )
}
