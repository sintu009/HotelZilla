import { useState } from 'react'
import { OFFERS } from '../lib/mockData'
import { formatDate } from '../lib/format'
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react'

let nextId = 100
const blank = () => ({ title: '', description: '', discount_type: 'percentage', discount_value: 10, code: '', image_url: '', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true })

export default function Offers() {
  const [rows, setRows] = useState(OFFERS)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const openAdd = () => { setEditing(null); setForm(blank()); setShowForm(true) }
  const openEdit = (o) => { setEditing(o); setForm({ ...o }); setShowForm(true) }

  const save = (e) => {
    e.preventDefault()
    if (editing) setRows(prev => prev.map(r => r.id === editing.id ? { ...form, id: r.id, created_at: r.created_at } : r))
    else setRows(prev => [{ ...form, id: `of${++nextId}`, created_at: new Date().toISOString() }, ...prev])
    setShowForm(false)
  }

  const toggleActive = (o) => setRows(prev => prev.map(r => r.id === o.id ? { ...r, is_active: !r.is_active } : r))
  const remove = (o) => { if (!confirm('Delete this offer?')) return; setRows(prev => prev.filter(r => r.id !== o.id)) }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Offers</div><div className="page-subtitle">{rows.length} promotional offers</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Offer</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Title</th><th>Code</th><th>Discount</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No offers yet</td></tr>
                : rows.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>{o.title}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{o.code || '—'}</td>
                    <td>{o.discount_type === 'percentage' ? `${o.discount_value}%` : `₹${o.discount_value}`}</td>
                    <td>{formatDate(o.end_date)}</td>
                    <td><span className={`badge ${o.is_active ? 'badge-success' : 'badge-neutral'}`}>{o.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}><Edit2 size={14} /></button>
                        <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => toggleActive(o)}>{o.is_active ? 'Deactivate' : 'Activate'}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(o)}><Trash2 size={14} /></button>
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
            <div className="modal-header"><h3>{editing ? 'Edit Offer' : 'Add Offer'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Title *</label><input className="input" value={form.title} onChange={e => upd('title', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => upd('description', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Discount Type</label><select className="input" value={form.discount_type} onChange={e => upd('discount_type', e.target.value)}><option value="percentage">Percentage</option><option value="flat">Flat Amount</option></select></div>
                  <div className="form-group"><label className="label">Value</label><input className="input" type="number" value={form.discount_value} onChange={e => upd('discount_value', +e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label">Coupon Code</label><input className="input" value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())} /></div>
                <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => upd('image_url', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Start Date</label><input className="input" type="date" value={form.start_date} onChange={e => upd('start_date', e.target.value)} /></div>
                  <div className="form-group"><label className="label">End Date</label><input className="input" type="date" value={form.end_date} onChange={e => upd('end_date', e.target.value)} /></div>
                </div>
                <div className="form-group"><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} /> Active</label></div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
