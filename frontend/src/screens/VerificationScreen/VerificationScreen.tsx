import { useState } from 'react'
import { useNavigate, useLocation, Form } from 'react-router-dom'
import { API_BASE_URL } from '@/constants'
import {
  Card,
  CodeInput,
  Container,
  ErrorMessage,
  Icon,
  InputGroup,
  Label,
  ResendLinkText,
  SubmitButton,
  Subtitle,
  Title
} from './VerificationScreen.styles'

export function VerificationScreen() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  if (!email) {
    navigate('/register')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/users/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/login', { state: { message: 'Cuenta verificada. ¡Ya puedes entrar!' } })
      } else {
        setError(data.error || 'Código inválido')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Card>
        <Icon>📧</Icon>
        <Title>Verifica tu email</Title>
        <Subtitle>
          Hemos enviado un código de 6 dígitos a <br />
          <strong>{email}</strong>
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Código de verificación</Label>
            <CodeInput 
              type='text'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required 
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type='submit' disabled={loading}>
            {loading ? "Verificando..." : "Verificar Cuenta"}
          </SubmitButton>
        </Form>
        
        <ResendLinkText>
          ¿No recibiste nada? <button type='button'>Reenviar código</button>
        </ResendLinkText>
      </Card>
    </Container>
  )
}