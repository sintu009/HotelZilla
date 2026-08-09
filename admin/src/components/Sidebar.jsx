import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { LayoutDashboard, Users, Building2, CalendarClock, CreditCard, RotateCcw, Star, Tag, Ticket, Percent, ChartBar as BarChart3, FileText, Settings, LogOut, ChevronRight, Hotel, Hop as Home, Image, MapPin, DollarSign, CircleUser as UserCircle, UserCheck } from 'lucide-react'

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState({ users: true, hotels: true, reports: true, cms: true })

  const toggleGroup = (key) => setOpenGroups(p => ({ ...p, [key]: !p[key] }))

  const handleSignOut = async () => { await signOut(); navigate('/login') }

  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon"><Hotel size={20} color="#fff" /></span>
        StayFinder Admin
      </div>

      <nav className="sidebar-section">
        <NavLink to="/dashboard" className={linkClass}><LayoutDashboard size={16} /> Dashboard</NavLink>

        {/* Users */}
        <div className="sidebar-link sidebar-group" onClick={() => toggleGroup('users')}>
          <Users size={16} /> Users
          <ChevronRight size={14} className={`sidebar-chevron ${openGroups.users ? 'open' : ''}`} />
        </div>
        <div className={`sidebar-sub ${openGroups.users ? 'open' : ''}`}>
          <NavLink to="/users/customers" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><UserCircle size={14} /> Customers</NavLink>
          <NavLink to="/users/hotel-owners" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><UserCheck size={14} /> Hotel Owners</NavLink>
        </div>

        {/* Hotels */}
        <div className="sidebar-link sidebar-group" onClick={() => toggleGroup('hotels')}>
          <Building2 size={16} /> Hotels
          <ChevronRight size={14} className={`sidebar-chevron ${openGroups.hotels ? 'open' : ''}`} />
        </div>
        <div className={`sidebar-sub ${openGroups.hotels ? 'open' : ''}`}>
          <NavLink to="/hotels" end className={linkClass}><Hotel size={14} /> All Hotels</NavLink>
          <NavLink to="/hotels/pending" className={linkClass}><FileText size={14} /> Pending Approval</NavLink>
          <NavLink to="/hotels/approved" className={linkClass}><UserCheck size={14} /> Approved</NavLink>
          <NavLink to="/hotels/rejected" className={linkClass}><FileText size={14} /> Rejected</NavLink>
        </div>

        <NavLink to="/bookings" className={linkClass}><CalendarClock size={16} /> Bookings</NavLink>
        <NavLink to="/payments" className={linkClass}><CreditCard size={16} /> Payments</NavLink>
        <NavLink to="/refunds" className={linkClass}><RotateCcw size={16} /> Refunds</NavLink>
        <NavLink to="/reviews" className={linkClass}><Star size={16} /> Reviews</NavLink>
        <NavLink to="/offers" className={linkClass}><Tag size={16} /> Offers</NavLink>
        <NavLink to="/coupons" className={linkClass}><Ticket size={16} /> Coupons</NavLink>
        <NavLink to="/commissions" className={linkClass}><Percent size={16} /> Commissions</NavLink>

        {/* Reports */}
        <div className="sidebar-link sidebar-group" onClick={() => toggleGroup('reports')}>
          <BarChart3 size={16} /> Reports
          <ChevronRight size={14} className={`sidebar-chevron ${openGroups.reports ? 'open' : ''}`} />
        </div>
        <div className={`sidebar-sub ${openGroups.reports ? 'open' : ''}`}>
          <NavLink to="/reports/revenue" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><DollarSign size={14} /> Revenue</NavLink>
          <NavLink to="/reports/bookings" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><CalendarClock size={14} /> Bookings</NavLink>
          <NavLink to="/reports/hotels" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><Building2 size={14} /> Hotels</NavLink>
          <NavLink to="/reports/customers" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><Users size={14} /> Customers</NavLink>
        </div>

        {/* CMS */}
        <div className="sidebar-link sidebar-group" onClick={() => toggleGroup('cms')}>
          <FileText size={16} /> CMS
          <ChevronRight size={14} className={`sidebar-chevron ${openGroups.cms ? 'open' : ''}`} />
        </div>
        <div className={`sidebar-sub ${openGroups.cms ? 'open' : ''}`}>
          <NavLink to="/cms/homepage" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><Home size={14} /> Homepage</NavLink>
          <NavLink to="/cms/banners" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><Image size={14} /> Banners</NavLink>
          <NavLink to="/cms/destinations" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><MapPin size={14} /> Destinations</NavLink>
          <NavLink to="/cms/offers" className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}><Tag size={14} /> Offers</NavLink>
        </div>

        <NavLink to="/settings" className={linkClass}><Settings size={16} /> Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{(profile?.full_name || profile?.email || 'A')[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || 'Admin'}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{profile?.email}</div>
          </div>
          <button onClick={handleSignOut} style={{ color: '#94a3b8' }} title="Sign Out"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  )
}
