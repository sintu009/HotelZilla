import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { HOTELS } from '../lib/mockData'
import { formatPrice, formatDate } from '../lib/format'
import { Search, Eye, Check, X, Plus } from 'lucide-react'

let nextId = 100

export default function Hotels() {
  const { status } = useParams()
  const [rows, setRows] = useState(HOTELS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [rejectMode, setRejectMode] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = rows
    .filter(h => !status || h.status === status)
    .filter(h =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
    )

  const updateStatus = (h, newStatus, reason = '') => {
    setRows(prev => prev.map(r => r.id === h.id ? { ...r, status: newStatus, rejection_reason: reason } : r))
    setSelected(null)
    setRejectMode(null)
    setRejectReason('')
  }

  const addHotel = (form) => {
    const hotel = { ...form, id: `h${++nextId}`, status: 'approved', amenities: ['Free WiFi', 'AC', 'Parking'], images: [], rejection_reason: '', owner: 'Admin', owner_email: 'admin@stayfinder.com', created_at: new Date().toISOString() }
    setRows(prev => [hotel, ...prev])
    setShowAdd(false)
  }

  const title = status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Hotels` : 'All Hotels'

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
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Hotel</th><th>City</th><th>Owner</th><th>Stars</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotels found</td></tr>
                : filtered.map(h => (
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
                    <td>{h.owner}</td>
                    <td><span className="badge badge-warning">{h.star_rating} ★</span></td>
                    <td>{formatPrice(h.price_from)}</td>
                    <td><span className={`badge ${h.status === 'approved' ? 'badge-success' : h.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{h.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(h)}><Eye size={14} /></button>
                        {h.status === 'pending' && <>
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(h, 'approved')}><Check size={12} /> Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { setRejectMode(h); setRejectReason('') }}><X size={12} /> Reject</button>
                        </>}
                        {h.status === 'rejected' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(h, 'approved')}><Check size={12} /> Approve</button>}
                        {h.status === 'approved' && <button className="btn btn-secondary btn-sm" onClick={() => { setRejectMode(h); setRejectReason('') }}><X size={12} /> Reject</button>}
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
            <div className="modal-header"><h3>{selected.name}</h3><button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button></div>
            <div className="modal-body">
              {selected.cover_image && <img src={selected.cover_image} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 16 }} />}
              {[
                ['Status', <span className={`badge ${selected.status === 'approved' ? 'badge-success' : selected.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{selected.status}</span>],
                ['Owner', `${selected.owner} (${selected.owner_email})`],
                ['Location', `${selected.address}, ${selected.city}, ${selected.state}, ${selected.country}`],
                ['Stars', `${selected.star_rating} stars`],
                ['Price From', `${formatPrice(selected.price_from)}/night`],
                ['Total Rooms', selected.total_rooms],
                ['Contact', `${selected.contact_phone} / ${selected.contact_email}`],
                ['Amenities', (selected.amenities || []).join(', ') || '—'],
                ['Description', selected.description || '—'],
                ['Registered', formatDate(selected.created_at)],
              ].map(([l, v]) => (
                <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
              ))}
              {selected.rejection_reason && <div className="detail-row"><div className="detail-label">Rejection Reason</div><div className="detail-value" style={{ color: 'var(--error)' }}>{selected.rejection_reason}</div></div>}
            </div>
            {selected.status === 'pending' && (
              <div className="modal-footer">
                <button className="btn btn-danger btn-sm" onClick={() => { setRejectMode(selected); setSelected(null) }}>Reject</button>
                <button className="btn btn-success btn-sm" onClick={() => updateStatus(selected, 'approved')}>Approve</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectMode && (
        <div className="modal-overlay" onClick={() => setRejectMode(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Reject Hotel</h3><button className="btn btn-ghost btn-sm" onClick={() => setRejectMode(null)}>✕</button></div>
            <div className="modal-body">
              <p style={{ marginBottom: 12, fontSize: '0.85rem' }}>Reason for rejecting <strong>{rejectMode.name}</strong>:</p>
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
      {showAdd && <AddHotelModal onClose={() => setShowAdd(false)} onAdd={addHotel} />}
    </div>
  )
}

function AddHotelModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', city: '', state: '', description: '', star_rating: 3, price_from: 2000, cover_image: '', total_rooms: 10, contact_phone: '', contact_email: '' })
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Add New Hotel</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <form onSubmit={e => { e.preventDefault(); onAdd(form) }}>
            <div className="form-grid">
              <div className="form-group"><label className="label">Hotel Name *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
              <div className="form-group"><label className="label">City *</label><input className="input" value={form.city} onChange={e => upd('city', e.target.value)} required /></div>
              <div className="form-group"><label className="label">State</label><input className="input" value={form.state} onChange={e => upd('state', e.target.value)} /></div>
              <div className="form-group"><label className="label">Star Rating</label><select className="input" value={form.star_rating} onChange={e => upd('star_rating', +e.target.value)}><option value={2}>2★</option><option value={3}>3★</option><option value={4}>4★</option><option value={5}>5★</option></select></div>
              <div className="form-group"><label className="label">Price/Night (₹)</label><input className="input" type="number" value={form.price_from} onChange={e => upd('price_from', +e.target.value)} /></div>
              <div className="form-group"><label className="label">Total Rooms</label><input className="input" type="number" value={form.total_rooms} onChange={e => upd('total_rooms', +e.target.value)} /></div>
              <div className="form-group"><label className="label">Contact Phone</label><input className="input" value={form.contact_phone} onChange={e => upd('contact_phone', e.target.value)} /></div>
              <div className="form-group"><label className="label">Contact Email</label><input className="input" value={form.contact_email} onChange={e => upd('contact_email', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Cover Image URL</label><input className="input" value={form.cover_image} onChange={e => upd('cover_image', e.target.value)} placeholder="https://..." /></div>
            <div className="form-group"><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => upd('description', e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add Hotel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
