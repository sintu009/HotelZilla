import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import { formatDate } from '../lib/format'
import client from '../api/client'

const blank = () => ({
  code: '', discount_type: 'percent', discount_value: 10,
  min_amount: 0, max_uses: 100,
  expires_at: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
})

export default function Coupons() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const load = () => {
    setLoading(true)
    client.get('/api/admin/coupons')
      .then(res => setRows(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setEditing(null); setForm(blank()); setShowForm(true) }
  const openEdit = (c) => {
    setEditing(c)
    setForm({ ...c, expires_at: c.expires_at ? c.expires_at.split('T')[0] : '' })
    setShowForm(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        discount_value: Number(form.discount_value),
        min_amount:     Number(form.min_amount),
        max_uses:       Number(form.max_uses),
        expires_at:     form.expires_at ? new Date(form.expires_at).toISOString() : null,
      }
      if (editing) await client.patch(`/api/admin/coupons/${editing.id}`, payload)
      else         await client.post('/api/admin/coupons', payload)
      toast.success('Saved', editing ? `${form.code} updated.` : `${form.code} is now live.`)
      setShowForm(false)
      load()
    } catch (err) { toast.error('Error', err.message) }
    finally { setSaving(false) }
  }

  const remove = async (c) => {
    try {
      await client.delete(`/api/admin/coupons/${c.id}`)
      toast.success('Deleted', `${c.code} removed.`)
      load()
    } catch (err) { toast.error('Error', err.message) }
    finally { setConfirmDelete(null) }
  }

  const isExpired = (d) => d && new Date(d) < new Date()

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Coupons</div><div className="page-subtitle">{rows.length} coupon codes</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Coupon</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Amount</th><th>Usage</th><th>Expires</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : rows.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No coupons yet</td></tr>
                  : rows.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{c.code}</td>
                      <td><span className="badge badge-neutral">{c.discount_type}</span></td>
                      <td>{c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                      <td>{c.min_amount > 0 ? `₹${c.min_amount}` : '—'}</td>
                      <td>{c.uses || 0} / {c.max_uses}</td>
                      <td>
                        <span style={{ color: isExpired(c.expires_at) ? 'var(--error)' : 'inherit' }}>
                          {c.expires_at ? formatDate(c.expires_at) : '—'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(c)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Code *</label><input className="input" value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())} required placeholder="SAVE20" /></div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Discount Type</label>
                    <select className="input" value={form.discount_type} onChange={e => upd('discount_type', e.target.value)}>
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="label">{form.discount_type === 'percent' ? 'Value (%)' : 'Value (₹)'}</label><input className="input" type="number" min={1} value={form.discount_value} onChange={e => upd('discount_value', e.target.value)} required /></div>
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Min Order Amount (₹)</label><input className="input" type="number" min={0} value={form.min_amount} onChange={e => upd('min_amount', e.target.value)} /></div>
                  <div className="form-group"><label className="label">Max Uses</label><input className="input" type="number" min={1} value={form.max_uses} onChange={e => upd('max_uses', e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label">Expires At *</label><input className="input" type="date" value={form.expires_at} onChange={e => upd('expires_at', e.target.value)} required /></div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
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
        title="Delete Coupon?"
        message={`"${confirmDelete?.code}" will be permanently removed.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
