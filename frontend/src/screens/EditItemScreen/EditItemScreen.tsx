import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function MapClickHandler({ setLocation }: { setLocation: (loc: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e: any) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })
  return null
}
import { API_BASE_URL, CATEGORIES } from '@/constants'
import { useAuth } from '@/hooks'
import { normalizeItem } from '@/utils/imageUtils'
import {
  BackButton,
  Card,
  Container,
  CoordsText,
  ErrorMessage,
  Input,
  InputGroup,
  Label,
  Loading,
  MapWrapper,
  Select,
  Subtitle,
  SubmitButton,
  SuccessIcon,
  SuccessText,
  SuccessView,
  TextArea,
  Title
} from './EditItemScreen.styles'

export function EditItemScreen() {
  const { t } = useTranslation();
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState({ lat: -34.6037, lng: -58.3816 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`)
        const data = await response.json()
        const item = normalizeItem(data)

        setTitle(item.title || '')
        setDescription(item.description || '')
        setCategory(item.category || '')
        if (item.latitude && item.longitude) {
          setLocation({ lat: item.latitude, lng: item.longitude })
        }
      } catch (err) {
        console.error('Error fetching item:', err)
        setError(t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!title.trim()) {
      setError(t('editItem.titleRequired'))
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, category, latitude: location.lat, longitude: location.lng })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || t('editItem.error'))

      setSuccess(true)
      setTimeout(() => {
        navigate('/app/activity')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading>{t('common.loading')}</Loading>

  return (
    <Container>
      <Card>
        <BackButton onClick={() => navigate(-1)}>← {t('common.back')}</BackButton>

        {success ? (
          <SuccessView>
            <SuccessIcon>✅</SuccessIcon>
            <Title>{t('editItem.success')}</Title>
            <SuccessText>{t('editItem.redirecting')}</SuccessText>
          </SuccessView>
        ) : (
          <>
            <Title>{t('editItem.title')}</Title>
            <Subtitle>{t('editItem.subtitle')}</Subtitle>

            <form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>{t('add.titleLabel')}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('add.titlePlaceholder')}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>{t('add.descriptionLabel')}</Label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('add.descriptionPlaceholder')}
                  rows={3}
                />
              </InputGroup>

              <InputGroup>
                <Label>{t('add.category')}</Label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter(cat => cat.id !== 'todos').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>{t('editItem.locationHint')}</Label>
                <MapWrapper>
                  <MapContainer 
                    center={[location.lat, location.lng]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <Marker
                      position={[location.lat, location.lng]}
                      icon={L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                      })}
                    />
                    <MapClickHandler setLocation={setLocation} />
                  </MapContainer>
                </MapWrapper>
                <CoordsText>
                  Lat: {location.lat.toFixed(5)} | Lng: {location.lng.toFixed(5)}
                </CoordsText>
              </InputGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <SubmitButton type="submit" disabled={saving}>
                {saving ? t('common.save') + '...' : t('common.save')}
              </SubmitButton>
            </form>
          </>
        )}
      </Card>
    </Container>
  )
}
