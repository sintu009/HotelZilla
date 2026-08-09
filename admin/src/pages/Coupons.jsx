import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/format'
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react'

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ code: '', description: '', discount_type: 'percentage', discount_value: 10, min_order_amount: 0, max_discount_amount: 0, usage_limit: 100, valid_from: new Date().toISOString().split('T')[0], valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true })

  const load = () => { supabase.from('coupons').select('*').order('created_at', { ascending: false }).then(({ data }) => { setCoupons(data || []); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await supabase.from('coupons').update(form).eq('id', editing.id) }
    else { await supabase.from('coupons').insert({ ...form, code: form.code.toUpperCase() }) }
    setShowForm(false); setEditing(null)
    setForm({ code: '', description: '', discount_type: 'percentage', discount_value: 10, min_order_amount: 0, max_discount_amount: 0, usage_limit: 100, valid_from: new Date().toISOString().split('T')[0], valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true })
    load()
  }

  const startEdit = (c) => { setEditing(c); setForm(c); setShowForm(true) }
  const deleteCoupon = async (c) => { if (!confirm('Delete this coupon?')) return; await supabase.from('coupons').delete().eq('id', c.id); load() }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Coupons</div><div className="page-subtitle">{coupons.length} coupon codes</div></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ code: '', description: '', discount_type: 'percentage', discount_value: 10, min_order_amount: 0, max_discount_amount: 0, usage_limit: 100, valid_from: new Date().toISOString().split('T')[0], valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], is_active: true }); setShowForm(true) }}><Plus size={14} /> Add Coupon</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Code</th><th>Description</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No coupons yet</td></tr>
              ) : coupons.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{c.code}</td>
                  <td>{c.description || '—'}</td>
                  <td>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                  <td>₹{c.min_order_amount}</td>
                  <td>{c.used_count}/{c.usage_limit || '∞'}</td>
                  <td>{formatDate(c.valid_until)}</td>
                  <td><span className={`badge ${c.is_active ? 'badge-success' : 'badge-neutral'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td><div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}><Edit2 size={14} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCoupon(c)}><Trash2 size={14} /></button>
                  </div></td>
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
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="label">Code *</label><input className="input" value={form.code} onChange={e => update('code', e.target.value.toUpperCase())} required placeholder="WELCOME200" /></div>
                <div className="form-group"><label className="label">Description</label><input className="input" value={form.description} onChange={e => update('description', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Discount Type</label><select className="input" value={form.discount_type} onChange={e => update('discount_type', e.target.value)}><option value="percentage">Percentage</option><option value="flat">Flat Amount</option></select></div>
                  <div className="form-group"><label className="label">Discount Value</label><input className="input" type="number" value={form.discount_value} onChange={e => update('discount_value', +e.target.value)} /></div>
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Min Order Amount</label><input className="input" type="number" value={form.min_order_amount} onChange={e => update('min_order_amount', +e.target.value)} /></div>
                  <div className="form-group"><label className="label">Max Discount</label><input className="input" type="number" value={form.max_discount_amount} onChange={e => update('max_discount_amount', +e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="label">Usage Limit (0 = unlimited)</label><input className="input" type="number" value={form.usage_limit} onChange={e => update('usage_limit', +e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Valid From</label><input className="input" type="date" value={form.valid_from} onChange={e => update('valid_from', e.target.value)} /></div>
                  <div className="form-group"><label className="label">Valid Until</label><input className="input" type="date" value={form.valid_until} onChange={e => update('valid_until', e.target.value)} /></div>
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
