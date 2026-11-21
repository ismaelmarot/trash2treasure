import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type MaintenanceScreenProps = {
  slug: string
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ slug }) => {
  const supabase = createClient()
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('enabled')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching app status:', error)
        setEnabled(null)
      } else {
        setEnabled(data?.enabled ?? null)
      }
      setLoading(false)
    }

    fetchStatus()
  }, [supabase, slug])

  if (loading) {
    return <div>Cargando estado...</div>
  }

  if (!enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16a1 1 0 0 1-1-1v-7a1 1 0 0 1 2 0v7a1 1 0 0 1-1 1zm.082-6.93a1.5 1.5 0 0 0 0 2.12l5.25 2.11a1.5 1.5 0 0 0 1.139-1.617-1.5 1.5 0 0 0-1.658-1.088L10.082 2.12a1.5 1.5 0 0 0-1.658-.088-1.5 1.5 0 0 0-1.14.088l5.25 2.11zM7.5 11.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Estamos realizando tareas de mantenimiento</h2>
          <p className="text-gray-600 mb-6">Por favor, inténtalo de nuevo más tarde.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-green-600 text-white rounded">Actualizar página</button>
        </div>
      </div>
    )
  }

  return null
}