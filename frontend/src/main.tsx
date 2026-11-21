import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './i18n' // Idiomas

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled rejection caught globally:', event.reason?.message || event.reason)
  event.preventDefault()
})

// Inicializar Sentry
import * as Sentry from '@sentry/react'
Sentry.init({
  dsn: 'https://94d8daaf09f58514337bedaee2b6ebfc@o4511101677600768.ingest.us.sentry.io/4511101683433472',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
})

// Inicializar Google Analytics
import ReactGA from 'react-ga4'
ReactGA.initialize('G-FHM9Y93V4D')

import { createClient } from '@/lib/supabase'
import { useAppStatus } from '@/hooks/useAppStatus'
import { MaintenanceScreen } from '@/components/MaintenanceScreen'

const supabase = createClient()
const { enabled, loading } = useAppStatus('trash2tre', supabase)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {loading ? (
      <div>Cargando estado...</div>
    ) : !enabled ? (
      <MaintenanceScreen slug="trash2tre" />
    ) : (
      <App />
    )}
  </React.StrictMode>
)