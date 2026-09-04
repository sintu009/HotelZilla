import { createContext, useContext, useEffect } from 'react'
import useAuthStore from './useAuthStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const store = useAuthStore()

  useEffect(() => {
    store.init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
