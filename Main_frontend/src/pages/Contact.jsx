import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="container" style={{ maxWidth: 800, padding: '48px 16px' }}>
      <h1>Contact Us</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40 }}>We'd love to hear from you. Fill in the form or reach us directly.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
              <h3>Message Sent!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 1 business day.</p>
              <button className="btn btn-primary btn-sm" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="label">Name *</label>
                <input className="input" required value={form.name} onChange={set('name')} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="label">Email *</label>
                <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label className="label">Subject</label>
                <input className="input" value={form.subject} onChange={set('subject')} placeholder="How can we help?" />
              </div>
              <div className="form-group">
                <label className="label">Message *</label>
                <textarea className="input" rows={5} required value={form.message} onChange={set('message')} placeholder="Describe your issue or question..." />
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { icon: <Mail size={18} />, label: 'Email', value: 'support@hotelzilla.com', href: 'mailto:support@hotelzilla.com' },
            { icon: <Phone size={18} />, label: 'Phone', value: '+91 1800 123 4567', href: 'tel:+911800123456' },
            { icon: <MapPin size={18} />, label: 'Office', value: 'Bangalore, Karnataka, India', href: null },
          ].map(({ icon, label, value, href }) => (
            <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: 'var(--surface)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
                {href ? <a href={href} style={{ fontWeight: 500 }}>{value}</a> : <span style={{ fontWeight: 500 }}>{value}</span>}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, background: 'var(--surface)', borderRadius: 10, padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Support Hours</strong><br />
            Monday – Saturday, 9 AM – 6 PM IST
          </div>
        </div>
      </div>
    </div>
  )
}
