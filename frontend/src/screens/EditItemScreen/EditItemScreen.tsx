import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL, CATEGORIES } from '@/constants'
import { useAuth } from '@/hooks'
import { normalizeItem } from '@/utils/imageUtils'
import {
  BackButton,
  Card,
  Container,
  ErrorMessage,
  Input,
  InputGroup,
  Label,
  Loading,
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
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
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
      } catch (err) {
        console.error('Error fetching item:', err)
        setError('Error al cargar el tesoro')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!title.trim()) {
      setError('El título es obligatorio')
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
        body: JSON.stringify({ title, description, category })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al actualizar')

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

  if (loading) return <Loading>Cargando...</Loading>

  return (
    <Container>
      <Card>
        <BackButton onClick={() => navigate(-1)}>← Volver</BackButton>

        {success ? (
          <SuccessView>
            <SuccessIcon>✅</SuccessIcon>
            <Title>¡Tesoro Actualizado!</Title>
            <SuccessText>Redirigiendo a la Actividad...</SuccessText>
          </SuccessView>
        ) : (
          <>
            <Title>Editar Tesoro</Title>
            <Subtitle>Modifica los datos de tu publicación</Subtitle>

            <form onSubmit={handleSubmit}>
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
                >
                  {CATEGORIES.filter(cat => cat.id !== 'todos').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <SubmitButton type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </SubmitButton>
            </form>
          </>
        )}
      </Card>
    </Container>
  )
}
