import { useState, useEffect } from 'react'

export interface UseAppStatusReturn {
  enabled: boolean | null
  loading: boolean
  error: Error | null
}

export const useAppStatus = (slug: string, supabase: any): UseAppStatusReturn => {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error: supaError } = await supabase
          .from('applications')
          .select('enabled')
          .eq('slug', slug)
          .single()

        if (supaError) {
          setError(supaError)
          setEnabled(null)
          setLoading(false)
          return
        }

        setEnabled(data?.enabled ?? null)
      } catch (err) {
        console.error('Error fetching app status:', err)
        setError(err instanceof Error ? err : new Error(String(err)))
        setEnabled(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [supabase, slug])

  return { enabled, loading, error }
}