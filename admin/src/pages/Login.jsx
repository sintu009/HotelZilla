import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Hotel } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, fetchProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await signIn(email, password)
      const prof = await fetchProfile(user.id)
      if (prof && prof.role !== 'admin') {
        setError('Access denied. Admin account required.')
        return
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            <span style={{ width: 36, height: 36, background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hotel size={22} />
            </span>
            StayFinder Admin
          </div>
        </div>
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Sign in to the admin dashboard</p>
        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@stayfinder.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
