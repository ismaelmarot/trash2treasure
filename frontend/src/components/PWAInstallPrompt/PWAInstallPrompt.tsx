import { useTranslation } from 'react-i18next'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import {
  Overlay,
  Card,
  Header,
  IconWrapper,
  InstallIcon,
  TextContent,
  Title,
  Description,
  Benefits,
  Benefit,
  BenefitIcon,
  Actions,
  InstallButton,
  DismissButton,
  CloseButton,
  CloseIcon,
} from './PWAInstallPrompt.styles'

export function PWAInstallPrompt() {
  const { t } = useTranslation()
  const { showPrompt, handleInstall, dismissPrompt } = usePWAInstall()

  if (!showPrompt) return null

  return (
    <Overlay>
      <Card>
        <CloseButton onClick={dismissPrompt} aria-label={t('common.close')}>
          <CloseIcon viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </CloseIcon>
        </CloseButton>

        <Header>
          <IconWrapper>
            <InstallIcon viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </InstallIcon>
          </IconWrapper>
          <TextContent>
            <Title>{t('pwa.installTitle')}</Title>
            <Description>{t('pwa.installDesc')}</Description>
          </TextContent>
        </Header>

        <Benefits>
          <Benefit>
            <BenefitIcon viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </BenefitIcon>
            {t('pwa.benefitOffline')}
          </Benefit>
          <Benefit>
            <BenefitIcon viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </BenefitIcon>
            {t('pwa.benefitQuick')}
          </Benefit>
          <Benefit>
            <BenefitIcon viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </BenefitIcon>
            {t('pwa.benefitBetter')}
          </Benefit>
        </Benefits>

        <Actions>
          <DismissButton onClick={dismissPrompt}>
            {t('common.later')}
          </DismissButton>
          <InstallButton onClick={handleInstall}>
            {t('pwa.install')}
          </InstallButton>
        </Actions>
      </Card>
    </Overlay>
  )
}
