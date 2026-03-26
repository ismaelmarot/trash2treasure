import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DocumentType } from '@/types'
import { ICONS } from '@/constants'
import {
  BackButton,
  CategoryItem,
  CategoryList,
  CategorySection,
  CategoryTitle,
  Container,
  ContentBody,
  DocTitle,
  DocumentContainer,
  Header,
  HubContainer,
  HubTitle,
  Paragraph,
  ScrollContent,
  SectionTitle,
  Title
} from './LegalScreen.styles'

const documentData = (t: (key: string) => string): Record<DocumentType, { title: string; content: () => React.ReactNode }> => ({
  privacy: {
    title: t('legal.privacy'),
    content: () => (
      <>
        <Paragraph>{t('legal.lastUpdate')}: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>1. {t('legal.infoWeCollect')}</SectionTitle>
        <Paragraph>{t('legal.infoWeCollectText')}</Paragraph>
        <SectionTitle>2. {t('legal.useOfInfo')}</SectionTitle>
        <Paragraph>{t('legal.useOfInfoText')}</Paragraph>
        <SectionTitle>3. {t('legal.shareInfo')}</SectionTitle>
        <Paragraph>{t('legal.shareInfoText')}</Paragraph>
      </>
    )
  },
  terms: {
    title: t('legal.termsOfUse'),
    content: () => (
      <>
        <Paragraph>{t('legal.lastUpdate')}: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>1. {t('legal.acceptTerms')}</SectionTitle>
        <Paragraph>{t('legal.acceptTermsText')}</Paragraph>
        <SectionTitle>2. {t('legal.usePlatform')}</SectionTitle>
        <Paragraph>{t('legal.usePlatformText')}</Paragraph>
        <SectionTitle>3. {t('legal.disclaimer')}</SectionTitle>
        <Paragraph>{t('legal.disclaimerText')}</Paragraph>
      </>
    )
  },
  license: {
    title: t('legal.softwareLicense'),
    content: () => (
      <>
        <Paragraph>{t('legal.lastUpdate')}: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>{t('legal.eulaTitle')}</SectionTitle>
        <Paragraph>{t('legal.eulaText')}</Paragraph>
        <SectionTitle>{t('legal.restrictions')}</SectionTitle>
        <Paragraph>{t('legal.restrictionsText')}</Paragraph>
      </>
    )
  },
  ethics: {
    title: t('legal.ethics'),
    content: () => (
      <>
        <Paragraph>{t('legal.lastUpdate')}: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>{t('legal.ourCommitment')}</SectionTitle>
        <Paragraph>{t('legal.ourCommitmentText')}</Paragraph>
        <SectionTitle>{t('legal.circularEconomy')}</SectionTitle>
        <Paragraph>{t('legal.circularEconomyText')}</Paragraph>
      </>
    )
  },
  ip: {
    title: t('legal.intellectualProperty'),
    content: () => (
      <>
        <Paragraph>{t('legal.lastUpdate')}: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>{t('legal.copyrightTitle')}</SectionTitle>
        <Paragraph>© {new Date().getFullYear()} Trash2Treasure, {t('legal.aProductOf')} iM Projects. {t('legal.allRightsReserved')}</Paragraph>
        <Paragraph>{t('legal.ipText')}</Paragraph>
      </>
    )
  },
  attributions: {
    title: t('legal.attributions'),
    content: () => (
      <>
        <Paragraph>{t('legal.lastUpdate')}: {new Date().toLocaleDateString()}</Paragraph>
        <SectionTitle>{t('legal.componentAttributions')}</SectionTitle>
        <Paragraph>{t('legal.mapsText')}</Paragraph>
        <Paragraph>{t('legal.frontendText')}</Paragraph>
      </>
    )
  },
  legal: {
    title: t('legal.title'),
    content: () => <></>
  }
});

export function LegalScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { documentType } = useParams<{ documentType: string }>();

  const docs = documentData(t);
  const validKeys = Object.keys(docs);
  const type: DocumentType = validKeys.includes(documentType || '') ? (documentType as DocumentType) : 'legal';
  
  const currentDoc = docs[type];

  if (type === 'legal') {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ICONS.arrowLeft />
            <span>{t('common.back')}</span>
          </BackButton>
        </Header>
        
        <ScrollContent style={{ padding: '0 20px', alignItems: 'flex-start' }}>
          <HubContainer>
            <HubTitle>{t('legal.title')}</HubTitle>
            
            <CategorySection>
              <CategoryTitle>{t('legal.hwSwCategory')}</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/app/legal/license')}>
                  <span>{t('legal.softwareLicense')}</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>

            <CategorySection>
              <CategoryTitle>{t('legal.internetPoliciesCategory')}</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/app/legal/privacy')}>
                  <span>{t('legal.privacy')}</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/app/legal/terms')}>
                  <span>{t('legal.termsOfUse')}</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/app/legal/ethics')}>
                  <span>{t('legal.ethics')}</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>

            <CategorySection>
              <CategoryTitle>{t('legal.ipCategory')}</CategoryTitle>
              <CategoryList>
                <CategoryItem onClick={() => navigate('/app/legal/ip')}>
                  <span>{t('legal.copyrightTitle')}</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
                <CategoryItem onClick={() => navigate('/app/legal/attributions')}>
                  <span>{t('legal.attributions')}</span>
                  <ICONS.arrowRight color="#c7c7cc" size={14} />
                </CategoryItem>
              </CategoryList>
            </CategorySection>
            
          </HubContainer>
        </ScrollContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ICONS.arrowLeft />
          <span>{t('common.back')}</span>
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
