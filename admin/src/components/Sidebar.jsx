import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, CalendarClock, CreditCard, RotateCcw, Star, Tag, Ticket, Percent, ChartBar as BarChart3, FileText, Settings, ChevronRight, Hotel, Hop as Home, Image, MapPin, DollarSign, CircleUser as UserCircle, UserCheck } from 'lucide-react'

export default function Sidebar() {
  const [open, setOpen] = useState({ users: true, hotels: true, reports: false, cms: false })
  const toggle = (k) => setOpen(p => ({ ...p, [k]: !p[k] }))
  const lc = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`
  const slc = ({ isActive }) => `sidebar-link sidebar-sublink${isActive ? ' active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon"><Hotel size={20} color="#fff" /></span>
        StayFinder Admin
      </div>

      <nav className="sidebar-section">
        <NavLink to="/dashboard" className={lc}><LayoutDashboard size={16} /> Dashboard</NavLink>

        {/* Users */}
        <div className="sidebar-link sidebar-group" onClick={() => toggle('users')}>
          <Users size={16} /> Users
          <ChevronRight size={14} className={`sidebar-chevron${open.users ? ' open' : ''}`} />
        </div>
        <div className={`sidebar-sub${open.users ? ' open' : ''}`}>
          <NavLink to="/users/customers" className={slc}><UserCircle size={14} /> Customers</NavLink>
          <NavLink to="/users/hotel-owners" className={slc}><UserCheck size={14} /> Hotel Owners</NavLink>
        </div>

        {/* Hotels */}
        <div className="sidebar-link sidebar-group" onClick={() => toggle('hotels')}>
          <Building2 size={16} /> Hotels
          <ChevronRight size={14} className={`sidebar-chevron${open.hotels ? ' open' : ''}`} />
        </div>
        <div className={`sidebar-sub${open.hotels ? ' open' : ''}`}>
          <NavLink to="/hotels" end className={lc}><Hotel size={14} /> All Hotels</NavLink>
          <NavLink to="/hotels/pending" className={lc}><FileText size={14} /> Pending Approval</NavLink>
          <NavLink to="/hotels/approved" className={lc}><UserCheck size={14} /> Approved</NavLink>
          <NavLink to="/hotels/rejected" className={lc}><FileText size={14} /> Rejected</NavLink>
        </div>

        <NavLink to="/bookings" className={lc}><CalendarClock size={16} /> Bookings</NavLink>
        <NavLink to="/payments" className={lc}><CreditCard size={16} /> Payments</NavLink>
        <NavLink to="/refunds" className={lc}><RotateCcw size={16} /> Refunds</NavLink>
        <NavLink to="/reviews" className={lc}><Star size={16} /> Reviews</NavLink>
        <NavLink to="/offers" className={lc}><Tag size={16} /> Offers</NavLink>
        <NavLink to="/coupons" className={lc}><Ticket size={16} /> Coupons</NavLink>
        <NavLink to="/commissions" className={lc}><Percent size={16} /> Commissions</NavLink>

        {/* Reports */}
        <div className="sidebar-link sidebar-group" onClick={() => toggle('reports')}>
          <BarChart3 size={16} /> Reports
          <ChevronRight size={14} className={`sidebar-chevron${open.reports ? ' open' : ''}`} />
        </div>
        <div className={`sidebar-sub${open.reports ? ' open' : ''}`}>
          <NavLink to="/reports/revenue" className={slc}><DollarSign size={14} /> Revenue</NavLink>
          <NavLink to="/reports/bookings" className={slc}><CalendarClock size={14} /> Bookings</NavLink>
          <NavLink to="/reports/hotels" className={slc}><Building2 size={14} /> Hotels</NavLink>
          <NavLink to="/reports/customers" className={slc}><Users size={14} /> Customers</NavLink>
        </div>

        {/* CMS */}
        <div className="sidebar-link sidebar-group" onClick={() => toggle('cms')}>
          <FileText size={16} /> CMS
          <ChevronRight size={14} className={`sidebar-chevron${open.cms ? ' open' : ''}`} />
        </div>
        <div className={`sidebar-sub${open.cms ? ' open' : ''}`}>
          <NavLink to="/cms/homepage" className={slc}><Home size={14} /> Homepage</NavLink>
          <NavLink to="/cms/banners" className={slc}><Image size={14} /> Banners</NavLink>
          <NavLink to="/cms/destinations" className={slc}><MapPin size={14} /> Destinations</NavLink>
          <NavLink to="/cms/offers" className={slc}><Tag size={14} /> Offers</NavLink>
        </div>

        <NavLink to="/settings" className={lc}><Settings size={16} /> Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Admin</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>admin@stayfinder.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
