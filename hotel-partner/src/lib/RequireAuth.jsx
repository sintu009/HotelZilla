import { Navigate } from 'react-router-dom'

export function getPartnerToken() {
  try {
    const stored = localStorage.getItem('partner_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed?.token ?? null
  } catch { return null }
}

export default function RequireAuth({ children }) {
  const token = getPartnerToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}
