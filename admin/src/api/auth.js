import client from './client'

const authApi = {
  login:  (email, password) => client.post('/api/admin/auth/login', { email, password }),
  me:     ()                => client.get('/api/admin/auth/me'),
  logout: ()                => client.post('/api/admin/auth/logout'),
}

export default authApi
