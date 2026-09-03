import { useState } from 'react'
import { COUPONS } from '../lib/mockData'
import { formatDate } from '../lib/format'
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

let nextId = 100
const blank = () => ({ code: '', description: '', discount_type: 'percentage', discount_value: 10, min_order_amount: 0, max_discount_amount: 0, usage_limit: 100, used_count: 0, valid_from: new Date().toISOString().split('T')[0], valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true })

export default function Coupons() {
  const toast = useToast()
  const [rows, setRows] = useState(COUPONS)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())
  const [confirmDelete, setConfirmDelete] = useState(null)

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const openAdd = () => { setEditing(null); setForm(blank()); setShowForm(true) }
  const openEdit = (c) => { setEditing(c); setForm({ ...c }); setShowForm(true) }

  const save = (e) => {
    e.preventDefault()
    if (editing) {
      setRows(prev => prev.map(r => r.id === editing.id ? { ...form, id: r.id, used_count: r.used_count, created_at: r.created_at } : r))
      toast.success('Coupon Updated', `${form.code} has been updated.`)
    } else {
      setRows(prev => [{ ...form, code: form.code.toUpperCase(), id: `cp${++nextId}`, created_at: new Date().toISOString() }, ...prev])
      toast.success('Coupon Created', `${form.code.toUpperCase()} is now active.`)
    }
    setShowForm(false)
  }

  const remove = (c) => {
    setRows(prev => prev.filter(r => r.id !== c.id))
    toast.error('Coupon Deleted', `${c.code} has been permanently removed.`)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Coupons</div><div className="page-subtitle">{rows.length} coupon codes</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Coupon</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Code</th><th>Description</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No coupons yet</td></tr>
                : rows.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{c.code}</td>
                    <td>{c.description || '—'}</td>
                    <td>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                    <td>₹{c.min_order_amount}</td>
                    <td>{c.used_count}/{c.usage_limit || '∞'}</td>
                    <td>{formatDate(c.valid_until)}</td>
                    <td><span className={`badge ${c.is_active ? 'badge-success' : 'badge-neutral'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(c)}><Trash2 size={14} /></button>
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
            <div className="modal-header"><h3>{editing ? 'Edit Coupon' : 'Add Coupon'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Code *</label><input className="input" value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())} required placeholder="WELCOME200" /></div>
                <div className="form-group"><label className="label">Description</label><input className="input" value={form.description} onChange={e => upd('description', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Discount Type</label><select className="input" value={form.discount_type} onChange={e => upd('discount_type', e.target.value)}><option value="percentage">Percentage</option><option value="flat">Flat Amount</option></select></div>
                  <div className="form-group"><label className="label">Value</label><input className="input" type="number" value={form.discount_value} onChange={e => upd('discount_value', +e.target.value)} /></div>
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Min Order (₹)</label><input className="input" type="number" value={form.min_order_amount} onChange={e => upd('min_order_amount', +e.target.value)} /></div>
                  <div className="form-group"><label className="label">Max Discount (₹)</label><input className="input" type="number" value={form.max_discount_amount} onChange={e => upd('max_discount_amount', +e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label">Usage Limit (0 = unlimited)</label><input className="input" type="number" value={form.usage_limit} onChange={e => upd('usage_limit', +e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Valid From</label><input className="input" type="date" value={form.valid_from} onChange={e => upd('valid_from', e.target.value)} /></div>
                  <div className="form-group"><label className="label">Valid Until</label><input className="input" type="date" value={form.valid_until} onChange={e => upd('valid_until', e.target.value)} /></div>
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

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => remove(confirmDelete)}
        variant="danger"
        title="Delete Coupon?"
        message={`Coupon "${confirmDelete?.code}" will be permanently removed.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
