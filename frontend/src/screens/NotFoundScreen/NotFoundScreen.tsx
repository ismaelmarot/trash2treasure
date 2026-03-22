import { useNavigate } from 'react-router-dom'
import {
  Container,
  Content,
  Icon,
  Title,
  Description,
  HomeButton
} from './NotFoundScreen.styles'

export function NotFoundScreen() {
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <Icon>🔍</Icon>
        <Title>404</Title>
        <Description>
          Ups... esta página no existe o fue movida
        </Description>
        <HomeButton onClick={() => navigate('/app')}>
          Volver al Mapa
        </HomeButton>
      </Content>
    </Container>
  )
}
