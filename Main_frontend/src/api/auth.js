import client from './client'

const authApi = {
  login:   (email, password)              => client.post('/api/auth/login', { email, password }),
  signUp:  (email, password, name)        => client.post('/api/auth/register', { email, password, name }),
  me:      ()                             => client.get('/api/auth/me'),
  logout:  ()                             => Promise.resolve(),
}

export default authApi
