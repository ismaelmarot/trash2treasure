import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App'
import './styles.css'

// Inicializar Google Analytics
ReactGA.initialize('G-FHM9Y93V4D')

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)