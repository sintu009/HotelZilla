import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Main',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Hotels', to: '/hotels' },
      { label: 'Offers & Deals', to: '/offers' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Sign Up', to: '/signup' },
      { label: 'My Bookings', to: '/my-bookings' },
    ],
  },
  {
    title: 'Hotel Owners',
    links: [
      { label: 'Register Your Hotel', to: '/register-hotel' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press & Media', to: '/press' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Cancellation Policy', to: '/cancellation' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Disclaimer', to: '/disclaimer' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
]

export default function Sitemap() {
  return (
    <div className="container" style={{ maxWidth: 800, padding: '48px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Globe size={26} color="var(--primary)" />
        <h1 style={{ margin: 0 }}>Sitemap</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 40 }}>A complete overview of all pages on HotelZilla.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 32 }}>
        {SECTIONS.map(({ title, links }) => (
          <div key={title}>
            <h3 style={{ marginBottom: 12, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map(({ label, to }) => (
                <Link key={to} to={to} style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
