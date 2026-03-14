import { useNavigate, useParams } from 'react-router-dom'
import type { DocumentType } from '../../types'
import { ICONS } from '../../constants'
import { BackButton, CategoryItem, CategoryList, CategorySection, CategoryTitle, Container, ContentBody, DocTitle, DocumentContainer, Header, HubContainer, HubTitle, Paragraph, ScrollContent, SectionTitle, Title } from './LegalScreen.style';

const documentData: Record<DocumentType, { title: string; content: () => React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    content: () => (
      <>
        <Paragraph>Última actualización: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>1. Información que recopilamos</SectionTitle>
        <Paragraph>
          Recopilamos la información que usted nos proporciona directamente al registrarse,
          crear una publicación o interactuar con otros usuarios. Esto incluye su nombre,
          dirección de correo electrónico y datos de ubicación cuando utiliza la aplicación.
        </Paragraph>
        <SectionTitle>2. Uso de la información</SectionTitle>
        <Paragraph>
          Utilizamos la información recopilada para operar, mantener y mejorar la plataforma
          Trash2Treasure, facilitando la conexión entre usuarios para el intercambio de bienes.
          Su ubicación aproximada se utiliza exclusivamente para mostrar elementos cercanos.
        </Paragraph>
        <SectionTitle>3. Compartir su información</SectionTitle>
        <Paragraph>
          No vendemos, alquilamos ni compartimos su información personal con terceros no afiliados
          para sus propios fines de marketing sin su consentimiento explícito.
        </Paragraph>
      </>
    )
  },
  terms: {
    title: 'Terms of Use',
    content: () => (
      <>
        <Paragraph>Última actualización: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>1. Aceptación de los Términos</SectionTitle>
        <Paragraph>
          Al acceder o utilizar la plataforma Trash2Treasure, usted acepta estar sujeto a
          estos Términos de Uso y a todas las leyes y regulaciones aplicables. Si no está
          de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
        </Paragraph>
        <SectionTitle>2. Uso de la Plataforma</SectionTitle>
        <Paragraph>
          Trash2Treasure es una plataforma para facilitar la donación y el intercambio de
          bienes de segunda mano. Está prohibido publicar material ilegal, ofensivo,
          peligroso o sujeto a regulaciones estrictas (ej. armas, medicamentos contrabandeados).
        </Paragraph>
        <SectionTitle>3. Descargo de Responsabilidad</SectionTitle>
        <Paragraph>
          Los bienes se recogen "tal cual". Trash2Treasure no garantiza la calidad, 
          seguridad ni legalidad de los ítems publicados. Los intercambios se realizan 
          bajo el propio riesgo de los usuarios.
        </Paragraph>
      </>
    )
  },
  license: {
    title: 'Software License Agreements',
    content: () => (
      <>
        <Paragraph>Última actualización: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>Licencia de Uso Final (EULA)</SectionTitle>
        <Paragraph>
          Este acuerdo de licencia rige su uso de la aplicación Trash2Treasure. 
          Bajo esta licencia, se le otorga un derecho no exclusivo e intransferible para usar
          el software exclusivamente para su propósito previsto.
        </Paragraph>
        <SectionTitle>Restricciones</SectionTitle>
        <Paragraph>
          Usted no puede aplicar ingeniería inversa, descompilar ni desmontar el software. 
          Tampoco puede sublicenciar, alquilar ni arrendar ninguna parte de la aplicación.
        </Paragraph>
      </>
    )
  },
  ethics: {
    title: 'Ethics & Compliance',
    content: () => (
      <>
        <Paragraph>Última actualización: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>Nuestro Compromiso</SectionTitle>
        <Paragraph>
          En Trash2Treasure, nos comprometemos a llevar a cabo nuestra misión con los más altos
          estándares de integridad, honestidad y cumplimiento de la ley. Esperamos que 
          nuestra comunidad actúe con el mismo respeto y ética en todas sus interacciones y transacciones.
        </Paragraph>
        <SectionTitle>Economía Circular Responsable</SectionTitle>
        <Paragraph>
          Prohibimos estrictamente el uso de nuestra plataforma para actividades ilícitas,
          intercambio de materiales peligrosos o cualquier acción que perjudique el bienestar comunitario.
          Fomentamos una cultura de inclusión, diversidad y respeto medioambiental total.
        </Paragraph>
      </>
    )
  },
  ip: {
    title: 'Intellectual Property',
    content: () => (
      <>
        <Paragraph>Última actualización: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>Copyright y Marcas Registradas</SectionTitle>
        <Paragraph>
          © {new Date().getFullYear()} Trash2Treasure, una iniciativa de iM Projects. 
          Todos los derechos reservados.
        </Paragraph>
        <Paragraph>
          Tanto la marca "Trash2Treasure" como las interfaces de usuario (UI), diseño, 
          apariencia y logotipos son propiedad exclusiva de Ismael Marot. Ninguna parte 
          de esta aplicación puede ser copiada, reproducida, compilada o distribuida comercialmente.
        </Paragraph>
      </>
    )
  },
  attributions: {
    title: 'Terceros y Código Abierto',
    content: () => (
      <>
        <Paragraph>Última actualización: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>Atribuciones de Componentes</SectionTitle>
        <Paragraph>
          Nuestros mapas y utilidades geoespaciales son impulsados por los increíbles
          datos de OpenStreetMap (© OpenStreetMap contributors) y geocodificados mediante Nominatim.
        </Paragraph>
        <Paragraph>
          El framework de frontend utiliza tecnologías como React, Leaflet y styled-components,
          cuyas respectivas licencias de código abierto son reconocidas y respetadas.
        </Paragraph>
      </>
    )
  },
  legal: {
    title: 'Legal',
    content: () => <></> // Not used, legal serves as a hub
  }
};

export function LegalScreen() {
  const navigate = useNavigate();
  const { documentType } = useParams<{ documentType: string }>();

  const validKeys = Object.keys(documentData);
  const type: DocumentType = validKeys.includes(documentType || '') ? (documentType as DocumentType) : 'legal';
  
  const currentDoc = documentData[type];

  // Vista HUB estilo Apple para "/legal/legal"
  if (type === 'legal') {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ICONS.arrowLeft />
            <span>Volver</span>
          </BackButton>
        </Header>
        
        <ScrollContent style={{ padding: '0 20px', alignItems: 'flex-start' }}>
          <HubContainer>
            <HubTitle>Legal</HubTitle>
            
            <CategorySection>
              <CategoryTitle>Hardware y Software</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/legal/license')}>
                  <span>Software License Agreements</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>

            <CategorySection>
              <CategoryTitle>Servicios de Internet y Políticas</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/legal/privacy')}>
                  <span>Privacy Policy</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/legal/terms')}>
                  <span>Terms of Use</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/legal/ethics')}>
                  <span>Ethics & Compliance</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>

            <CategorySection>
              <CategoryTitle>Propiedad Intelectual</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/legal/ip')}>
                  <span>Copyright & Trademarks</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/legal/attributions')}>
                  <span>Atribuciones de Terceros</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>
            
          </HubContainer>
        </ScrollContent>
      </Container>
    );
  }

  // Vista para los Documentos Individuales

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ICONS.arrowLeft />
          <span>Volver</span>
        </BackButton>
        <Title>{currentDoc.title}</Title>
      </Header>
      
      <ScrollContent>
        <DocumentContainer>
          <DocTitle>{currentDoc.title}</DocTitle>
          <ContentBody>
            {currentDoc.content()}
          </ContentBody>
        </DocumentContainer>
      </ScrollContent>
    </Container>
  );
}