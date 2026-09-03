import { useState } from 'react'
import { ROOMS, HOTELS } from '../lib/mockData'
import { formatPrice } from '../lib/format'
import { Plus, CreditCard as Edit2, X } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

let nextId = 100
const blank = () => ({ hotel_id: 'h1', name: '', base_price: 2000, max_guests: 2, total_inventory: 10, bed_type: 'Queen', size_sqft: 250, amenities: ['AC','Free WiFi','TV'], status: 'active' })

export default function Rooms() {
  const toast = useToast()
  const [rows, setRows] = useState(ROOMS)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())
  const [hotelFilter, setHotelFilter] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmToggle, setConfirmToggle] = useState(null)

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const openAdd = () => { setEditing(null); setForm(blank()); setShowForm(true) }
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setShowForm(true) }

  const save = (e) => {
    e.preventDefault()
    if (editing) {
      setRows(prev => prev.map(r => r.id === editing.id ? { ...form, id: r.id } : r))
      toast.success('Room Updated', `${form.name} has been updated successfully.`)
    } else {
      setRows(prev => [...prev, { ...form, id: `r${++nextId}` }])
      toast.success('Room Added', `${form.name} has been added to your inventory.`)
    }
    setShowForm(false)
  }

  const toggleStatus = (r) => {
    const next = r.status === 'active' ? 'inactive' : 'active'
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, status: next } : x))
    if (next === 'inactive') toast.warning('Room Deactivated', `${r.name} is now hidden from bookings.`)
    else toast.success('Room Activated', `${r.name} is now available for bookings.`)
  }

  const remove = (r) => {
    setRows(prev => prev.filter(x => x.id !== r.id))
    toast.error('Room Deleted', `${r.name} has been permanently removed.`)
  }

  const filtered = hotelFilter ? rows.filter(r => r.hotel_id === hotelFilter) : rows
  const hotelName = (id) => HOTELS.find(h => h.id === id)?.name || 'Unknown'

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Rooms & Inventory</div><div className="page-subtitle">{filtered.length} room types across your hotels</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Room Type</button>
      </div>

      <div className="filter-bar">
        <select className="input" style={{ width: 220 }} value={hotelFilter} onChange={e => setHotelFilter(e.target.value)}>
          <option value="">All Hotels</option>
          {HOTELS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Hotel</th><th>Room Name</th><th>Bed Type</th><th>Max Guests</th><th>Size</th><th>Inventory</th><th>Price/Night</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No rooms found</td></tr>
                : filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{hotelName(r.hotel_id)}</td>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td>{r.bed_type}</td>
                    <td>{r.max_guests}</td>
                    <td>{r.size_sqft} sq ft</td>
                    <td>{r.total_inventory}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(r.base_price)}</td>
                    <td><span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Edit2 size={14} /></button>
                        <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => setConfirmToggle(r)}>
                          {r.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(r)}><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit Room' : 'Add Room Type'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Hotel *</label><select className="input" value={form.hotel_id} onChange={e => upd('hotel_id', e.target.value)}>{HOTELS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></div>
                <div className="form-group"><label className="label">Room Name *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Bed Type</label><select className="input" value={form.bed_type} onChange={e => upd('bed_type', e.target.value)}><option>King</option><option>Queen</option><option>2 Queen</option><option>King + Sofa</option><option>Twin</option></select></div>
                  <div className="form-group"><label className="label">Max Guests</label><input className="input" type="number" value={form.max_guests} onChange={e => upd('max_guests', +e.target.value)} /></div>
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Size (sq ft)</label><input className="input" type="number" value={form.size_sqft} onChange={e => upd('size_sqft', +e.target.value)} /></div>
                  <div className="form-group"><label className="label">Inventory</label><input className="input" type="number" value={form.total_inventory} onChange={e => upd('total_inventory', +e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label">Price/Night (₹)</label><input className="input" type="number" value={form.base_price} onChange={e => upd('base_price', +e.target.value)} /></div>
                <div className="form-group"><label className="label">Amenities (comma separated)</label><input className="input" value={form.amenities.join(', ')} onChange={e => upd('amenities', e.target.value.split(',').map(s => s.trim()))} /></div>
                <div className="form-group"><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}><input type="checkbox" checked={form.status === 'active'} onChange={e => upd('status', e.target.checked ? 'active' : 'inactive')} /> Active</label></div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => remove(confirmDelete)}
        variant="danger"
        title="Delete Room?"
        message={`${confirmDelete?.name} will be permanently removed from your inventory.`}
        confirmLabel="Delete"
      />

      <ConfirmModal
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => toggleStatus(confirmToggle)}
        variant={confirmToggle?.status === 'active' ? 'warning' : 'info'}
        title={confirmToggle?.status === 'active' ? 'Deactivate Room?' : 'Activate Room?'}
        message={confirmToggle?.status === 'active'
          ? `${confirmToggle?.name} will be hidden from new bookings.`
          : `${confirmToggle?.name} will be available for bookings again.`}
        confirmLabel={confirmToggle?.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </div>
  )
}
