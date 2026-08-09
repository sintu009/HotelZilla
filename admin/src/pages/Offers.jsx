import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/format'
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', discount_type: 'percentage', discount_value: 0, code: '', image_url: '', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true })

  const load = () => {
    supabase.from('offers').select('*').order('created_at', { ascending: false }).then(({ data }) => { setOffers(data || []); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('offers').update(form).eq('id', editing.id)
    } else {
      await supabase.from('offers').insert(form)
    }
    setShowForm(false); setEditing(null)
    setForm({ title: '', description: '', discount_type: 'percentage', discount_value: 0, code: '', image_url: '', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true })
    load()
  }

  const startEdit = (o) => { setEditing(o); setForm(o); setShowForm(true) }

  const toggleActive = async (o) => {
    await supabase.from('offers').update({ is_active: !o.is_active }).eq('id', o.id)
    load()
  }

  const deleteOffer = async (o) => {
    if (!confirm('Delete this offer?')) return
    await supabase.from('offers').delete().eq('id', o.id)
    load()
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Offers</div><div className="page-subtitle">{offers.length} promotional offers</div></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ title: '', description: '', discount_type: 'percentage', discount_value: 0, code: '', image_url: '', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true }); setShowForm(true) }}><Plus size={14} /> Add Offer</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Title</th><th>Code</th><th>Discount</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {offers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No offers yet</td></tr>
              ) : offers.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.title}</td>
                  <td style={{ fontFamily: 'monospace' }}>{o.code || '—'}</td>
                  <td>{o.discount_type === 'percentage' ? `${o.discount_value}%` : `₹${o.discount_value}`}</td>
                  <td>{formatDate(o.end_date)}</td>
                  <td><span className={`badge ${o.is_active ? 'badge-success' : 'badge-neutral'}`}>{o.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(o)}><Edit2 size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(o)}>{o.is_active ? 'Deactivate' : 'Activate'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteOffer(o)}><Trash2 size={14} /></button>
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
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="label">Title *</label><input className="input" value={form.title} onChange={e => update('title', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => update('description', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Discount Type</label><select className="input" value={form.discount_type} onChange={e => update('discount_type', e.target.value)}><option value="percentage">Percentage</option><option value="flat">Flat Amount</option></select></div>
                  <div className="form-group"><label className="label">Discount Value</label><input className="input" type="number" value={form.discount_value} onChange={e => update('discount_value', +e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label">Code</label><input className="input" value={form.code} onChange={e => update('code', e.target.value)} placeholder="SUMMER50" /></div>
                <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => update('image_url', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Start Date</label><input className="input" type="date" value={form.start_date} onChange={e => update('start_date', e.target.value)} /></div>
                  <div className="form-group"><label className="label">End Date</label><input className="input" type="date" value={form.end_date} onChange={e => update('end_date', e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label"><input type="checkbox" checked={form.is_active} onChange={e => update('is_active', e.target.checked)} /> Active</label></div>
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
