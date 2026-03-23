import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, ICONS } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
import {
  Card,
  Container,
  ErrorMessage,
  Header,
  Input,
  InputGroup,
  Label,
  PasswordWrapper,
  SubmitButton,
  Subtitle,
  Title,
  ToggleButton,
} from './ChangePasswordScreen.styles'

export function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/app')
      } else {
        setError(data.error || 'Error al cambiar la contraseña')
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
        <Header />
        <Title>Cambiar contraseña</Title>
        <Subtitle>Ingresa tu contraseña temporal y elegí una nueva</Subtitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Contraseña actual</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Contraseña temporal"
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
            <Label>Nueva contraseña</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </PasswordWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Confirmar nueva contraseña</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí la nueva contraseña"
                required
              />
            </PasswordWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </SubmitButton>
        </form>
      </Card>
    </Container>
  )
}
