import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, CalendarClock, CreditCard, RotateCcw, Star, Tag, Ticket, Percent, ChartBar as BarChart2, FileText, Settings, ChevronDown, Hop as Home, Image, MapPin, DollarSign, CircleUser as UserCircle, UserCheck, Palette } from 'lucide-react'
import Logo from './Logo'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Management' },
  {
    key: 'users', icon: Users, label: 'Users',
    children: [
      { to: '/users/customers',    icon: UserCircle, label: 'Customers' },
      { to: '/users/hotel-owners', icon: UserCheck,  label: 'Hotel Owners' },
    ],
  },
  { to: '/hotels', icon: Building2, label: 'Hotels' },
  { to: '/bookings',    icon: CalendarClock, label: 'Bookings' },
  { to: '/reviews',     icon: Star,          label: 'Reviews' },
  { section: 'Finance' },
  { to: '/payments',    icon: CreditCard,    label: 'Payments' },
  { to: '/refunds',     icon: RotateCcw,     label: 'Refunds' },
  { to: '/commissions', icon: Percent,       label: 'Commissions' },
  { section: 'Marketing' },
  { to: '/offers',      icon: Tag,           label: 'Offers' },
  { to: '/coupons',     icon: Ticket,        label: 'Coupons' },
  { section: 'Analytics & Config' },
  {
    key: 'reports', icon: BarChart2, label: 'Reports',
    children: [
      { to: '/reports/revenue',   icon: DollarSign,    label: 'Revenue' },
      { to: '/reports/bookings',  icon: CalendarClock, label: 'Bookings' },
      { to: '/reports/hotels',    icon: Building2,     label: 'Hotels' },
      { to: '/reports/customers', icon: Users,         label: 'Customers' },
    ],
  },
  {
    key: 'cms', icon: FileText, label: 'CMS',
    children: [
      { to: '/cms/homepage',     icon: Home,   label: 'Homepage' },
      { to: '/cms/banners',      icon: Image,  label: 'Banners' },
      { to: '/cms/destinations', icon: MapPin, label: 'Destinations' },
      { to: '/cms/offers',       icon: Tag,    label: 'Offers' },
    ],
  },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/white-label', icon: Palette, label: 'White Labeling' },
]

export default function Sidebar() {
  const [open, setOpen] = useState({ users: true, reports: false, cms: false })
  const toggle = (k) => setOpen(p => ({ ...p, [k]: !p[k] }))

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">
        <Logo width={130} color="#ffffff" />
        <span className="sidebar-brand-tag">Admin</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map((item, idx) => {
          if (item.section) {
            return <div key={idx} className="sidebar-section-label">{item.section}</div>
          }
          if (item.children) {
            const isOpen = open[item.key]
            const Icon = item.icon
            return (
              <div key={item.key}>
                <button
                  className={`sidebar-parent${isOpen ? ' expanded' : ''}`}
                  onClick={() => toggle(item.key)}
                >
                  <span className="sidebar-item-icon"><Icon size={16} /></span>
                  <span className="sidebar-item-label">{item.label}</span>
                  <ChevronDown size={13} className={`sidebar-chevron${isOpen ? ' open' : ''}`} />
                </button>
                <div className={`sidebar-children${isOpen ? ' open' : ''}`}>
                  <div className="sidebar-children-inner">
                    {item.children.map((child) => {
                      const CIcon = child.icon
                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          end={child.to === '/hotels'}
                          className={({ isActive }) => `sidebar-child${isActive ? ' active' : ''}`}
                        >
                          <CIcon size={13} />
                          {child.label}
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to !== '/hotels'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-item-icon"><Icon size={16} /></span>
              <span className="sidebar-item-label">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">A</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">Admin User</span>
          <span className="sidebar-user-email">admin@astitrip.com</span>
        </div>
        <div className="sidebar-user-dot" />
      </div>

    </aside>
  )
}
