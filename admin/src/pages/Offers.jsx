import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import client from '../api/client'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getToken() {
  try {
    const stored = localStorage.getItem('admin_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed?.state?.token ?? parsed?.token ?? null
  } catch { return null }
}

function ImageUpload({ value, onChange }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const upload = async (file) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(`${BASE}/api/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      onChange(data.url)
    } catch (err) { toast.error('Upload failed', err.message) }
    finally { setUploading(false) }
  }

  return (
    <div className="form-group">
      <label className="label">Banner Image</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input className="input" value={value} onChange={e => onChange(e.target.value)} placeholder="Paste URL or upload" style={{ flex: 1 }} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => ref.current.click()} disabled={uploading} style={{ whiteSpace: 'nowrap' }}>
          <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && upload(e.target.files[0])} />
      </div>
      {value && <img src={value} alt="" style={{ marginTop: 8, height: 80, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border-light)' }} />}
    </div>
  )
}

const blank = () => ({ title: '', description: '', code: '', image_url: '', display_order: 0, is_active: true })

export default function Offers() {
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
    client.get('/api/admin/cms/offers')
      .then(res => setRows(res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setEditing(null); setForm(blank()); setShowForm(true) }
  const openEdit = (o) => { setEditing(o); setForm({ ...o }); setShowForm(true) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await client.patch(`/api/admin/cms/offers/${editing.id}`, form)
      else         await client.post('/api/admin/cms/offers', form)
      toast.success('Saved', editing ? 'Offer updated.' : 'Offer created.')
      setShowForm(false)
      load()
    } catch (err) { toast.error('Error', err.message) }
    finally { setSaving(false) }
  }

  const remove = async (o) => {
    try {
      await client.delete(`/api/admin/cms/offers/${o.id}`)
      toast.success('Deleted', `"${o.title}" removed.`)
      load()
    } catch (err) { toast.error('Error', err.message) }
    finally { setConfirmDelete(null) }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Offer Banners</div><div className="page-subtitle">Promotional banners shown on the landing page</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Offer</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Image</th><th>Title</th><th>Code</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : rows.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No offers yet</td></tr>
                  : rows.map(o => (
                    <tr key={o.id}>
                      <td>{o.image_url && <img className="img-thumb" src={o.image_url} alt="" />}</td>
                      <td style={{ fontWeight: 600 }}>{o.title}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{o.code || '—'}</td>
                      <td>{o.display_order}</td>
                      <td><span className={`badge ${o.is_active ? 'badge-success' : 'badge-neutral'}`}>{o.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}><Pencil size={14} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(o)}><Trash2 size={14} /></button>
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
              <h3>{editing ? 'Edit Offer' : 'Add Offer'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Title *</label><input className="input" value={form.title} onChange={e => upd('title', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => upd('description', e.target.value)} /></div>
                <div className="form-group"><label className="label">Coupon Code</label><input className="input" value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())} placeholder="e.g. SAVE20" /></div>
                <ImageUpload value={form.image_url || ''} onChange={v => upd('image_url', v)} />
                <div className="form-grid">
                  <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => upd('display_order', +e.target.value)} /></div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} /> Active
                    </label>
                  </div>
                </div>
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
        title="Delete Offer?"
        message={`"${confirmDelete?.title}" will be permanently removed from the landing page.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
