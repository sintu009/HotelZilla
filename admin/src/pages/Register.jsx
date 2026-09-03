import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setLoading(true)
    // TODO: replace with real auth
    await new Promise(r => setTimeout(r, 800))
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="auth-split">
      {/* Left panel */}
      <div className="auth-split-form">
        <div className="auth-split-inner">
          <div className="auth-split-logo">
            <Logo color="#0F172A" />
          </div>
          <h1 className="auth-split-title">Create Account</h1>
          <p className="auth-split-sub">Fill in the details below to set up your admin account.</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="admin@hotezilla.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="input-icon-wrap">
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Confirm Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                required
              />
            </div>

            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>Or Register With</span></div>

          <div className="auth-social">
            <button className="auth-social-btn">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/></svg>
              Google
            </button>
            <button className="auth-social-btn">
              <svg width="16" height="18" viewBox="0 0 814 1000"><path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 133.2 2.6 198.3 99zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
              Apple
            </button>
          </div>

          <p className="auth-footer-text">
            Already Have An Account?{' '}
            <Link to="/login" className="auth-link">Log In.</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-split-panel">
        <div className="auth-panel-content">
          <h2 className="auth-panel-title">Effortlessly manage your team and operations.</h2>
          <p className="auth-panel-sub">Create your account to access the admin dashboard and manage your platform.</p>
          <div className="auth-panel-mockup">
            <div className="auth-panel-mockup-placeholder">
              <div className="mock-bar" />
              <div className="mock-row">
                <div className="mock-card"><div className="mock-val">$189,374</div><div className="mock-lbl">Total Sales</div></div>
                <div className="mock-card"><div className="mock-val">00:01:30</div><div className="mock-lbl">Chat Performance</div></div>
                <div className="mock-card"><div className="mock-val">$25,684</div><div className="mock-lbl">Total Profit</div></div>
              </div>
              <div className="mock-table">
                {[1,2,3,4].map(i => <div key={i} className="mock-table-row" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
