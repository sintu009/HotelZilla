import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { hotelsApi, api } from '../lib/api'
import { Star, MapPin, BedDouble, Plus, DoorOpen, DoorClosed, Clock } from 'lucide-react'
import { useToast } from '../components/Toast'

const STATUS_BADGE = {
  approved:  'badge-success',
  pending:   'badge-warning',
  rejected:  'badge-error',
  suspended: 'badge-neutral',
}

export default function MyHotels() {
  const toast = useToast()
  const [hotels, setHotels]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showAdd, setShowAdd]   = useState(false)
  const [toggling, setToggling] = useState(null) // hotel id being toggled

  const load = () => {
    setLoading(true)
    hotelsApi.list()
      .then(res => setHotels(Array.isArray(res) ? res : res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleToggleOpen = async (h) => {
    if (h.status !== 'approved') {
      toast.warning('Not allowed', 'Only approved hotels can be opened or closed.')
      return
    }
    setToggling(h.id)
    try {
      const res = await hotelsApi.toggleOpen(h.id)
      setHotels(prev => prev.map(hotel => hotel.id === h.id ? { ...hotel, is_open: res.is_open } : hotel))
      toast[res.is_open ? 'success' : 'warning'](
        res.is_open ? 'Hotel Opened' : 'Hotel Closed',
        res.is_open ? 'Your hotel is now visible and accepting bookings.' : 'Your hotel is now closed. No new bookings will be accepted.'
      )
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setToggling(null)
    }
  }

  if (loading) return <div className="loading-center"><span className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Hotels</div>
          <div className="page-subtitle">{hotels.length} {hotels.length === 1 ? 'property' : 'properties'} registered</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add New Hotel
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="empty-state">
          <p>No hotels registered yet. Add your first property.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {hotels.map(h => (
            <div key={h.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ position: 'relative' }}>
                <img
                  src={h.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                  alt={h.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }}
                />
                {/* Status badge */}
                <span className={`badge ${STATUS_BADGE[h.status] || 'badge-neutral'}`}
                  style={{ position: 'absolute', top: 12, left: 12 }}>
                  {h.status}
                </span>
                {/* Open/Closed badge */}
                {h.status === 'approved' && (
                  <span className={`badge ${h.is_open !== false ? 'badge-success' : 'badge-error'}`}
                    style={{ position: 'absolute', top: 12, right: 12 }}>
                    {h.is_open !== false ? '● Open' : '● Closed'}
                  </span>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                  {[...Array(h.star_rating || 3)].map((_, i) => (
                    <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <h3 style={{ marginBottom: 4, fontSize: '1rem' }}>{h.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {h.city}{h.state ? `, ${h.state}` : ''}
                </div>

                {/* Pending notice */}
                {h.status === 'pending' && (
                  <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 6, padding: '8px 12px', fontSize: '0.78rem', color: '#854d0e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} /> Awaiting admin approval before you can open/close.
                  </div>
                )}
                {h.status === 'rejected' && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '8px 12px', fontSize: '0.78rem', color: '#991b1b', marginBottom: 12 }}>
                    This hotel was rejected. Contact support for details.
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <BedDouble size={13} style={{ display: 'inline', marginRight: 4 }} />
                    {h.room_count ?? '—'} rooms
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/hotels/${h.id}`} className="btn btn-secondary btn-sm">View</Link>
                    {h.status === 'approved' && (
                      <button
                        className={`btn btn-sm ${h.is_open !== false ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleOpen(h)}
                        disabled={toggling === h.id}
                        style={{ minWidth: 90 }}
                      >
                        {toggling === h.id
                          ? <span className="spinner" style={{ width: 14, height: 14 }} />
                          : h.is_open !== false
                            ? <><DoorClosed size={13} /> Close</>
                            : <><DoorOpen size={13} /> Open</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddHotelModal
          onClose={() => setShowAdd(false)}
          onSubmit={(name) => { setShowAdd(false); load(); toast.info('Submitted', `${name} submitted for admin approval.`) }}
        />
      )}
    </div>
  )
}

function AddHotelModal({ onClose, onSubmit }) {
  const toast = useToast()
  const [form, setForm]     = useState({ name: '', city: '', state: '', star_rating: 3, description: '', address: '' })
  const [saving, setSaving] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/api/partner/hotels', {
        ...form,
        star_rating: Number(form.star_rating),
        amenities: [],
        images: [],
      })
      onSubmit(form.name)
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Register New Hotel</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group"><label className="label">Hotel Name *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
            <div className="form-grid">
              <div className="form-group"><label className="label">City *</label><input className="input" value={form.city} onChange={e => upd('city', e.target.value)} required /></div>
              <div className="form-group"><label className="label">State</label><input className="input" value={form.state} onChange={e => upd('state', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Address</label><input className="input" value={form.address} onChange={e => upd('address', e.target.value)} /></div>
            <div className="form-group">
              <label className="label">Star Rating</label>
              <select className="input" value={form.star_rating} onChange={e => upd('star_rating', e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="form-group"><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => upd('description', e.target.value)} /></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? <span className="spinner" /> : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
