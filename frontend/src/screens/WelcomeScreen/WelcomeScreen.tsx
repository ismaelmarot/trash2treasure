import { useNavigate } from 'react-router-dom'
import { appIcon } from '@/assets'
import {
  AppIcon,
  ButtonGroup,
  Container,
  Content,
  Footer,
  LogoContainer,
  LogoText,
  PrimaryButton,
  SecondaryButton,
  Subtitle,
  Title
} from './WelcomeScreen.styles'

export function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <LogoContainer>
          <AppIcon src={appIcon} alt="App logo" />
          <LogoText>Trash2Treasure</LogoText>
        </LogoContainer>
        
        <Title>Refiniendo el concepto de "desperdicio" en valor compartido.</Title>
        <Subtitle>
          La comunidad de economía circular más grande de tu zona. 
          Encuentra, comparte y salva tesoros.
        </Subtitle>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/register')}>
            Empezar ahora
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/login')}>
            Ya tengo cuenta
          </SecondaryButton>
        </ButtonGroup>

        <Footer>
          Al continuar, aceptas nuestros términos y condiciones.
        </Footer>
      </Content>
    </Container>
  )
}