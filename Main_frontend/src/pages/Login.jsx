import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../lib/useAuthStore'
import { Hotel } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--heading)', fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>
            <span style={{ width: 36, height: 36, background: 'var(--sage)', color: '#fff', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hotel size={20} />
            </span>
            HotelZilla
          </div>
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to manage your bookings</p>
        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  )
}
