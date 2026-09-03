import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from './api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,

      init: async () => {
        const { token } = get()
        if (!token) { set({ loading: false }); return }
        try {
          const admin = await authApi.me()
          set(s => ({ user: { ...s.user, ...admin }, loading: false }))
        } catch {
          set({ user: null, token: null, loading: false })
        }
      },

      login: (data) => set({ user: data.admin, token: data.token }),

      logout: async () => {
        try { await authApi.logout() } catch { /* ignore */ }
        set({ user: null, token: null })
      },
    }),
    { name: 'admin_auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
)

export default useAuthStore