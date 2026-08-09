import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Hotel, User, LogOut } from 'lucide-react'
import { useState } from 'react'

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
            <span className="logo-icon"><Hotel size={20} /></span>
            StayFinder
          </Link>

          <nav className="nav-links">
            <Link to="/hotels" className="nav-link">Hotels</Link>
            <Link to="/offers" className="nav-link">Offers</Link>
            <Link to="/register-hotel" className="nav-link">List Your Hotel</Link>
            {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
          </nav>

          <div className="header-actions">
            {user ? (
              <div style={{ position: 'relative' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
                  <User size={16} /> {profile?.full_name || user.email?.split('@')[0]}
                </button>
                {menuOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', zIndex: 100, minWidth: 180, overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{profile?.full_name || 'User'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                      </div>
                      <Link to="/my-bookings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '0.85rem' }}>My Bookings</Link>
                      {profile?.role === 'hotel_owner' && <Link to="/register-hotel" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '0.85rem' }}>List Hotel</Link>}
                      <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--error)', textAlign: 'left' }}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
