import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, CreditCard as Edit2, Trash2, X, Save, Upload } from 'lucide-react'
import client from '../api/client'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getToken() {
  try {
    const stored = localStorage.getItem('admin_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed?.state?.token ?? parsed?.token ?? null
  } catch { return null }
}

function ImageUpload({ value, onChange, label = 'Image' }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const upload = async (file) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const token = getToken()
      const res = await fetch(`${BASE}/api/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      onChange(data.url)
    } catch (err) {
      toast.error('Upload failed', err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form-group">
      <label className="label">{label}</label>
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

export default function CMS() {
  const { section } = useParams()
  if (section === 'homepage')     return <CMSHomepage />
  if (section === 'banners')      return <CMSDestinations />
  if (section === 'destinations') return <CMSDestinations />
  if (section === 'offers')       return <CMSOffersContent />
  return <CMSHomepage />
}

/* ---------- Homepage ---------- */
const DEFAULT_FEATURES = [
  { image: '', title: 'Verified Quality',  desc: 'Every hotel is inspected and quality-certified before listing', show_text: true },
  { image: '', title: 'Best Price',        desc: 'Guaranteed lowest prices — we match any lower rate you find',  show_text: true },
  { image: '', title: 'Reward Points',     desc: 'Earn points on every stay and redeem for free nights',         show_text: true },
  { image: '', title: 'Instant Booking',   desc: 'Confirm your stay in seconds with real-time availability',     show_text: true },
  { image: '', title: 'Free Breakfast',    desc: 'Complimentary breakfast at 5,000+ partner properties',        show_text: true },
  { image: '', title: '24/7 Support',      desc: 'Round-the-clock customer support via chat, call or email',    show_text: true },
]

function CMSHomepage() {
  const toast = useToast()
  const [data, setData] = useState({
    hero_title: 'Find Your Perfect Stay',
    hero_subtitle: 'Discover amazing hotels at the best prices',
    hero_image: '',
    hero_show_text: true,
    feature_section_title: 'Why Choose HotelZilla?',
    stats_hotels: '500+',
    stats_customers: '10,000+',
    stats_cities: '50+',
    whatsapp_number: '',
    features: DEFAULT_FEATURES,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    client.get('/api/admin/cms/homepage')
      .then(res => {
        if (res && Object.keys(res).length)
          setData(prev => ({ ...prev, ...res, features: res.features?.length ? res.features : DEFAULT_FEATURES }))
      })
      .catch(() => {})
  }, [])

  const upd = (k, v) => setData(p => ({ ...p, [k]: v }))
  const updFeature = (i, k, v) => setData(p => {
    const features = [...p.features]
    features[i] = { ...features[i], [k]: v }
    return { ...p, features }
  })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await client.put('/api/admin/cms/homepage', data)
      toast.success('Saved', 'Homepage content updated.')
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Homepage Content</div><div className="page-subtitle">Edit landing page content</div></div>
        <button className="btn btn-primary btn-sm" form="hp-form" type="submit" disabled={saving}><Save size={14} /> {saving ? 'Saving...' : 'Save'}</button>
      </div>
      <form id="hp-form" onSubmit={save}>

        {/* Hero */}
        <div className="card" style={{ padding: 24, maxWidth: 700, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Hero Section</div>
          <ImageUpload label="Hero Background Image" value={data.hero_image || ''} onChange={v => upd('hero_image', v)} />
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={data.hero_show_text !== false} onChange={e => upd('hero_show_text', e.target.checked)} />
              Show title &amp; subtitle text over hero image
            </label>
          </div>
          {data.hero_show_text !== false && (
            <>
              <div className="form-group"><label className="label">Hero Title</label><input className="input" value={data.hero_title} onChange={e => upd('hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="label">Hero Subtitle</label><input className="input" value={data.hero_subtitle} onChange={e => upd('hero_subtitle', e.target.value)} /></div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="card" style={{ padding: 24, maxWidth: 700, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Stats Band</div>
          <div className="form-grid">
            <div className="form-group"><label className="label">Hotels Stat</label><input className="input" value={data.stats_hotels} onChange={e => upd('stats_hotels', e.target.value)} /></div>
            <div className="form-group"><label className="label">Customers Stat</label><input className="input" value={data.stats_customers} onChange={e => upd('stats_customers', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="label">Cities Stat</label><input className="input" value={data.stats_cities} onChange={e => upd('stats_cities', e.target.value)} /></div>
          <div className="form-group" style={{ marginTop: 8 }}>
            <label className="label">WhatsApp Contact Number</label>
            <input className="input" value={data.whatsapp_number || ''} onChange={e => upd('whatsapp_number', e.target.value)} placeholder="e.g. 919876543210 (with country code, no +)" />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>This number is used for the WhatsApp floating button on the site.</div>
          </div>
        </div>

        {/* Features */}
        <div className="card" style={{ padding: 24, maxWidth: 700 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.95rem' }}>Why Book With Us — Feature Cards</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>Upload an image per card or leave blank to use the default icon. Uncheck “Show text” if your image already contains the text.</div>
          <div className="form-group"><label className="label">Section Title</label><input className="input" value={data.feature_section_title} onChange={e => upd('feature_section_title', e.target.value)} /></div>
          {(data.features || DEFAULT_FEATURES).map((f, i) => (
            <div key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 10, color: 'var(--text-muted)' }}>Card {i + 1}</div>
              <ImageUpload label="Card Image (optional)" value={f.image || ''} onChange={v => updFeature(i, 'image', v)} />
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={f.show_text !== false} onChange={e => updFeature(i, 'show_text', e.target.checked)} />
                  Show title &amp; description text
                </label>
              </div>
              {f.show_text !== false && (
                <>
                  <div className="form-group"><label className="label">Title</label><input className="input" value={f.title} onChange={e => updFeature(i, 'title', e.target.value)} /></div>
                  <div className="form-group"><label className="label">Description</label><input className="input" value={f.desc} onChange={e => updFeature(i, 'desc', e.target.value)} /></div>
                </>
              )}
            </div>
          ))}
        </div>

      </form>
    </div>
  )
}

/* ---------- Destinations ---------- */
const blankDest = () => ({ name: '', country: 'India', image_url: '', display_order: 0, is_active: true })

function CMSDestinations() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankDest())
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const load = () => {
    client.get('/api/admin/cms/destinations')
      .then(res => setRows(res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(blankDest()); setShowForm(true) }
  const openEdit = (d) => { setEditing(d); setForm({ ...d }); setShowForm(true) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await client.patch(`/api/admin/cms/destinations/${editing.id}`, form)
      else await client.post('/api/admin/cms/destinations', form)
      toast.success('Saved', editing ? 'Destination updated.' : 'Destination added.')
      setShowForm(false)
      load()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (d) => {
    try {
      await client.delete(`/api/admin/cms/destinations/${d.id}`)
      toast.success('Deleted', `${d.name} removed.`)
      load()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Destinations</div><div className="page-subtitle">{rows.length}/5 destinations</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd} disabled={rows.length >= 5} title={rows.length >= 5 ? 'Maximum 5 destinations allowed' : ''}><Plus size={14} /> Add Destination</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Image</th><th>Name</th><th>Country</th><th>Hotels</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : rows.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No destinations</td></tr>
                  : rows.map(d => (
                    <tr key={d.id}>
                      <td>{d.image_url && <img className="img-thumb" src={d.image_url} alt="" />}</td>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td>{d.country}</td>
                      <td>{d.hotel_count}+</td>
                      <td>{d.display_order}</td>
                      <td><span className={`badge ${d.is_active ? 'badge-success' : 'badge-neutral'}`}>{d.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td><div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}><Edit2 size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(d)}><Trash2 size={14} /></button>
                      </div></td>
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
            <div className="modal-header"><h3>{editing ? 'Edit Destination' : 'Add Destination'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Name *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Country</label><input className="input" value={form.country} onChange={e => upd('country', e.target.value)} /></div>
                <ImageUpload label="Image" value={form.image_url || ''} onChange={v => upd('image_url', v)} />
                <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => upd('display_order', +e.target.value)} /></div>
                <div className="form-group"><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} /> Active</label></div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => remove(confirmDelete)} variant="danger" title="Delete Destination?" message={`"${confirmDelete?.name}" will be removed from the landing page.`} confirmLabel="Delete" />
    </div>
  )
}

/* ---------- Offers Content ---------- */
const blankOffer = () => ({ title: '', description: '', code: '', image_url: '', display_order: 0, is_active: true })

function CMSOffersContent() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankOffer())
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const load = () => {
    client.get('/api/admin/cms/offers')
      .then(res => setRows(res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(blankOffer()); setShowForm(true) }
  const openEdit = (o) => { setEditing(o); setForm({ ...o }); setShowForm(true) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await client.patch(`/api/admin/cms/offers/${editing.id}`, form)
      else await client.post('/api/admin/cms/offers', form)
      toast.success('Saved', editing ? 'Offer updated.' : 'Offer added.')
      setShowForm(false)
      load()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (o) => {
    try {
      await client.delete(`/api/admin/cms/offers/${o.id}`)
      toast.success('Deleted', `${o.title} removed.`)
      load()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Offer Banners</div><div className="page-subtitle">Promotional offers shown on the landing page</div></div>
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
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No offers</td></tr>
                  : rows.map(o => (
                    <tr key={o.id}>
                      <td>{o.image_url && <img className="img-thumb" src={o.image_url} alt="" />}</td>
                      <td style={{ fontWeight: 600 }}>{o.title}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{o.code || '—'}</td>
                      <td>{o.display_order}</td>
                      <td><span className={`badge ${o.is_active ? 'badge-success' : 'badge-neutral'}`}>{o.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td><div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}><Edit2 size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(o)}><Trash2 size={14} /></button>
                      </div></td>
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
            <div className="modal-header"><h3>{editing ? 'Edit Offer' : 'Add Offer'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Title *</label><input className="input" value={form.title} onChange={e => upd('title', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => upd('description', e.target.value)} /></div>
                <div className="form-group"><label className="label">Coupon Code</label><input className="input" value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())} /></div>
                <ImageUpload label="Image" value={form.image_url || ''} onChange={v => upd('image_url', v)} />
                <div className="form-grid">
                  <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => upd('display_order', +e.target.value)} /></div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} /> Active</label></div>
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
      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => remove(confirmDelete)} variant="danger" title="Delete Offer?" message={`"${confirmDelete?.title}" will be removed from the landing page.`} confirmLabel="Delete" />
    </div>
  )
}
