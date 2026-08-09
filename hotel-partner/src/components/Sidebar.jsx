import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, CalendarClock, BedDouble,
  Star, Wallet, Settings, Hotel
} from 'lucide-react'
import { WHITE_LABEL } from '../lib/whiteLabel'
import { PARTNER } from '../lib/mockData'

export default function Sidebar() {
  const lc = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`
  const brand = WHITE_LABEL

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.brand_name} style={{ width: 36, height: 36, borderRadius: 'var(--radius)', objectFit: 'cover' }} />
        ) : (
          <span className="sidebar-brand-icon" style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>
            {brand.logo_text}
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span>{brand.brand_name}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'rgba(148,163,184,0.5)' }}>{brand.brand_tagline}</span>
        </div>
      </div>

      <nav className="sidebar-section">
        <div className="sidebar-section-label">Main</div>
        <NavLink to="/dashboard" className={lc} end><LayoutDashboard size={16} /> Dashboard</NavLink>
        <NavLink to="/dashboard/hotels" className={lc}><Building2 size={16} /> My Hotels</NavLink>
        <NavLink to="/dashboard/bookings" className={lc}><CalendarClock size={16} /> Bookings</NavLink>
        <NavLink to="/dashboard/rooms" className={lc}><BedDouble size={16} /> Rooms</NavLink>

        <div className="sidebar-section-label">Engagement</div>
        <NavLink to="/dashboard/reviews" className={lc}><Star size={16} /> Reviews</NavLink>
        <NavLink to="/dashboard/earnings" className={lc}><Wallet size={16} /> Earnings</NavLink>

        <div className="sidebar-section-label">Account</div>
        <NavLink to="/dashboard/settings" className={lc}><Settings size={16} /> Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">{brand.logo_text}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-user-name">{PARTNER.name}</div>
          <div className="sidebar-user-email">{PARTNER.email}</div>
        </div>
      </div>
    </aside>
  )
}
