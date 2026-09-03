const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getToken() {
  try {
    const stored = localStorage.getItem('user_auth')
    return stored ? JSON.parse(stored).token : null
  } catch {
    return null
  }
}

export async function request(method, path, body) {
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
    err.status = res.status
    err.errors = data.errors
    throw err
  }

  return data
}

const client = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  delete: (path)       => request('DELETE', path),
}

export default client
