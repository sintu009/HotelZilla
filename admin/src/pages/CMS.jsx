import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CMS_HOMEPAGE, CMS_BANNERS, CMS_DESTINATIONS, CMS_OFFERS_CONTENT } from '../lib/mockData'
import { Plus, CreditCard as Edit2, Trash2, X, Save } from 'lucide-react'

export default function CMS() {
  const { section } = useParams()
  if (section === 'homepage')     return <CMSHomepage />
  if (section === 'banners')      return <CMSBanners />
  if (section === 'destinations') return <CMSDestinations />
  if (section === 'offers')       return <CMSOffersContent />
  return <CMSHomepage />
}

/* ---------- Homepage ---------- */
function CMSHomepage() {
  const [data, setData] = useState({ ...CMS_HOMEPAGE })
  const [saved, setSaved] = useState(false)
  const upd = (k, v) => setData(p => ({ ...p, [k]: v }))
  const save = (e) => {
    e.preventDefault()
    // When connected: PUT /api/cms/homepage
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Homepage Content</div><div className="page-subtitle">Edit the landing page text and stats</div></div>
        <button className="btn btn-primary btn-sm" form="hp-form" type="submit"><Save size={14} /> Save</button>
      </div>
      {saved && <div className="badge badge-success" style={{ marginBottom: 16, display: 'inline-flex' }}>Saved!</div>}
      <form id="hp-form" onSubmit={save}>
        <div className="card" style={{ padding: 24, maxWidth: 700 }}>
          <div className="form-group"><label className="label">Hero Title</label><input className="input" value={data.hero_title} onChange={e => upd('hero_title', e.target.value)} /></div>
          <div className="form-group"><label className="label">Hero Subtitle</label><input className="input" value={data.hero_subtitle} onChange={e => upd('hero_subtitle', e.target.value)} /></div>
          <div className="form-group"><label className="label">Search Placeholder</label><input className="input" value={data.hero_search_placeholder} onChange={e => upd('hero_search_placeholder', e.target.value)} /></div>
          <div className="form-group"><label className="label">Feature Section Title</label><input className="input" value={data.feature_section_title} onChange={e => upd('feature_section_title', e.target.value)} /></div>
          <div className="form-grid">
            <div className="form-group"><label className="label">Hotels Stat</label><input className="input" value={data.stats_hotels} onChange={e => upd('stats_hotels', e.target.value)} /></div>
            <div className="form-group"><label className="label">Customers Stat</label><input className="input" value={data.stats_customers} onChange={e => upd('stats_customers', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="label">Cities Stat</label><input className="input" value={data.stats_cities} onChange={e => upd('stats_cities', e.target.value)} /></div>
        </div>
      </form>
    </div>
  )
}

/* ---------- Banners ---------- */
let bnId = 100
const blankBanner = () => ({ title: '', subtitle: '', image_url: '', link_url: '', display_order: 0, is_active: true })

function CMSBanners() {
  const [rows, setRows] = useState([...CMS_BANNERS])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankBanner())
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const openAdd = () => { setEditing(null); setForm(blankBanner()); setShowForm(true) }
  const openEdit = (b) => { setEditing(b); setForm({ ...b }); setShowForm(true) }
  const save = (e) => {
    e.preventDefault()
    if (editing) setRows(prev => prev.map(r => r.id === editing.id ? { ...form, id: r.id } : r))
    else setRows(prev => [...prev, { ...form, id: `bn${++bnId}` }])
    setShowForm(false)
  }
  const toggleActive = (b) => setRows(prev => prev.map(r => r.id === b.id ? { ...r, is_active: !r.is_active } : r))
  const remove = (b) => setRows(prev => prev.filter(r => r.id !== b.id))

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Banners</div><div className="page-subtitle">{rows.length} banner slides</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Banner</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Image</th><th>Title</th><th>Subtitle</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No banners</td></tr>
                : rows.map(b => (
                  <tr key={b.id}>
                    <td>{b.image_url && <img className="img-thumb" src={b.image_url} alt="" />}</td>
                    <td style={{ fontWeight: 600 }}>{b.title}</td>
                    <td>{b.subtitle}</td>
                    <td>{b.display_order}</td>
                    <td><span className={`badge ${b.is_active ? 'badge-success' : 'badge-neutral'}`}>{b.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}><Edit2 size={14} /></button>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => toggleActive(b)}>{b.is_active ? 'Hide' : 'Show'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(b)}><Trash2 size={14} /></button>
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
            <div className="modal-header"><h3>{editing ? 'Edit Banner' : 'Add Banner'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Title *</label><input className="input" value={form.title} onChange={e => upd('title', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Subtitle</label><input className="input" value={form.subtitle} onChange={e => upd('subtitle', e.target.value)} /></div>
                <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => upd('image_url', e.target.value)} /></div>
                <div className="form-group"><label className="label">Link URL</label><input className="input" value={form.link_url} onChange={e => upd('link_url', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => upd('display_order', +e.target.value)} /></div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} /> Active</label></div>
                </div>
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

/* ---------- Destinations ---------- */
let dnId = 100
const blankDest = () => ({ name: '', country: 'India', image_url: '', hotel_count: 0, display_order: 0, is_active: true })

function CMSDestinations() {
  const [rows, setRows] = useState([...CMS_DESTINATIONS])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankDest())
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const openAdd = () => { setEditing(null); setForm(blankDest()); setShowForm(true) }
  const openEdit = (d) => { setEditing(d); setForm({ ...d }); setShowForm(true) }
  const save = (e) => {
    e.preventDefault()
    if (editing) setRows(prev => prev.map(r => r.id === editing.id ? { ...form, id: r.id } : r))
    else setRows(prev => [...prev, { ...form, id: `dn${++dnId}` }])
    setShowForm(false)
  }
  const toggleActive = (d) => setRows(prev => prev.map(r => r.id === d.id ? { ...r, is_active: !r.is_active } : r))
  const remove = (d) => setRows(prev => prev.filter(r => r.id !== d.id))

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Destinations</div><div className="page-subtitle">{rows.length} featured destinations</div></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Destination</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Image</th><th>Name</th><th>Country</th><th>Hotels</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.length === 0
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
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => toggleActive(d)}>{d.is_active ? 'Hide' : 'Show'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(d)}><Trash2 size={14} /></button>
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
            <div className="modal-header"><h3>{editing ? 'Edit Destination' : 'Add Destination'}</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <form onSubmit={save}>
                <div className="form-group"><label className="label">Name *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Country</label><input className="input" value={form.country} onChange={e => upd('country', e.target.value)} /></div>
                <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => upd('image_url', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Hotel Count</label><input className="input" type="number" value={form.hotel_count} onChange={e => upd('hotel_count', +e.target.value)} /></div>
                  <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => upd('display_order', +e.target.value)} /></div>
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

/* ---------- Offers Content ---------- */
function CMSOffersContent() {
  const [data, setData] = useState({ ...CMS_OFFERS_CONTENT })
  const [saved, setSaved] = useState(false)
  const upd = (k, v) => setData(p => ({ ...p, [k]: v }))
  const save = (e) => {
    e.preventDefault()
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Offers Section</div><div className="page-subtitle">Edit the offers section on the homepage</div></div>
        <button className="btn btn-primary btn-sm" form="oc-form" type="submit"><Save size={14} /> Save</button>
      </div>
      {saved && <div className="badge badge-success" style={{ marginBottom: 16, display: 'inline-flex' }}>Saved!</div>}
      <form id="oc-form" onSubmit={save}>
        <div className="card" style={{ padding: 24, maxWidth: 600 }}>
          <div className="form-group"><label className="label">Section Title</label><input className="input" value={data.section_title} onChange={e => upd('section_title', e.target.value)} /></div>
          <div className="form-group"><label className="label">Section Subtitle</label><input className="input" value={data.section_subtitle} onChange={e => upd('section_subtitle', e.target.value)} /></div>
        </div>
      </form>
    </div>
  )
}
