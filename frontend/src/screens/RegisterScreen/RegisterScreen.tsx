import { useState } from 'react'
import { useNavigate, Form } from 'react-router-dom'
import { API_BASE_URL, ICONS, ICONS_LOGUIN } from '@/constants'
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
  ValidationItem,
  ValidationList
} from './RegisterScreen.styles'

export function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const isPasswordValid = Object.values(validations).every(v => v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad')
      return
    }
    setError('')

    try {

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/verify', { state: { email } })
      } else {

        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Connection error')
    }
  }

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/welcome')}>
            ← Volver
          </BackButton>
        </Header>
        <Title>Crear cuenta</Title>
        <Subtitle>Únete a la comunidad de Trash2Treasure</Subtitle>

        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nombre</Label>
            <Input 
              type='text'
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              required 
            />
          </InputGroup>

          <InputGroup>
            <Label>Email</Label>
            <Input 
              type='email' 
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
                placeholder="Mínimo 8 caracteres"
                required 
              />
              <ToggleButton 
                type='button'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ICONS.eyeOpen /> : <ICONS.eyeClosed />}
              </ToggleButton>
            </PasswordWrapper>
            
            <ValidationList>
              <ValidationItem $valid={validations.length}>
                {validations.length ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot} Mínimo 8 caracteres
              </ValidationItem>
              <ValidationItem $valid={validations.uppercase}>
                {validations.uppercase ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot} Una mayúscula
              </ValidationItem>
              <ValidationItem $valid={validations.lowercase}>
                {validations.lowercase ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot} Una minúscula
              </ValidationItem>
              <ValidationItem $valid={validations.number}>
                {validations.number ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot} Un número
              </ValidationItem>
            </ValidationList>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type='submit'>Registrarse</SubmitButton>
        </Form>

        <FooterText>
          ¿Ya tienes cuenta? <StyledLink to='/login'>Inicia sesión</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}