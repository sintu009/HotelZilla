import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import useAuthStore from '../lib/useAuthStore'
import { authApi } from '../lib/api'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuthStore()

  const [form, setForm]         = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading]   = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  function set(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
      // clear field error on change
      if (fieldErrors[field]) setFieldErrors(fe => ({ ...fe, [field]: undefined }))
      setError('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const data = await authApi.login(form.email, form.password)
      login(data)  // { token, admin: { id, name, email } }
      navigate(from, { replace: true })
    } catch (err) {
      if (err.errors) {
        // Zod field-level errors from backend
        const fe = {}
        err.errors.forEach(({ field, message }) => { fe[field] = message })
        setFieldErrors(fe)
      } else if (err.status === 401) {
        setError('Invalid email or password. Please try again.')
      } else if (err.status === 429) {
        setError('Too many login attempts. Please wait a few minutes.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      {/* ── Left: Form ── */}
      <div className="auth-split-form">
        <div className="auth-split-inner">
          <div className="auth-split-logo">
            <Logo color="#0F172A" />
          </div>

          <h1 className="auth-split-title">Welcome Back</h1>
          <p className="auth-split-sub">Sign in to your admin account to continue.</p>

          {error && (
            <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                className={`input${fieldErrors.email ? ' input-error' : ''}`}
                type="email"
                placeholder="admin@hotelzilla.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                required
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <input
                  id="password"
                  className={`input${fieldErrors.password ? ' input-error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <div className="auth-row">
              <label className="auth-check-label">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={set('remember')}
                />
                Remember me
              </label>
            </div>

            <button
              className="btn btn-primary auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</>
                : 'Sign In'
              }
            </button>
          </form>

          <div className="auth-divider"><span>Or continue with</span></div>

          <div className="auth-social">
            <button className="auth-social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/></svg>
              Google
            </button>
            <button className="auth-social-btn" type="button">
              <svg width="16" height="18" viewBox="0 0 814 1000"><path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 133.2 2.6 198.3 99zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
              Apple
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Panel ── */}
      <div className="auth-split-panel">
        <div className="auth-panel-content">
          <h2 className="auth-panel-title">Effortlessly manage your team and operations.</h2>
          <p className="auth-panel-sub">Log in to access your admin dashboard and manage your platform.</p>
          <div className="auth-panel-mockup">
            <div className="auth-panel-mockup-placeholder">
              <div className="mock-bar" />
              <div className="mock-row">
                <div className="mock-card"><div className="mock-val">$189,374</div><div className="mock-lbl">Total Sales</div></div>
                <div className="mock-card"><div className="mock-val">1,284</div><div className="mock-lbl">Bookings</div></div>
                <div className="mock-card"><div className="mock-val">$25,684</div><div className="mock-lbl">Revenue</div></div>
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
