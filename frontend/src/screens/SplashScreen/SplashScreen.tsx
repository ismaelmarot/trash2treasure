import { useEffect, useState, useRef } from 'react'
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
  const animationComplete = useRef(false)

  useEffect(() => {
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev >= USP_TEXT.length) {
          clearInterval(letterInterval)
          animationComplete.current = true
          return prev
        }
        return prev + 1
      })
    }, 50)

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

      // Esperar a que la animación termine + 1 segundo extra
      const checkAnimation = setInterval(() => {
        if (animationComplete.current) {
          clearInterval(checkAnimation)
          setTimeout(() => {
            if (isAuthenticated) {
              navigate('/app')
            } else {
              navigate('/welcome')
            }
          }, 1000)
        }
      }, 100)
    }

    loadData()
  }, [isAuthenticated, token, navigate])

  const skipSplash = () => {
    if (isAuthenticated) {
      navigate('/app')
    } else {
      navigate('/welcome')
    }
  }

  return (
    <Container onClick={skipSplash}>
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
          🌿 <PointsValue>{totalPoints.toLocaleString()}</PointsValue> Eco Points
        </EcoPointsBadge>
      )}

      <LoadingDots>
        <Dot $delay={0} />
        <Dot $delay={0.2} />
        <Dot $delay={0.4} />
      </LoadingDots>

      <AppVersion>Versión 1.0.3 Stable</AppVersion>
      <Developer>Developed by Ismael Marot</Developer>
    </Container>
  )
}
