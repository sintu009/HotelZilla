import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../lib/format'
import { Search, Eye, Check, X, Plus, Star, MapPin } from 'lucide-react'

export default function Hotels() {
  const { status } = useParams()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [rejectMode, setRejectMode] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const statusFilter = status || undefined

  useEffect(() => {
    let query = supabase.from('hotels').select('*, profiles!hotels_owner_id_fkey(full_name, email)').order('created_at', { ascending: false })
    if (statusFilter) query = query.eq('status', statusFilter)
    query.then(({ data }) => { setHotels(data || []); setLoading(false) })
  }, [statusFilter])

  const filtered = hotels.filter(h =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase())
  )

  const updateStatus = async (hotel, newStatus, reason = '') => {
    await supabase.from('hotels').update({ status: newStatus, rejection_reason: reason }).eq('id', hotel.id)
    setHotels(prev => prev.filter(h => h.id !== hotel.id))
    if (selected?.id === hotel.id) setSelected({ ...hotel, status: newStatus, rejection_reason: reason })
    setRejectMode(null)
    setRejectReason('')
  }

  const title = statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Hotels` : 'All Hotels'

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">{filtered.length} hotels</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Hotel</button>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search hotels..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Hotel</th><th>City</th><th>Owner</th><th>Rating</th><th>Price</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotels found</td></tr>
              ) : filtered.map(h => (
                <tr key={h.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {h.cover_image && <img className="img-thumb" src={h.cover_image} alt="" />}
                      <div>
                        <div style={{ fontWeight: 600 }}>{h.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.star_rating}★ Hotel</div>
                      </div>
                    </div>
                  </td>
                  <td>{h.city}, {h.state}</td>
                  <td>{h.profiles?.full_name || '—'}</td>
                  <td><span className="badge badge-success">{h.star_rating} ★</span></td>
                  <td>{formatPrice(h.price_from)}</td>
                  <td><span className={`badge ${h.status === 'approved' ? 'badge-success' : h.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{h.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(h)}><Eye size={14} /></button>
                      {h.status === 'pending' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(h, 'approved')}><Check size={12} /> Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setRejectMode(h)}><X size={12} /> Reject</button>
                        </>
                      )}
                      {h.status === 'rejected' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(h, 'approved')}><Check size={12} /> Approve</button>}
                      {h.status === 'approved' && <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(h, 'rejected', 'Admin rejected')}><X size={12} /> Reject</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selected.cover_image && <img src={selected.cover_image} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 16 }} />}
              <div className="detail-row"><div className="detail-label">Status</div><div className="detail-value"><span className={`badge ${selected.status === 'approved' ? 'badge-success' : selected.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{selected.status}</span></div></div>
              <div className="detail-row"><div className="detail-label">Owner</div><div className="detail-value">{selected.profiles?.full_name || '—'} ({selected.profiles?.email})</div></div>
              <div className="detail-row"><div className="detail-label">Location</div><div className="detail-value">{selected.address}, {selected.city}, {selected.state}, {selected.country}</div></div>
              <div className="detail-row"><div className="detail-label">Star Rating</div><div className="detail-value">{selected.star_rating} stars</div></div>
              <div className="detail-row"><div className="detail-label">Price From</div><div className="detail-value">{formatPrice(selected.price_from)}/night</div></div>
              <div className="detail-row"><div className="detail-label">Total Rooms</div><div className="detail-value">{selected.total_rooms}</div></div>
              <div className="detail-row"><div className="detail-label">Contact</div><div className="detail-value">{selected.contact_phone} / {selected.contact_email}</div></div>
              <div className="detail-row"><div className="detail-label">Amenities</div><div className="detail-value">{(selected.amenities || []).join(', ') || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Description</div><div className="detail-value">{selected.description}</div></div>
              {selected.rejection_reason && <div className="detail-row"><div className="detail-label">Rejection Reason</div><div className="detail-value" style={{ color: 'var(--error)' }}>{selected.rejection_reason}</div></div>}
              <div className="detail-row"><div className="detail-label">Registered</div><div className="detail-value">{formatDate(selected.created_at)}</div></div>
            </div>
            {selected.status === 'pending' && (
              <div className="modal-footer">
                <button className="btn btn-danger btn-sm" onClick={() => setRejectMode(selected)}>Reject</button>
                <button className="btn btn-success btn-sm" onClick={() => { updateStatus(selected, 'approved'); setSelected(null) }}>Approve Hotel</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectMode && (
        <div className="modal-overlay" onClick={() => setRejectMode(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Reject Hotel</h3></div>
            <div className="modal-body">
              <p style={{ marginBottom: 12, fontSize: '0.85rem' }}>Provide a reason for rejecting <strong>{rejectMode.name}</strong>:</p>
              <textarea className="input" rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Insufficient documentation..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setRejectMode(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(rejectMode, 'rejected', rejectReason || 'Does not meet guidelines')}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Add hotel modal */}
      {showAdd && <AddHotelModal onClose={() => setShowAdd(false)} onAdded={() => { setShowAdd(false); window.location.reload() }} />}
    </div>
  )
}

function AddHotelModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', city: '', state: '', description: '', star_rating: 3, price_from: 2000, cover_image: '', total_rooms: 10, contact_phone: '', contact_email: '' })
  const [loading, setLoading] = useState(false)

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('hotels').insert({
      ...form,
      status: 'approved',
      country: 'India',
      amenities: ['Free WiFi', 'AC', 'Parking'],
      images: form.cover_image ? [form.cover_image] : [],
    })
    onAdded()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Add New Hotel</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label className="label">Hotel Name *</label><input className="input" value={form.name} onChange={e => update('name', e.target.value)} required /></div>
              <div className="form-group"><label className="label">City *</label><input className="input" value={form.city} onChange={e => update('city', e.target.value)} required /></div>
              <div className="form-group"><label className="label">State</label><input className="input" value={form.state} onChange={e => update('state', e.target.value)} /></div>
              <div className="form-group"><label className="label">Star Rating</label><select className="input" value={form.star_rating} onChange={e => update('star_rating', +e.target.value)}><option value={3}>3★</option><option value={4}>4★</option><option value={5}>5★</option></select></div>
              <div className="form-group"><label className="label">Price/Night</label><input className="input" type="number" value={form.price_from} onChange={e => update('price_from', +e.target.value)} /></div>
              <div className="form-group"><label className="label">Total Rooms</label><input className="input" type="number" value={form.total_rooms} onChange={e => update('total_rooms', +e.target.value)} /></div>
              <div className="form-group"><label className="label">Contact Phone</label><input className="input" value={form.contact_phone} onChange={e => update('contact_phone', e.target.value)} /></div>
              <div className="form-group"><label className="label">Contact Email</label><input className="input" value={form.contact_email} onChange={e => update('contact_email', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Cover Image URL</label><input className="input" value={form.cover_image} onChange={e => update('cover_image', e.target.value)} placeholder="https://..." /></div>
            <div className="form-group"><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => update('description', e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>{loading ? <span className="spinner" /> : 'Add Hotel'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
