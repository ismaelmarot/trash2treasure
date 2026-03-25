import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '@/hooks'
import { API_BASE_URL, CATEGORIES } from '@/constants'
import { savePendingItem, isOnline, fileToBase64 } from '@/services/offlineDB'
import { OfflineModal } from '@/components/OfflineModal'
import {
  CameraControls,
  CameraModal,
  CameraViewWrapper,
  CancelCapture,
  CaptureButton,
  CaptureInner,
  Card,
  Container,
  ContainerSubmitButton,
  CoordsText,
  DividerVertical,
  ErrorMessage,
  HiddenInput,
  IconText,
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
  RemoveImage,
  Select,
  SubmitButton,
  Subtitle,
  SuccessIcon,
  SuccessText,
  SuccessView,
  TextArea,
  Title,
  VideoFeed
} from './AddItemScreen.styles'

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export function AddItemScreen() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('otros')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  
  // Ubicación por defecto (Buenos Aires o similar)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -34.6037,
    lng: -58.3816
  })

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)


  const { token } = useAuth()
  const navigate = useNavigate()
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Verificar si todos los campos obligatorios están completos
  const isFormValid = title.trim() !== '' && 
                      description.trim() !== '' && 
                      image !== null && 
                      location && 
                      location.lat !== null && 
                      location.lng !== null

  // Obtener ubicación actual al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLoc)
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // Don't set error on mount to avoid being annoying, just log it
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }, [])

  // Prevenir zoom cuando la cámara está abierta
  useEffect(() => {
    if (isCameraOpen) {
      const preventZoom = (e: Event) => {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 1) {
          e.preventDefault()
        }
      }
      document.addEventListener('touchmove', preventZoom, { passive: false })
      
      return () => {
        document.removeEventListener('touchmove', preventZoom)
      }
    }
  }, [isCameraOpen])

  const centerOnMe = () => {
    if (navigator.geolocation) {
      setError('')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setLocation(newLoc);
        },
        (err) => {
          console.error(err);
          if (err.code === 1) {
            setError("Permiso denegado. Haz clic en el candado de la URL en Chrome y permite 'Ubicación'.")
          } else if (err.code === 2) {
            setError("macOS no devuelve tu ubicación. Ve a 'Ajustes del Sistema > Privacidad > Localización' y activa Chrome.")
          } else {
            setError("Error al obtener ubicación. Intenta mover el pin manualmente.")
          }
        },

        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file);
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("No se pudo acceder a la cámara. Revisa los permisos.")
      setIsCameraOpen(false);
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
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            setImage(file)
            setImagePreview(canvas.toDataURL('image/jpeg'))
            closeCamera()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  const handleGalleryClick = () => {
    galleryInputRef.current?.click()
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validaciones
    if (!title.trim()) {
      setError('El título es obligatorio')
      setLoading(false)
      return
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria')
      setLoading(false)
      return
    }

    if (!image) {
      setError('Debes seleccionar una foto del tesoro')
      setLoading(false)
      return
    }

    if (!location || !location.lat || !location.lng) {
      setError('La ubicación es obligatoria')
      setLoading(false)
      return
    }

    // Si no hay conexión, mostrar modal
    if (!isOnline()) {
      setLoading(false)
      setShowOfflineModal(true)
      return
    }

    // Conexión disponible, guardar en servidor
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
      setTimeout(() => {
        navigate('/app/activity')
      }, 2500)
    } catch (err: any) {
      setError('Error al guardar offline: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveToServer = async () => {
    setLoading(true)
    
    try {
      const itemResponse = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          description, 
          category,
          latitude: location.lat, 
          longitude: location.lng
        }),
      })

      const itemData = await itemResponse.json()
      if (!itemResponse.ok) throw new Error(itemData.error || 'Error al crear item')

      const itemId = itemData._id || itemData.id
      if (!itemId) throw new Error('Error: no se pudo obtener el ID del item')

      if (image) {
        const formData = new FormData()
        formData.append('image', image)

        const photoResponse = await fetch(`${API_BASE_URL}/items/${itemId}/photos`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        })

        if (!photoResponse.ok) throw new Error('Error al subir la imagen')
      }

      // Sumar puntos por reportar
      await fetch(`${API_BASE_URL}/points/add-report`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, itemId })
      }).catch(() => {})

      setSuccess(true)
      setTimeout(() => {
        navigate('/app/activity')
      }, 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function MapController({ center }: { center: { lat: number; lng: number } }) {
    const map = useMapEvents({})
    useEffect(() => {
      map.setView([center.lat, center.lng], 15)
    }, [center.lat, center.lng, map])
    return null
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    })

    return (
      <Marker 
        position={[location.lat, location.lng]} 
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setLocation(position);
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
            <Title>¡Tesoro Publicado!</Title>
            <Subtitle>Tu tesoro ya es visible para toda la comunidad.</Subtitle>
            <SuccessText>Redirigiendo a la Actividad...</SuccessText>
          </SuccessView>
        ) : (
          <>
            <Title>Publicar Tesoro</Title>
            <Subtitle>Dale una segunda vida a lo que ya no usas</Subtitle>

            <form onSubmit={handleSubmit}>

          <InputGroup>
            <Label required>Título</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Silla de madera vintage"
              required 
            />
          </InputGroup>

          <InputGroup>
            <Label required>Descripción</Label>
            <TextArea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe el estado y detalles..."
              rows={3}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Categoría</Label>
            <Select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.filter(cat => cat.id !== 'todos').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </Select>
          </InputGroup>
          <InputGroup>
            <Label required>Imagen del Tesoro</Label>
            <ImageContainer style={!imagePreview ? { border: '2px dashed #ccc' } : {}}>
              {imagePreview ? (
                <PreviewWrapper>
                  <PreviewImage src={imagePreview} alt="Preview" />
                  <RemoveImage onClick={() => { setImage(null); setImagePreview(null); }}>×</RemoveImage>
                </PreviewWrapper>
              ) : (
                <OptionsContainer>
                  <OptionButton type="button" onClick={handleCameraClick}>
                    <IconText>📸</IconText>
                    <span>Usar Cámara</span>
                  </OptionButton>
                  <DividerVertical />
                  <OptionButton type="button" onClick={handleGalleryClick}>
                    <IconText>📁</IconText>
                    <span>Subir Foto</span>
                  </OptionButton>
                </OptionsContainer>
              )}
            </ImageContainer>
            <HiddenInput 
              type='file'
              accept='image/*'
              capture='environment'
              ref={cameraInputRef}
              onChange={handleImageChange}
            />
            <HiddenInput 
              type='file'
              accept='image/*'
              ref={galleryInputRef}
              onChange={handleImageChange}
            />
          </InputGroup>

          <InputGroup>
            <Label required>Ubicación (Toca el mapa para mover el pin)</Label>
            <MapWrapper>
              <MapContainer 
                center={[location.lat, location.lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <MapController center={location} />
                <LocationMarker />
              </MapContainer>
              <LocateMeButton type='button' onClick={centerOnMe} title="Mi ubicación actual">
                🎯
              </LocateMeButton>
            </MapWrapper>


            <CoordsText>
              Lat: {location.lat.toFixed(5)} | Lng: {location.lng.toFixed(5)}
            </CoordsText>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ContainerSubmitButton>
            <SubmitButton type='submit' disabled={loading || !isFormValid}>
              {loading ? 'Publicando...' : 'Publicar Tesoro'}
            </SubmitButton>
          </ContainerSubmitButton>
            </form>
          </>
        )}
      </Card>

      {isCameraOpen && (

        <CameraModal>
          <CameraViewWrapper>
            <VideoFeed ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <CameraControls>
              <CancelCapture onClick={closeCamera}>Cancelar</CancelCapture>
              <CaptureButton onClick={capturePhoto}>
                <CaptureInner />
              </CaptureButton>
              <div style={{ width: '60px' }} /> {/* Spacer */}
            </CameraControls>
          </CameraViewWrapper>
        </CameraModal>
      )}

      <OfflineModal 
        isOpen={showOfflineModal}
        onConfirm={saveOffline}
        onCancel={() => setShowOfflineModal(false)}
      />
    </Container>
  )
}