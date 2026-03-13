import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../hooks/useAuth';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function AddItemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('muebles');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  
  // Ubicación por defecto (Buenos Aires o similar)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -34.6037,
    lng: -58.3816
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);


  const { token } = useAuth();
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);


  // Obtener ubicación actual al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLoc);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // Don't set error on mount to avoid being annoying, just log it
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  const centerOnMe = () => {
    if (navigator.geolocation) {
      setError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLoc);
        },
        (err) => {
          console.error(err);
          if (err.code === 1) {
            setError("Permiso denegado. Haz clic en el candado de la URL en Chrome y permite 'Ubicación'.");
          } else if (err.code === 2) {
            setError("macOS no devuelve tu ubicación. Ve a 'Ajustes del Sistema > Privacidad > Localización' y activa Chrome.");
          } else {
            setError("Error al obtener ubicación. Intenta mover el pin manualmente.");
          }
        },

        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };




  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Revisa los permisos.");
      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImage(file);
            setImagePreview(canvas.toDataURL('image/jpeg'));
            closeCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };


  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      });

      const itemData = await itemResponse.json();
      if (!itemResponse.ok) throw new Error(itemData.error || 'Error al crear item');

      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const photoResponse = await fetch(`${API_BASE_URL}/items/${itemData.id}/photos`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        if (!photoResponse.ok) throw new Error('Error al subir la imagen');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/activity');
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function MapController({ center }: { center: { lat: number; lng: number } }) {
    const map = useMapEvents({});
    useEffect(() => {
      map.setView([center.lat, center.lng], 15);
    }, [center.lat, center.lng, map]);
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });

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
    );
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

            <Form onSubmit={handleSubmit}>

          <InputGroup>
            <Label>Título</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Silla de madera vintage"
              required 
            />
          </InputGroup>

          <InputGroup>
            <Label>Descripción</Label>
            <TextArea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe el estado y detalles..."
              rows={3}
            />
          </InputGroup>

          <InputGroup>
            <Label>Categoría</Label>
                <Select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="carton">Cardboard</option>
                  <option value="botellas">Bottles</option>
                  <option value="metal">Metal</option>
                  <option value="mixto">Mixed</option>
                  <option value="otros">Others</option>
                </Select>

          </InputGroup>

          <InputGroup>
            <Label>Imagen del Tesoro</Label>
            <ImageContainer>
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
                    <span>Subir Galería</span>
                  </OptionButton>
                </OptionsContainer>
              )}
            </ImageContainer>
            <HiddenInput 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={cameraInputRef}
              onChange={handleImageChange}
            />
            <HiddenInput 
              type="file" 
              accept="image/*" 
              ref={galleryInputRef}
              onChange={handleImageChange}
            />
          </InputGroup>


          <InputGroup>
            <Label>Ubicación (Toca el mapa para mover el pin)</Label>
            <MapWrapper>
              <MapContainer 
                center={[location.lat, location.lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={location} />
                <LocationMarker />
              </MapContainer>
              <LocateMeButton type="button" onClick={centerOnMe} title="Mi ubicación actual">
                🎯
              </LocateMeButton>
            </MapWrapper>


            <CoordsText>
              Lat: {location.lat.toFixed(5)} | Lng: {location.lng.toFixed(5)}
            </CoordsText>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Tesoro'}
          </SubmitButton>
        </Form>
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
    </Container>

  );
}

const Container = styled.div`
  padding: 20px;
  background: #f5f5f7;
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: 28px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1d1d1f;
`;

const Subtitle = styled.p`
  color: #86868b;
  margin-bottom: 32px;
  font-size: 15px;
`;

const SuccessView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  @keyframes pop {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }
`;

const SuccessText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #0071e3;
  font-weight: 500;
`;

const Form = styled.form`

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  padding-left: 4px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d2d2d7;
  font-size: 16px;
  background: #fbfbfd;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #0071e3;
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d2d2d7;
  font-size: 16px;
  background: #fbfbfd;
  resize: none;
  
  &:focus {
    border-color: #0071e3;
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d2d2d7;
  font-size: 16px;
  background: #fbfbfd;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 18px;
  border: 1px solid #d2d2d7;
  background: #f5f5f7;
  overflow: hidden;
  position: relative;
`;

const OptionsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const OptionButton = styled.button`
  flex: 1;
  height: 100%;
  border: none;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  color: #86868b;
  font-size: 14px;
  font-family: inherit;
  transition: background 0.2s ease;
  
  &:hover {
    background: #ebebed;
    color: #0071e3;
  }
`;

const IconText = styled.span`
  font-size: 32px;
`;

const DividerVertical = styled.div`
  width: 1px;
  height: 60%;
  background: #d2d2d7;
`;

const PreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ajuste completo al contenedor */
  display: block;
`;


const RemoveImage = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #d2d2d7;
  position: relative;
  z-index: 1;
`;

const LocateMeButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  border: 1px solid #d2d2d7;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f7;
  }
`;


const CoordsText = styled.p`
  font-size: 11px;
  color: #86868b;
  text-align: right;
  margin-top: 4px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 14px;
  background: #fff2f1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 59, 48, 0.2);
`;

const SubmitButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0077ed;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #d2d2d7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CameraModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CameraViewWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const VideoFeed = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CameraControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
`;

const CaptureButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid white;
  background: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    transform: scale(0.92);
  }
`;

const CaptureInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: white;
`;

const CancelCapture = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;