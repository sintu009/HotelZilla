import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQS = [
  { q: 'How do I book a hotel?', a: 'Search for hotels by city and dates on our homepage. Select a hotel, choose your room, and complete the booking form. You\'ll receive a confirmation email instantly.' },
  { q: 'Can I cancel my booking?', a: 'Yes. Go to "My Bookings" in your account, find the booking, and click Cancel. Cancellation policies vary by hotel — check the hotel\'s policy before booking.' },
  { q: 'How do I get a refund?', a: 'Refunds are processed within 5–7 business days after cancellation approval. The amount is returned to your original payment method.' },
  { q: 'How do I register my hotel?', a: 'Click "Register Hotel" in the footer or header. Fill in your hotel details and submit. Our team reviews and approves within 24 hours.' },
  { q: 'I can\'t log in to my account. What should I do?', a: 'Try resetting your password from the login page. If the issue persists, contact us at support@hotelzilla.com.' },
  { q: 'Are the prices shown per night or total?', a: 'Prices shown on listing pages are per night. The total cost including taxes is shown on the booking confirmation page.' },
]

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
      <button onClick={() => setOpen(p => !p)} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 0 }}>
        <span style={{ fontWeight: 500 }}>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{a}</p>}
    </div>
  )
}

export default function HelpCenter() {
  return (
    <div className="container" style={{ maxWidth: 720, padding: '48px 16px' }}>
      <h1>Help Center</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40 }}>Find answers to common questions below, or reach out to our support team.</p>

      <h2 style={{ marginBottom: 4 }}>Frequently Asked Questions</h2>
      <div style={{ marginBottom: 40 }}>
        {FAQS.map(f => <FAQ key={f.q} {...f} />)}
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '24px 28px' }}>
        <h3 style={{ marginTop: 0 }}>Still need help?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>Our support team is available Mon–Sat, 9 AM – 6 PM IST.</p>
        <a href="mailto:support@hotelzilla.com" className="btn btn-primary btn-sm">Email Support</a>
      </div>
    </div>
  )
}
