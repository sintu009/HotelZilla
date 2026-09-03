const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getToken() {
  try {
    // Zustand persist stores under the key name directly
    const stored = localStorage.getItem('admin_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    // Zustand persist wraps state under { state: { token } }
    return parsed?.state?.token ?? parsed?.token ?? null
  } catch {
    return null
  }
}

async function request(method, path, body) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.code    = data.code
    err.status  = res.status
    err.errors  = data.errors // validation field errors
    throw err
  }

  return data
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
}

// Auth
export const authApi = {
  login:  (email, password) => api.post('/api/admin/auth/login', { email, password }),
  me:     ()                => api.get('/api/admin/auth/me'),
  logout: ()                => api.post('/api/admin/auth/logout'),
}

// Dashboard
export const dashboardApi = {
  stats:          () => api.get('/api/admin/dashboard/stats'),
  weeklyBookings: () => api.get('/api/admin/dashboard/weekly-bookings'),
}

// Upload image file → returns { url }
export async function uploadImage(file) {
  const token = getToken()
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${BASE}/api/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data.url
}

// Hotels
export const hotelsApi = {
  list:         (page = 1, limit = 20) => api.get(`/api/admin/hotels?page=${page}&limit=${limit}`),
  getById:      (id)                   => api.get(`/api/admin/hotels/${id}`),
  create:       (body)                 => api.post('/api/admin/hotels', body),
  update:       (id, body)             => api.patch(`/api/admin/hotels/${id}`, body),
  updateStatus: (id, status)           => api.patch(`/api/admin/hotels/${id}/status`, { status }),
  toggleOpen:   (id)                   => api.patch(`/api/admin/hotels/${id}/toggle-open`),
  deleteHotel:  (id)                   => api.delete(`/api/admin/hotels/${id}`),
  getRooms:     (id)                   => api.get(`/api/admin/hotels/${id}/rooms`),
  addRoom:      (id, body)             => api.post(`/api/admin/hotels/${id}/rooms`, body),
  updateRoom:   (roomId, body)         => api.put(`/api/admin/hotels/rooms/${roomId}`, body),
  deleteRoom:   (roomId)               => api.delete(`/api/admin/hotels/rooms/${roomId}`),
}

// Bookings
export const bookingsApi = {
  list:         (page = 1, limit = 20) => api.get(`/api/admin/bookings?page=${page}&limit=${limit}`),
  updateStatus: (id, status)           => api.patch(`/api/admin/bookings/${id}/status`, { status }),
}

// Customers
export const customersApi = {
  list:   (page = 1, limit = 20) => api.get(`/api/admin/customers?page=${page}&limit=${limit}`),
  toggle: (id)                   => api.patch(`/api/admin/customers/${id}/toggle`),
}

// Payments
export const paymentsApi = {
  list:   (page = 1, limit = 20) => api.get(`/api/admin/payments?page=${page}&limit=${limit}`),
  refund: (id)                   => api.post(`/api/admin/payments/${id}/refund`),
}

// Coupons
export const couponsApi = {
  list:   ()          => api.get('/api/admin/coupons'),
  create: (body)      => api.post('/api/admin/coupons', body),
  delete: (id)        => api.delete(`/api/admin/coupons/${id}`),
}

// Reviews
export const reviewsApi = {
  list:   (page = 1, limit = 20) => api.get(`/api/admin/reviews?page=${page}&limit=${limit}`),
  delete: (id)                   => api.delete(`/api/admin/reviews/${id}`),
}

// Hotel owners — uses customers endpoint filtered by role (hotel_owner)
// The admin-service returns users with role. We query customers endpoint
// and the backend already scopes by role='customer'. For owners we call
// a dedicated endpoint we'll add, or reuse customers with a role param.
export const ownersApi = {
  list:      (page = 1, limit = 20) => api.get(`/api/admin/customers?page=${page}&limit=${limit}&role=hotel_owner`),
  toggle:    (id)                   => api.patch(`/api/admin/customers/${id}/toggle`),
  getById:   (id)                   => api.get(`/api/admin/customers/owners/${id}`),
}
