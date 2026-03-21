import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appIcon } from '@/assets'
import { API_BASE_URL } from '@/constants'
import { useAuth } from '@/hooks'
import {
  AppIcon,
  AppName,
  AppVersion,
  Container,
  EcoPointsBadge,
  LoadingDots,
  Dot,
  PointsValue,
  USP
} from './SplashScreen.styles'

export function SplashScreen() {
  const navigate = useNavigate()
  const { token, isAuthenticated } = useAuth()
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && token) {
        try {
          const res = await fetch(`${API_BASE_URL}/points/my-points`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await res.json()
          setTotalPoints(data.points?.total_points || 0)
        } catch (err) {
          console.error('Error loading points:', err)
        }
      }

      // Esperar 2.5 segundos para mostrar la splash screen
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/app')
        } else {
          navigate('/welcome')
        }
      }, 2500)
    }

    loadData()
  }, [isAuthenticated, token, navigate])

  return (
    <Container>
      <AppIcon src={appIcon} alt="App logo" />
      <AppName>Trash2Treasure</AppName>
      <AppVersion>Versión 1.0.2 Stable</AppVersion>
      <USP>Redifiniendo el concepto de "desperdicio" en valor compartido.</USP>

      {isAuthenticated && (
        <EcoPointsBadge>
          🌿 <PointsValue>{totalPoints}</PointsValue> Eco Points
        </EcoPointsBadge>
      )}

      <LoadingDots>
        <Dot $delay={0} />
        <Dot $delay={0.2} />
        <Dot $delay={0.4} />
      </LoadingDots>
    </Container>
  )
}
