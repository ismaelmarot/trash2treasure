import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useAuth } from '@/hooks'
import { API_BASE_URL, CATEGORIES } from '@/constants'
import { savePendingItem, isOnline, fileToBase64 } from '@/services/offlineDB'
import { OfflineModal } from '@/components/OfflineModal'
import { CameraCapture } from '@/components/CameraCapture/CameraCapture'

import {
  Card,
  Container,
  CoordsText,
  DividerVertical,
  ErrorMessage,
  HiddenInput,
  ImageContainer,
  Input,
  InputGroup,
  Label,
  LocateMeButton,
  MapWrapper,
  OptionButton,
  OptionsContainer,
  PreviewImage,
  PreviewWrapper,
  PublishButton,
  CancelButton,
  ButtonContainer,
  RemoveImage,
  Subtitle,
  SuccessIcon,
  SuccessText,
  SuccessView,
  TextArea,
  Title,
  Header,
  CloseButton,
  CategorySelect,
} from './AddItemScreen.styles'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export function AddItemScreen() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('todos')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const [location, setLocation] = useState({
    lat: -34.6037,
    lng: -58.3816
  })

  const mapRef = useRef<LeafletMap | null>(null)

  const { token } = useAuth()
  const navigate = useNavigate()
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const isFormValid =
    title.trim() !== '' &&
    description.trim() !== '' &&
    image !== null &&
    category !== 'todos'

  const getIPLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      if (data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude }
      }
    } catch {}
    return { lat: -34.6037, lng: -58.3816 }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        async () => {
          const ipLoc = await getIPLocation()
          setLocation(ipLoc)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      getIPLocation().then(setLocation)
    }
  }, [])

  useEffect(() => {
    if (!isCameraOpen && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 300)
    }
  }, [isCameraOpen])

  const centerOnMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        async () => {
          const ipLoc = await getIPLocation()
          setLocation(ipLoc)
        }
      )
    } else {
      getIPLocation().then(setLocation)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    setLoading(true)
    setError('')

    if (!isOnline()) {
      setLoading(false)
      setShowOfflineModal(true)
      return
    }

    await saveToServer()
  }

  const saveOffline = async () => {
    setShowOfflineModal(false)
    setLoading(true)

    try {
      const imageBase64 = await fileToBase64(image!)
      await savePendingItem({
        title,
        description,
        category,
        latitude: location.lat,
        longitude: location.lng,
        imageBase64
      })

      setSuccess(true)
      setTimeout(() => navigate('/app/activity'), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveToServer = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          latitude: location.lat,
          longitude: location.lng
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (image) {
        const formData = new FormData()
        formData.append('image', image)

        await fetch(`${API_BASE_URL}/items/${data.id}/photos`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
      }

      setSuccess(true)
      setTimeout(() => navigate('/app/activity'), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function MapController({ center }: { center: { lat: number; lng: number } }) {
    const map = useMapEvents({})

    useEffect(() => {
      map.setView([center.lat, center.lng], map.getZoom())
    }, [center, map])

    return null
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng)
      }
    })

    return (
      <Marker
        position={[location.lat, location.lng]}
        draggable
        eventHandlers={{
          dragend: (e) => {
            setLocation(e.target.getLatLng())
          }
        }}
      />
    )
  }

  return (
    <Container>
      <Card>
        {success ? (
          <SuccessView>
            <SuccessIcon>🎉</SuccessIcon>
            <Title>{t('add.success')}</Title>
            <SuccessText>{t('add.redirecting')}</SuccessText>
          </SuccessView>
        ) : (
          <form onSubmit={handleSubmit}>
            <Header>
              <Title>{t('add.title')}</Title>
              <CloseButton onClick={() => navigate('/app/activity')}>×</CloseButton>
            </Header>
            <Subtitle>{t('add.subtitle')}</Subtitle>

            <InputGroup>
              <Label required>{t('add.titleLabel')}</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
            </InputGroup>

            <InputGroup>
              <Label required>{t('add.category')}</Label>
              <CategorySelect
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.filter(c => c.id !== 'todos').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </CategorySelect>
            </InputGroup>

            <InputGroup>
              <Label required>{t('add.descriptionLabel')}</Label>
              <TextArea value={description} onChange={e => setDescription(e.target.value)} />
            </InputGroup>

            <InputGroup>
              <Label>{t('add.imageLabel')}</Label>

              <ImageContainer>
                {imagePreview ? (
                  <PreviewWrapper>
                    <PreviewImage src={imagePreview} />
                    <RemoveImage onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}>×</RemoveImage>
                  </PreviewWrapper>
                ) : (
                  <OptionsContainer>
                    <OptionButton onClick={() => setIsCameraOpen(true)}>
                      📸 {t('add.camera')}
                    </OptionButton>

                    <DividerVertical />

                    <OptionButton onClick={() => galleryInputRef.current?.click()}>
                      📁 {t('add.gallery')}
                    </OptionButton>
                  </OptionsContainer>
                )}
              </ImageContainer>

              <HiddenInput
                type="file"
                ref={galleryInputRef}
                onChange={handleImageChange}
              />
            </InputGroup>

            <InputGroup>
              <Label>{t('add.locationLabel')}</Label>

              <MapWrapper>
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <MapController center={location} />

                  <LocationMarker />
                </MapContainer>

                <LocateMeButton onClick={centerOnMe}>
                  🎯
                </LocateMeButton>
              </MapWrapper>

              <CoordsText>
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </CoordsText>
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonContainer>
              <PublishButton disabled={!isFormValid || loading}>
                {loading ? t('add.publishing') : t('add.publish')}
              </PublishButton>

              <CancelButton onClick={() => navigate('/app/activity')}>
                {t('common.cancel')}
              </CancelButton>
            </ButtonContainer>

          </form>
        )}
      </Card>

      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file, preview) => {
          setImage(file)
          setImagePreview(preview)
          setIsCameraOpen(false)
        }}
      />

      <OfflineModal
        isOpen={showOfflineModal}
        onConfirm={saveOffline}
        onCancel={() => setShowOfflineModal(false)}
      />
    </Container>
  )
}
