import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  const signIn = async (email) => {
    const mockUser = { id: 'mock-user-1', email }
    const mockProfile = { full_name: 'Demo User', role: 'customer', phone: '' }
    setUser(mockUser)
    setProfile(mockProfile)
    return mockUser
  }

  const signUp = async (email, _password, fullName, role = 'customer') => {
    const mockUser = { id: 'mock-user-1', email }
    setUser(mockUser)
    setProfile({ full_name: fullName, role, phone: '' })
    return mockUser
  }

  const signOut = () => { setUser(null); setProfile(null) }

  return (
    <AuthContext.Provider value={{ user, profile, loading: false, signIn, signUp, signOut, fetchProfile: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
