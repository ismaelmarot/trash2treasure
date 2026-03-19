import { useState } from 'react'
import { API_BASE_URL } from '@/constants'
import type { NavigateFunction } from 'react-router-dom'

export function useRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const isPasswordValid = Object.values(validations).every(Boolean)

  const handleSubmit = async (e: React.FormEvent, navigate: NavigateFunction) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        navigate('/verify', { state: { email, password } })
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Connection error')
    }
  }

  return { 
    name, 
    setName, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    confirmPassword, 
    setConfirmPassword,
    showPassword, 
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    error, 
    validations, 
    handleSubmit 
  }
}