import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { WHITE_LABEL } from '../lib/whiteLabel'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/hotels': 'My Hotels',
  '/dashboard/bookings': 'Bookings',
  '/dashboard/rooms': 'Rooms & Inventory',
  '/dashboard/reviews': 'Reviews',
  '/dashboard/earnings': 'Earnings & Payouts',
  '/dashboard/settings': 'Settings',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Partner Portal'

  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <span className="topbar-badge">{WHITE_LABEL.brand_name}</span>
        <button className="btn btn-ghost btn-sm" style={{ position: 'relative' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: 2, right: 4, width: 8, height: 8, background: 'var(--error)', borderRadius: '50%' }} />
        </button>
      </div>
    </div>
  )
}
