import { Link, useNavigate } from 'react-router-dom'
import { WHITE_LABEL } from '../lib/whiteLabel'
import { Hotel, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PublicHeader() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const brand = WHITE_LABEL

  return (
    <header className="public-header">
      <div className="public-container">
        <Link to="/" className="public-logo">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.brand_name} style={{ height: 36, borderRadius: 6 }} />
          ) : (
            <>
              <span className="public-logo-icon">{brand.logo_text || brand.brand_name?.[0] || 'H'}</span>
              <span className="public-logo-text">
                {brand.brand_name}
                <small>{brand.brand_tagline}</small>
              </span>
            </>
          )}
        </Link>

        <nav className={`public-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/hotels" onClick={() => setMenuOpen(false)}>Hotels</Link>
          <Link to="/hotels" onClick={() => setMenuOpen(false)}>Offers</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Partner Dashboard</Link>
        </nav>

        <div className="public-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/hotels')}>Book Now</button>
          <button className="public-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
