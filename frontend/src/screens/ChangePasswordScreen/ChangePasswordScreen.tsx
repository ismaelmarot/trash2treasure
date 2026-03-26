import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation();
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
      setError(t('changePassword.minLength'))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('changePassword.mustMatch'))
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
        setError(data.error || t('changePassword.error'))
      }
    } catch (err) {
      setError(t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Card>
        <Header />
        <Title>{t('changePassword.title')}</Title>
        <Subtitle>{t('changePassword.subtitle')}</Subtitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>{t('changePassword.currentPassword')}</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('changePassword.tempPassword')}
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
            <Label>{t('changePassword.newPassword')}</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('changePassword.minChars')}
                required
              />
            </PasswordWrapper>
          </InputGroup>

          <InputGroup>
            <Label>{t('changePassword.confirmNewPassword')}</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('changePassword.repeatPassword')}
                required
              />
            </PasswordWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? t('common.save') + '...' : t('changePassword.saveButton')}
          </SubmitButton>
        </form>
      </Card>
    </Container>
  )
}
