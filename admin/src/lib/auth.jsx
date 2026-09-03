import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from './api'

const KEY = 'admin_auth'
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // On mount — verify stored token is still valid
  useEffect(() => {
    if (!auth?.token) { setLoading(false); return }
    authApi.me()
      .then(admin => setAuth(prev => ({ ...prev, admin })))
      .catch(() => { localStorage.removeItem(KEY); setAuth(null) })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = (data) => {
    // data = { token, admin: { id, name, email } }
    localStorage.setItem(KEY, JSON.stringify(data))
    setAuth(data)
  }

  const logout = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem(KEY)
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{
      user: auth?.admin ?? null,
      token: auth?.token ?? null,
      isAuthenticated: !!auth?.token,
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
