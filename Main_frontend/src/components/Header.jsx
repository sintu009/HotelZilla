import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { LogOut, User } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="logo">
            <Logo width={130} color="#ffffff" />
          </Link>

          <nav className="nav-links">
            <Link to="/hotels" className="nav-link">Hotels</Link>
            <Link to="/offers" className="nav-link">Offers</Link>
            {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
          </nav>

          <div className="header-actions">
            {user ? (
              <div style={{ position: 'relative' }}>
                <button className="btn btn-ghost btn-sm header-user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <User size={15} /> {profile?.full_name || user.email?.split('@')[0]}
                </button>
                {menuOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: 200, overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'var(--heading)', fontSize: '14px', fontWeight: 600 }}>{profile?.full_name || 'User'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>{user.email}</div>
                      </div>
                      <Link to="/my-bookings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: 'var(--text)', transition: 'background 0.12s' }}>My Bookings</Link>
                      <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 16px', fontSize: '14px', color: 'var(--error-text)', textAlign: 'left' }}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm header-signin">Sign In</Link>
                <Link to="/signup" className="btn btn-sm" style={{ background: 'var(--sage)', color: '#fff', borderRadius: 'var(--radius)' }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
