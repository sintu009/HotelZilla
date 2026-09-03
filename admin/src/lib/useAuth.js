import { useState } from 'react'

const KEY = 'admin_auth'

export function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
  })

  const login = (userData) => {
    localStorage.setItem(KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(KEY)
    setUser(null)
  }

  return { user, login, logout, isAuthenticated: !!user }
}
