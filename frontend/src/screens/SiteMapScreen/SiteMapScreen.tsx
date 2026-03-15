import { useNavigate } from 'react-router-dom'
import { ICONS } from '../../constants'
import { sitemapColumns } from './SiteMap.data'
import { SiteMapColumn } from './SiteMapColumn'
import {
  BackButton,
  Container,
  DirectoryGrid,
  Header,
  ScrollContent,
  Title
} from './SiteMapScreen.styles'

export function SiteMapScreen() {
  const navigate = useNavigate()

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ICONS.arrowLeft />
          <span>Volver</span>
        </BackButton>

        <Title>Site Map</Title>
      </Header>

      <ScrollContent>
        <DirectoryGrid>
          {sitemapColumns.map(column => (
            <SiteMapColumn
              key={column.title}
              column={column}
            />
          ))}
        </DirectoryGrid>
      </ScrollContent>
    </Container>
  )
}