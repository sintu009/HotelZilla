import { useState } from 'react'
import { X, Hotel } from 'lucide-react'
import useAuthStore from '../lib/useAuthStore'

export default function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp, loading } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (tab === 'login') {
        await signIn(email, password)
      } else {
        if (!name.trim()) { setError('Full name is required'); return }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return }
        await signUp(email, password, name)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal" style={{ maxWidth: 420, width: '90%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 28, height: 28, background: 'var(--sage)', color: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hotel size={16} />
            </span>
            <strong>Sign in to continue</strong>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="auth-role-toggle" style={{ marginBottom: 20 }}>
            <button className={`auth-role-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError('') }}>Sign In</button>
            <button className={`auth-role-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setError('') }}>Register</button>
          </div>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tab === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? <span className="spinner" /> : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
