import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HOTELS } from '../lib/mockData'
import { formatPrice } from '../lib/format'
import { Star, MapPin, BedDouble, Plus } from 'lucide-react'
import { useToast } from '../components/Toast'

export default function MyHotels() {
  const toast = useToast()
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Hotels</div>
          <div className="page-subtitle">{HOTELS.length} properties registered</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Add New Hotel</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {HOTELS.map(h => (
          <Link key={h.id} to={`/hotels/${h.id}`} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ position: 'relative' }}>
              <img src={h.cover_image} alt={h.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <span className={`badge ${h.status === 'approved' ? 'badge-success' : 'badge-warning'}`} style={{ position: 'absolute', top: 12, right: 12 }}>
                {h.status}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                {[...Array(h.star_rating)].map((_, i) => <Star key={i} size={14} className="star" fill="currentColor" />)}
              </div>
              <h3 style={{ marginBottom: 4 }}>{h.name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} /> {h.city}, {h.state}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(h.price_from)} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/night</span></div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}><BedDouble size={14} /> {h.total_rooms}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rooms</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                      <Star size={14} fill="currentColor" className="star" /> {h.rating || '—'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.review_count} reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showAdd && <AddHotelModal onClose={() => setShowAdd(false)} onSubmit={(name) => {
        setShowAdd(false)
        toast.info('Submitted for Approval', `${name} has been submitted and is pending admin review.`)
      }} />}
    </div>
  )
}

function AddHotelModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', city: '', state: '', star_rating: 3, price_from: 2000, description: '', address: '', contact_phone: '', contact_email: '' })
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Register New Hotel</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={e => { e.preventDefault(); onSubmit(form.name) }}>
            <div className="form-group"><label className="label">Hotel Name *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
            <div className="form-grid">
              <div className="form-group"><label className="label">City *</label><input className="input" value={form.city} onChange={e => upd('city', e.target.value)} required /></div>
              <div className="form-group"><label className="label">State</label><input className="input" value={form.state} onChange={e => upd('state', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Address</label><input className="input" value={form.address} onChange={e => upd('address', e.target.value)} /></div>
            <div className="form-grid">
              <div className="form-group"><label className="label">Star Rating</label><select className="input" value={form.star_rating} onChange={e => upd('star_rating', +e.target.value)}><option value={2}>2★</option><option value={3}>3★</option><option value={4}>4★</option><option value={5}>5★</option></select></div>
              <div className="form-group"><label className="label">Price/Night (₹)</label><input className="input" type="number" value={form.price_from} onChange={e => upd('price_from', +e.target.value)} /></div>
            </div>
            <div className="form-grid">
              <div className="form-group"><label className="label">Contact Phone</label><input className="input" value={form.contact_phone} onChange={e => upd('contact_phone', e.target.value)} /></div>
              <div className="form-group"><label className="label">Contact Email</label><input className="input" value={form.contact_email} onChange={e => upd('contact_email', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => upd('description', e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Submit for Approval</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
