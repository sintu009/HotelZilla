import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, CalendarClock, BedDouble,
  Star, Wallet, Settings, Hotel
} from 'lucide-react'
import { PARTNER } from '../lib/mockData'

export default function Sidebar() {
  const lc = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon"><Hotel size={20} color="#fff" /></span>
        Partner Portal
      </div>

      <nav className="sidebar-section">
        <div className="sidebar-section-label">Main</div>
        <NavLink to="/dashboard" className={lc}><LayoutDashboard size={16} /> Dashboard</NavLink>
        <NavLink to="/hotels" className={lc}><Building2 size={16} /> My Hotels</NavLink>
        <NavLink to="/bookings" className={lc}><CalendarClock size={16} /> Bookings</NavLink>
        <NavLink to="/rooms" className={lc}><BedDouble size={16} /> Rooms</NavLink>

        <div className="sidebar-section-label">Engagement</div>
        <NavLink to="/reviews" className={lc}><Star size={16} /> Reviews</NavLink>
        <NavLink to="/earnings" className={lc}><Wallet size={16} /> Earnings</NavLink>

        <div className="sidebar-section-label">Account</div>
        <NavLink to="/settings" className={lc}><Settings size={16} /> Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">{PARTNER.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-user-name">{PARTNER.name}</div>
          <div className="sidebar-user-email">{PARTNER.email}</div>
        </div>
      </div>
    </aside>
  )
}
