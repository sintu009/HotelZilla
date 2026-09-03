import { createContext, useContext } from 'react'
import useAuthStore from './useAuthStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const store = useAuthStore()
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
