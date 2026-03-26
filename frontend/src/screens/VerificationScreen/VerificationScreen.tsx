import { useState } from 'react'
import { useNavigate, useLocation, Form } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
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
  const { t } = useTranslation();
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const password = location.state?.password
  const { login } = useAuth()

  if (!email) {
    navigate('/register')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const verifyResponse = await fetch(`${API_BASE_URL}/users/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setError(verifyData.error || t('verification.invalidCode'))
        setLoading(false)
        return
      }

      if (password) {
        const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const loginData = await loginResponse.json()

        if (loginResponse.ok) {
          login(loginData.token, loginData.user)
          navigate('/app')
        } else {
          setError(t('verification.loginError'))
        }
      } else {
        navigate('/login', { state: { message: t('verification.accountVerified') } })
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
        <Icon>📧</Icon>
        <Title>{t('verification.title')}</Title>
        <Subtitle>
          {t('verification.subtitle')} <br />
          <strong>{email}</strong>
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>{t('verification.codeLabel')}</Label>
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
            {loading ? t('verification.verifying') : t('verification.verifyButton')}
          </SubmitButton>
        </Form>
        
        <ResendLinkText>
          {t('verification.notReceived')} <button type='button'>{t('verification.resendCode')}</button>
        </ResendLinkText>
      </Card>
    </Container>
  )
}
