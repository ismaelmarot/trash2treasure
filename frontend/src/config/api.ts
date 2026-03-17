// src/config/api.ts

// URL base de la API
// Si existe una variable de entorno la usa.
// Si no, usa localhost por defecto.

export const API_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Helper para construir endpoints
export const api = (endpoint: string): string => {
  return `${API_URL}${endpoint}`
}