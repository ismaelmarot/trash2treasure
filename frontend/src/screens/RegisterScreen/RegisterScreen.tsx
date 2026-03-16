import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '@/components'
import {
  Container,
  Card,
  Header,
  BackButton,
  Title,
  Subtitle,
  FooterText,
  StyledLink,
  Span,
} from './RegisterScreen.styles'
import { ICONS } from '@/constants'

export function RegisterScreen() {
  const navigate = useNavigate()

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/welcome')}>
            <ICONS.arrowLeft /><Span>Volver</Span>
          </BackButton>
        </Header>

        <Title>Crear cuenta</Title>
        <Subtitle>Únete a la comunidad de Trash2Treasure</Subtitle>

        <RegisterForm />

        <FooterText>
          ¿Ya tienes cuenta? <StyledLink to='/login'>Inicia sesión</StyledLink>
        </FooterText>
      </Card>
    </Container>
  )
}