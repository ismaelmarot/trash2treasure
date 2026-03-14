import { useAuthContext } from '../context/AuthContext'
export type { User } from '../context/AuthContext'

export function useAuth() {
  return useAuthContext()
}