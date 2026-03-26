import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
import {
  ButtonGroup,
  Card,
  Container,
  Dot,
  Icon,
  InfoBox,
  InfoItem,
  InfoTitle,
  LoadingSpinner,
  PrimaryButton,
  SecondaryButton,
  Subtitle,
  SuccessIcon,
  Title
} from './ClaimConfirmationScreen.styles'

export function ClaimConfirmationScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performClaim = async () => {
      try {
        const itemResponse = await fetch(`${API_BASE_URL}/items/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const item = await itemResponse.json()

        let userLat = null;
        let userLng = null;
        
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000
            });
          });
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
        } catch (geoError) {
          console.error('Error getting location:', geoError);
        }

        const response = await fetch(`${API_BASE_URL}/items/${id}/claim`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userLat, userLng })
        })
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || t('claimConfirmation.error'));
        }
        
        await fetch(`${API_BASE_URL}/points/add-collect`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            category: item.category, 
            itemId: id,
            createdAt: item.created_at 
          })
        })
        
        if (typeof window !== 'undefined' && (window as any).refreshPointsData) {
          (window as any).refreshPointsData()
        }
        
        setLoading(false)
      } catch (err: any) {
        console.error('Error claiming item:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    if (id && token) {
      performClaim()
    }
  }, [id, token, t])

  if (loading) {
    return (
      <Container>
        <Card>
          <LoadingSpinner />
          <Title>{t('claimConfirmation.processing')}</Title>
          <Subtitle>{t('claimConfirmation.wait')}</Subtitle>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Icon>⚠️</Icon>
          <Title>{t('claimConfirmation.errorTitle')}</Title>
          <Subtitle>{error}</Subtitle>
          <ButtonGroup>
            <PrimaryButton onClick={() => navigate('/app/search')}>
              {t('claimConfirmation.backToExplore')}
            </PrimaryButton>
          </ButtonGroup>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Card>
        <SuccessIcon>💎</SuccessIcon>
        <Title>{t('claimConfirmation.successTitle')}</Title>
        <Subtitle>
          {t('claimConfirmation.successSubtitle')}
        </Subtitle>
        
        <InfoBox>
          <InfoTitle>{t('claimConfirmation.whatsNext')}</InfoTitle>
          <InfoItem>
            <Dot>•</Dot>
            <span>{t('claimConfirmation.step1')}</span>
          </InfoItem>
          <InfoItem>
            <Dot>•</Dot>
            <span>{t('claimConfirmation.step2')}</span>
          </InfoItem>
          <InfoItem>
            <Dot>•</Dot>
            <span>{t('claimConfirmation.step3')}</span>
          </InfoItem>
        </InfoBox>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/app/activity?tab=claimed')}>
            {t('claimConfirmation.viewClaimed')}
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate('/app')}>
            {t('claimConfirmation.goToMap')}
          </SecondaryButton>
        </ButtonGroup>
      </Card>
    </Container>
  )
}
