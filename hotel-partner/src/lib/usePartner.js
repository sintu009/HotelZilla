// Reads hotel ID from ?hotel= query param, then VITE_PARTNER_ID env fallback
export function getPartnerId() {
  return new URLSearchParams(window.location.search).get('hotel')
    || import.meta.env.VITE_PARTNER_ID
    || null
}

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetchHotelConfig(partnerId) {
  const res = await fetch(`${BASE}/api/public/hotel-config/${partnerId}`)
  if (!res.ok) throw new Error('Failed to load hotel config')
  return res.json()
}

export async function fetchHotelRooms(hotelId) {
  const res = await fetch(`${BASE}/api/public/rooms/${hotelId}`)
  if (!res.ok) throw new Error('Failed to load rooms')
  return res.json()
}
