import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

const USP_TEXT_ES = 'Redifiniendo el concepto de "desperdicio" en valor compartido.'
const USP_TEXT_EN = 'Redefining the concept of "waste" into shared value.'

export function SplashScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const { token, isAuthenticated } = useAuth()
  const [totalPoints, setTotalPoints] = useState(0)
  const [visibleLetters, setVisibleLetters] = useState(0)
  const animationComplete = useRef(false)

  const uspText = i18n.language === 'es' ? USP_TEXT_ES : USP_TEXT_EN;

  useEffect(() => {
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev >= uspText.length) {
          clearInterval(letterInterval)
          animationComplete.current = true
          return prev
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(letterInterval)
  }, [uspText])

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
      <AppName>{t('home.title')}</AppName>
      <USP>
        {uspText.split('').map((letter, index) => (
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
          🌿 <PointsValue>{totalPoints.toLocaleString()}</PointsValue> {t('profile.ecoPoints')}
        </EcoPointsBadge>
      )}

      <LoadingDots>
        <Dot $delay={0} />
        <Dot $delay={0.2} />
        <Dot $delay={0.4} />
      </LoadingDots>

      <AppVersion>{t('about.version')} 1.0.3 Stable</AppVersion>
      <Developer>{t('splash.developedBy')}</Developer>
    </Container>
  )
}
