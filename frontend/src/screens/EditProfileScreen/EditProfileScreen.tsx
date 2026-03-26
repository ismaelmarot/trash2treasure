import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL, COLORS } from '@/constants'
import { useAuth } from '@/hooks'
import { COUNTRIES, STATES } from '@/data/locationData'
import {
  Avatar,
  AvatarImage,
  AvatarSection,
  AvatarWrapper,
  BackButton,
  CameraButton,
  CameraControls,
  CameraModal,
  CancelButton,
  CaptureButton,
  CaptureInner,
  Card,
  Container,
  ErrorMessage,
  HiddenInput,
  Input,
  InputGroup,
  Label,
  Loading,
  Select,
  Subtitle,
  SubmitButton,
  SuccessMessage,
  Title,
  VideoFeed
} from './EditProfileScreen.styles'

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function EditProfileScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const { token, user, login } = useAuth()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        setName(data.name || '')
        setCountry(data.country || '')
        setState(data.state || '')
        setCity(data.city || '')
        setProfileImage(data.profile_image || null)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(t('editProfile.loadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, t])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError(t('editProfile.cameraError'))
      setIsCameraOpen(false)
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' })
            setNewImage(file)
            setNewImagePreview(canvas.toDataURL('image/jpeg'))
            closeCamera()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError(t('editProfile.nameRequired'))
      setSaving(false)
      return
    }

    try {
      if (name.trim() !== user?.name) {
        const checkResponse = await fetch(`${API_BASE_URL}/users/check-name/${encodeURIComponent(name.trim())}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const checkData = await checkResponse.json()
        if (checkData.exists) {
          setError(t('editProfile.nameTaken'))
          setSaving(false)
          return
        }
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: name.trim(),
          country: country.trim(),
          state: state.trim(),
          city: city.trim()
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || t('editProfile.updateError'))

      if (newImage) {
        const formData = new FormData()
        formData.append('image', newImage)

        const imageResponse = await fetch(`${API_BASE_URL}/users/profile/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })

        const imageData = await imageResponse.json()
        if (!imageResponse.ok) throw new Error(imageData.error || t('editProfile.imageError'))

        setProfileImage(imageData.profile_image)
        setNewImage(null)
        setNewImagePreview(null)

        const updatedUser = { 
          id: user!.id, 
          name: name.trim(), 
          email: user!.email, 
          profile_image: imageData.profile_image
        }
        login(token!, updatedUser)
      } else {
        const updatedUser = { 
          id: user!.id, 
          name: name.trim(), 
          email: user!.email, 
          profile_image: profileImage 
        }
        login(token!, updatedUser)
      }

      setSuccess(t('editProfile.success'))
      setTimeout(() => {
        navigate('/app/profile')
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading>{t('common.loading')}</Loading>

  const currentImage = newImagePreview || profileImage
  const avatarColor = getAvatarColor(name || 'U')

  return (
    <Container>
      <Card>
        <BackButton onClick={() => navigate(-1)}>{t('common.cancel')}</BackButton>

        <Title>{t('editProfile.title')}</Title>
        <Subtitle>{t('editProfile.subtitle')}</Subtitle>

        <form onSubmit={handleSubmit}>
          <AvatarSection>
            <AvatarWrapper>
              <Avatar $hasImage={!!currentImage} $bgColor={avatarColor}>
                {currentImage ? (
                  <AvatarImage src={currentImage} alt="Profile" />
                ) : (
                  (name || 'U').charAt(0).toUpperCase()
                )}
              </Avatar>
              <CameraButton type="button" onClick={() => cameraInputRef.current?.click()}>
                📷
              </CameraButton>
            </AvatarWrapper>

            <HiddenInput
              type="file"
              accept="image/*"
              ref={cameraInputRef}
              onChange={handleImageChange}
            />
            <HiddenInput
              type="file"
              accept="image/*"
              ref={galleryInputRef}
              onChange={handleImageChange}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: `1px solid ${COLORS.grey}`,
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                📁 {t('editProfile.gallery')}
              </button>
              <button
                type="button"
                onClick={handleCameraClick}
                style={{
                  background: 'none',
                  border: `1px solid ${COLORS.grey}`,
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                📸 {t('add.camera')}
              </button>
            </div>
          </AvatarSection>

          <InputGroup>
            <Label>{t('editProfile.username')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.namePlaceholder')}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>{t('editProfile.country')}</Label>
            <Select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
                setState('')
              }}
            >
              <option value="">{t('editProfile.selectCountry')}</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>{t('editProfile.state')}</Label>
            <Select
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={!country}
            >
              <option value="">{country ? t('editProfile.selectState') : t('editProfile.selectCountryFirst')}</option>
              {country && STATES[COUNTRIES.find(c => c.name === country)?.code || '']?.map(s => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>{t('editProfile.city')}</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t('editProfile.cityPlaceholder')}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <SubmitButton type="submit" disabled={saving}>
            {saving ? t('editProfile.saving') : t('editProfile.saveButton')}
          </SubmitButton>
        </form>
      </Card>

      {isCameraOpen && (
        <CameraModal>
          <VideoFeed ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <CameraControls>
            <CancelButton onClick={closeCamera}>{t('common.cancel')}</CancelButton>
            <CaptureButton onClick={capturePhoto}>
              <CaptureInner />
            </CaptureButton>
            <div style={{ width: '60px' }} />
          </CameraControls>
        </CameraModal>
      )}
    </Container>
  )
}
