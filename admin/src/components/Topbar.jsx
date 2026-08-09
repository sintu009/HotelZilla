import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, Maximize2, Minimize2, ChevronRight, LogOut, User, Settings, X } from 'lucide-react'

const PAGE_TITLES = {
  '/dashboard': ['Dashboard'],
  '/users/customers': ['Users', 'Customers'],
  '/users/hotel-owners': ['Users', 'Hotel Owners'],
  '/hotels': ['Hotels', 'All Hotels'],
  '/hotels/pending': ['Hotels', 'Pending Approval'],
  '/hotels/approved': ['Hotels', 'Approved'],
  '/hotels/rejected': ['Hotels', 'Rejected'],
  '/bookings': ['Bookings'],
  '/payments': ['Payments'],
  '/refunds': ['Refunds'],
  '/reviews': ['Reviews'],
  '/offers': ['Offers'],
  '/coupons': ['Coupons'],
  '/commissions': ['Commissions'],
  '/reports/revenue': ['Reports', 'Revenue'],
  '/reports/bookings': ['Reports', 'Bookings'],
  '/reports/hotels': ['Reports', 'Hotels'],
  '/reports/customers': ['Reports', 'Customers'],
  '/cms/homepage': ['CMS', 'Homepage'],
  '/cms/banners': ['CMS', 'Banners'],
  '/cms/destinations': ['CMS', 'Destinations'],
  '/cms/offers': ['CMS', 'Offers'],
  '/settings': ['Settings'],
}

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'booking', title: 'New booking received', desc: 'Booking #BK-1042 for The Grand Palace', time: '2 min ago', unread: true },
  { id: 2, type: 'hotel', title: 'Hotel pending approval', desc: 'Sunrise Resort submitted for review', time: '18 min ago', unread: true },
  { id: 3, type: 'refund', title: 'Refund requested', desc: 'Customer #C-209 raised a refund', time: '1 hr ago', unread: true },
  { id: 4, type: 'review', title: 'New 1-star review', desc: 'Negative review on Ocean View Inn', time: '3 hr ago', unread: false },
  { id: 5, type: 'payment', title: 'Payment failed', desc: 'Transaction #TXN-8821 failed', time: 'Yesterday', unread: false },
]

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

export default function Topbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const crumbs = PAGE_TITLES[pathname] || ['Dashboard']

  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const searchRef = useRef(null)

  useOutsideClick(notifRef, () => setNotifOpen(false))
  useOutsideClick(profileRef, () => setProfileOpen(false))
  useOutsideClick(searchRef, () => setSearchOpen(false))

  const unreadCount = notifications.filter(n => n.unread).length

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })))
  const dismiss = (id) => setNotifications(n => n.filter(x => x.id !== id))

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="topbar">
      {/* Left — Breadcrumb */}
      <div className="topbar-left">
        <nav className="breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} className="breadcrumb-item">
              {i > 0 && <ChevronRight size={13} className="breadcrumb-sep" />}
              <span className={i === crumbs.length - 1 ? 'breadcrumb-current' : 'breadcrumb-link'}>{c}</span>
            </span>
          ))}
        </nav>
        <div className="topbar-datetime">{dateStr} &nbsp;·&nbsp; {timeStr}</div>
      </div>

      {/* Right — Actions */}
      <div className="topbar-actions">

        {/* Search */}
        <div className={`topbar-search${searchOpen ? ' open' : ''}`} ref={searchRef}>
          {searchOpen
            ? <div className="topbar-search-box">
                <Search size={15} className="topbar-search-icon" />
                <input
                  autoFocus
                  className="topbar-search-input"
                  placeholder="Search pages, users, hotels…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="topbar-icon-btn" onClick={() => { setSearch(''); setSearchOpen(false) }}><X size={15} /></button>
              </div>
            : <button className="topbar-icon-btn" title="Search" onClick={() => setSearchOpen(true)}><Search size={18} /></button>
          }
        </div>

        {/* Fullscreen */}
        <button className="topbar-icon-btn" title="Toggle fullscreen" onClick={toggleFullscreen}>
          {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        {/* Notifications */}
        <div className="topbar-dropdown-wrap" ref={notifRef}>
          <button className="topbar-icon-btn topbar-notif-btn" title="Notifications" onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="topbar-dropdown notif-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications</span>
                {unreadCount > 0 && <button className="dropdown-action" onClick={markAllRead}>Mark all read</button>}
              </div>
              <div className="notif-list">
                {notifications.length === 0
                  ? <div className="dropdown-empty">No notifications</div>
                  : notifications.map(n => (
                    <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-desc">{n.desc}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                      <button className="notif-dismiss" onClick={() => dismiss(n.id)}><X size={12} /></button>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="topbar-divider" />

        {/* Profile */}
        <div className="topbar-dropdown-wrap" ref={profileRef}>
          <button className="topbar-profile-btn" onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}>
            <div className="topbar-avatar">A</div>
            <div className="topbar-profile-info">
              <span className="topbar-profile-name">Admin</span>
              <span className="topbar-profile-role">Super Admin</span>
            </div>
          </button>
          {profileOpen && (
            <div className="topbar-dropdown profile-dropdown">
              <div className="dropdown-header">
                <div className="profile-dd-name">Admin User</div>
                <div className="profile-dd-email">admin@astitrip.com</div>
              </div>
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false) }}>
                  <User size={15} /> My Profile
                </button>
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false) }}>
                  <Settings size={15} /> Settings
                </button>
                <div className="dropdown-sep" />
                <button className="dropdown-item dropdown-item-danger">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
