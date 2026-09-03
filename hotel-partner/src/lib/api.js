const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getToken() {
  try {
    const stored = localStorage.getItem('partner_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed?.state?.token ?? parsed?.token ?? null
  } catch { return null }
}

async function request(method, path, body) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) { const err = new Error(data.message || 'Request failed'); err.status = res.status; throw err }
  return data
}

export const api = {
  get:   (path)       => request('GET',   path),
  post:  (path, body) => request('POST',  path, body),
  patch: (path, body) => request('PATCH', path, body),
  put:   (path, body) => request('PUT',   path, body),
  delete:(path)       => request('DELETE',path),
}

export const bookingsApi = {
  list:         (page = 1, limit = 50) => api.get(`/api/partner/bookings?page=${page}&limit=${limit}`),
  updateStatus: (id, status)           => api.patch(`/api/partner/bookings/${id}/status`, { status }),
}

export const hotelsApi = {
  list:       ()     => api.get('/api/partner/hotels'),
  getById:    (id)   => api.get(`/api/partner/hotels/${id}`),
  toggleOpen: (id)   => api.patch(`/api/partner/hotels/${id}/toggle-open`),
}
