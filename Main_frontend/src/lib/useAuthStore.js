import { create } from 'zustand'
import { authApi } from '../api'

const KEY = 'user_auth'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

const useAuthStore = create((set, get) => ({
  user: load().user || null,
  profile: load().profile || null,
  token: load().token || null,
  loading: true,

  init: async () => {
    const { token } = get()
    if (!token) { set({ loading: false }); return }
    try {
      const user = await authApi.me()
      set(s => ({ user: { ...s.user, ...user }, loading: false }))
    } catch {
      localStorage.removeItem(KEY)
      set({ user: null, profile: null, token: null, loading: false })
    }
  },

  signIn: async (email, password) => {
    set({ loading: true })
    try {
      const data = await authApi.login(email, password)
      const user = data.user
      const profile = { full_name: user.name, role: 'customer', phone: user.phone || '' }
      localStorage.setItem(KEY, JSON.stringify({ token: data.token, user, profile }))
      set({ user, profile, token: data.token, loading: false })
      return user
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  signUp: async (email, password, fullName, _role = 'customer') => {
    set({ loading: true })
    try {
      await authApi.signUp(email, password, fullName, 'customer')
      const data = await authApi.login(email, password)
      const user = data.user
      const profile = { full_name: user.name, role: 'customer', phone: user.phone || '' }
      localStorage.setItem(KEY, JSON.stringify({ token: data.token, user, profile }))
      set({ user, profile, token: data.token, loading: false })
      return user
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  signOut: async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem(KEY)
    set({ user: null, profile: null, token: null })
  },
}))

export default useAuthStore
