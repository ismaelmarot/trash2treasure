import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Content,
  Icon,
  Title,
  Description,
  HomeButton
} from './NotFoundScreen.styles'

export function NotFoundScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <Icon>🔍</Icon>
        <Title>{t('notFound.title')}</Title>
        <Description>
          {t('notFound.message')}
        </Description>
        <HomeButton onClick={() => navigate('/app')}>
          {t('notFound.backHome')}
        </HomeButton>
      </Content>
    </Container>
  )
}
