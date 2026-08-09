import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Hotel } from 'lucide-react'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUp(email, password, fullName, role)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            <span style={{ width: 36, height: 36, background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hotel size={22} />
            </span>
            StayFinder
          </div>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join StayFinder to book your perfect stay</p>

        <div className="auth-role-toggle">
          <button className={`auth-role-btn ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>Customer</button>
          <button className={`auth-role-btn ${role === 'hotel_owner' ? 'active' : ''}`} onClick={() => setRole('hotel_owner')}>Hotel Owner</button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your name" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  )
}
