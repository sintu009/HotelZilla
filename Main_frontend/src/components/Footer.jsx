import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Hotel, Mail, Phone, MapPin, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import client from '../api/client'

export default function Footer() {
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ name: '', city: '', address: '', description: '', amenities: '', contact_name: '', contact_email: '', contact_phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await client.post('/api/hotels/register', {
        ...form,
        amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
      })
      setSuccess(true)
      setForm({ name: '', city: '', address: '', description: '', amenities: '', contact_name: '', contact_email: '', contact_phone: '' })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="footer">
      <div className="container">

        {/* Hotel Registration Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 16, padding: '32px 36px', marginBottom: 48, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={26} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 4 }}>List Your Hotel on HotelZilla</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Reach millions of travelers. Free to register — our team reviews and approves within 24 hrs.</div>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(p => !p); setSuccess(false); setError('') }}
              style={{ background: '#fff', color: '#0f172a', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
            >
              {showForm ? <><ChevronUp size={16} /> Hide Form</> : <><ChevronDown size={16} /> Register Hotel</>}
            </button>
          </div>

          {showForm && (
            <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24 }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>Registration Submitted!</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Our team will review your hotel and contact you within 24 hours.</div>
                  <button onClick={() => { setSuccess(false); setShowForm(false) }} style={{ marginTop: 16, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: '0.85rem' }}>Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem', color: '#fca5a5' }}>{error}</div>}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    {[
                      ['name',          'Hotel Name *',     'text',  true],
                      ['city',          'City *',           'text',  true],
                      ['address',       'Address',          'text',  false],
                      ['contact_name',  'Your Name *',      'text',  true],
                      ['contact_email', 'Your Email *',     'email', true],
                      ['contact_phone', 'Phone Number',     'tel',   false],
                    ].map(([field, label, type, required]) => (
                      <div key={field}>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 5 }}>{label}</label>
                        <input
                          type={type}
                          required={required}
                          value={form[field]}
                          onChange={set(field)}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                          placeholder={label.replace(' *', '')}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 5 }}>Amenities <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
                      <input
                        type="text"
                        value={form.amenities}
                        onChange={set('amenities')}
                        placeholder="WiFi, Pool, Gym, Parking"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 5 }}>Description</label>
                      <textarea
                        rows={2}
                        value={form.description}
                        onChange={set('description')}
                        placeholder="Brief description of your hotel..."
                        style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={submitting} style={{ background: '#fff', color: '#0f172a', border: 'none', borderRadius: 8, padding: '11px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 32, height: 32, background: 'var(--sage)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hotel size={18} color="#fff" />
              </span>
              HotelZilla
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#64748B', maxWidth: 280, marginTop: 10, lineHeight: 1.6 }}>
              Your trusted partner for finding and booking the perfect hotel stays worldwide.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/cancellation">Cancellation</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={13} /> support@hotelzilla.com</a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={13} /> +91 1800 123 4567</a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> Bangalore, India</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 HotelZilla. All rights reserved.
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <Link to="/terms" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Terms &amp; Conditions</Link>
            <Link to="/privacy" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Privacy Policy</Link>
            <Link to="/disclaimer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Disclaimer</Link>
            <Link to="/sitemap" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
