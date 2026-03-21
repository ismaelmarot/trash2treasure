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
  Developer,
  EcoPointsBadge,
  LoadingDots,
  Dot,
  PointsValue,
  USP,
  AnimatedLetter
} from './SplashScreen.styles'

const USP_TEXT = 'Redefiniendo el concepto de "desperdicio" en valor compartido.'

export function SplashScreen() {
  const navigate = useNavigate()
  const { token, isAuthenticated } = useAuth()
  const [totalPoints, setTotalPoints] = useState(0)
  const [visibleLetters, setVisibleLetters] = useState(0)

  const SPLASH_DURATION = 3000 // 3 segundos

  useEffect(() => {
    // Calcular intervalo para que termine exactamente en SPLASH_DURATION
    const interval = SPLASH_DURATION / USP_TEXT.length
    
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev >= USP_TEXT.length) {
          clearInterval(letterInterval)
          return prev
        }
        return prev + 1
      })
    }, interval)

    return () => clearInterval(letterInterval)
  }, [])

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

      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/app')
        } else {
          navigate('/welcome')
        }
      }, 3000)
    }

    loadData()
  }, [isAuthenticated, token, navigate])

  return (
    <Container>
      <AppIcon src={appIcon} alt="App logo" />
      <AppName>Trash2Treasure</AppName>
      <USP>
        {USP_TEXT.split('').map((letter, index) => (
          <AnimatedLetter 
            key={index} 
            $visible={index < visibleLetters}
          >
            {letter}
          </AnimatedLetter>
        ))}
      </USP>

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

      <AppVersion>Versión 1.0.2 Stable</AppVersion>
      <Developer>Developed by Ismael Marot</Developer>
    </Container>
  )
}
