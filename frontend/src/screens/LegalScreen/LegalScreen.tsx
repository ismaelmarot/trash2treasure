import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type DocumentType = 'privacy' | 'terms' | 'legal' | 'license' | 'ethics' | 'ip' | 'attributions';

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
            <FaChevronLeft />
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
                  <FaChevronRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>

            <CategorySection>
              <CategoryTitle>Servicios de Internet y Políticas</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/legal/privacy')}>
                  <span>Privacy Policy</span>
                  <FaChevronRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/legal/terms')}>
                  <span>Terms of Use</span>
                  <FaChevronRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/legal/ethics')}>
                  <span>Ethics & Compliance</span>
                  <FaChevronRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>

            <CategorySection>
              <CategoryTitle>Propiedad Intelectual</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/legal/ip')}>
                  <span>Copyright & Trademarks</span>
                  <FaChevronRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/legal/attributions')}>
                  <span>Atribuciones de Terceros</span>
                  <FaChevronRight color="#c7c7cc" size={14} />
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
          <FaChevronLeft />
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f7;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const Header = styled.header`
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #0071e3;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  
  &:hover { opacity: 0.7; }
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  margin-right: 70px;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const DocumentContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  max-width: 700px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
`;

const DocTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
  border-bottom: 2px solid #f5f5f7;
  padding-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin: 0 0 20px 0;
    padding-bottom: 12px;
  }
`;

const ContentBody = styled.div`
  color: #424245;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 24px 0 12px 0;

  @media (max-width: 768px) {
    font-size: 16px;
    margin: 20px 0 10px 0;
  }
`;

const Paragraph = styled.p`
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
  }
`;

// --- Hub Styled Components ---

const HubContainer = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 0;
`;

const HubTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 60px 0;
  letter-spacing: -0.015em;

  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 40px;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 48px;
`;

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #d2d2d7;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f7;
  transition: opacity 0.2s;

  span {
    font-size: 17px;
    color: #0071e3;
    font-weight: 400;
  }

  &:hover {
    span {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    span {
      font-size: 16px;
    }
  }
`;
