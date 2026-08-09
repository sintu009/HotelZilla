import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, CreditCard as Edit2, Trash2, X, Save } from 'lucide-react'

export default function CMS() {
  const { section } = useParams()
  if (section === 'homepage') return <CMSHomepage />
  if (section === 'banners') return <CMSBanners />
  if (section === 'destinations') return <CMSDestinations />
  if (section === 'offers') return <CMSOffers />
  return <CMSHomepage />
}

function CMSHomepage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('cms_homepage').select('*').eq('id', 1).maybeSingle().then(({ data }) => { setData(data); setLoading(false) })
  }, [])

  const update = (k, v) => setData(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    await supabase.from('cms_homepage').upsert({ ...data, id: 1, updated_at: new Date().toISOString() })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!data) return <div className="empty-state"><h3>No homepage content</h3><button className="btn btn-primary" onClick={save}>Create Default</button></div>

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Homepage Content</div><div className="page-subtitle">Edit the landing page content</div></div>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? <span className="spinner" /> : <><Save size={14} /> Save</>}</button>
      </div>
      {saved && <div className="badge badge-success" style={{ marginBottom: 16 }}>Saved successfully!</div>}
      <div className="card" style={{ padding: 24, maxWidth: 700 }}>
        <div className="form-group"><label className="label">Hero Title</label><input className="input" value={data.hero_title || ''} onChange={e => update('hero_title', e.target.value)} /></div>
        <div className="form-group"><label className="label">Hero Subtitle</label><input className="input" value={data.hero_subtitle || ''} onChange={e => update('hero_subtitle', e.target.value)} /></div>
        <div className="form-group"><label className="label">Search Placeholder</label><input className="input" value={data.hero_search_placeholder || ''} onChange={e => update('hero_search_placeholder', e.target.value)} /></div>
        <div className="form-group"><label className="label">Feature Section Title</label><input className="input" value={data.feature_section_title || ''} onChange={e => update('feature_section_title', e.target.value)} /></div>
        <div className="form-grid">
          <div className="form-group"><label className="label">Hotels Stat</label><input className="input" value={data.stats_hotels || ''} onChange={e => update('stats_hotels', e.target.value)} /></div>
          <div className="form-group"><label className="label">Customers Stat</label><input className="input" value={data.stats_customers || ''} onChange={e => update('stats_customers', e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="label">Cities Stat</label><input className="input" value={data.stats_cities || ''} onChange={e => update('stats_cities', e.target.value)} /></div>
      </div>
    </div>
  )
}

function CMSBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', link_url: '', display_order: 0, is_active: true })

  const load = () => { supabase.from('cms_banners').select('*').order('display_order').then(({ data }) => { setBanners(data || []); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await supabase.from('cms_banners').update(form).eq('id', editing.id)
    else await supabase.from('cms_banners').insert(form)
    setShowForm(false); setEditing(null)
    setForm({ title: '', subtitle: '', image_url: '', link_url: '', display_order: 0, is_active: true })
    load()
  }
  const toggleActive = async (b) => { await supabase.from('cms_banners').update({ is_active: !b.is_active }).eq('id', b.id); load() }
  const deleteBanner = async (b) => { if (!confirm('Delete?')) return; await supabase.from('cms_banners').delete().eq('id', b.id); load() }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Banners</div><div className="page-subtitle">{banners.length} banner slides</div></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ title: '', subtitle: '', image_url: '', link_url: '', display_order: 0, is_active: true }); setShowForm(true) }}><Plus size={14} /> Add Banner</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Image</th><th>Title</th><th>Subtitle</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {banners.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No banners</td></tr> :
                banners.map(b => (
                  <tr key={b.id}>
                    <td>{b.image_url && <img className="img-thumb" src={b.image_url} alt="" />}</td>
                    <td style={{ fontWeight: 600 }}>{b.title}</td>
                    <td>{b.subtitle}</td>
                    <td>{b.display_order}</td>
                    <td><span className={`badge ${b.is_active ? 'badge-success' : 'badge-neutral'}`}>{b.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(b); setForm(b); setShowForm(true) }}><Edit2 size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(b)}>{b.is_active ? 'Hide' : 'Show'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteBanner(b)}><Trash2 size={14} /></button>
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
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="label">Title</label><input className="input" value={form.title} onChange={e => update('title', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Subtitle</label><input className="input" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} /></div>
                <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => update('image_url', e.target.value)} /></div>
                <div className="form-group"><label className="label">Link URL</label><input className="input" value={form.link_url} onChange={e => update('link_url', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => update('display_order', +e.target.value)} /></div>
                  <div className="form-group"><label className="label"><input type="checkbox" checked={form.is_active} onChange={e => update('is_active', e.target.checked)} /> Active</label></div>
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

function CMSDestinations() {
  const [dests, setDests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', country: 'India', image_url: '', hotel_count: 0, display_order: 0, is_active: true })

  const load = () => { supabase.from('cms_destinations').select('*').order('display_order').then(({ data }) => { setDests(data || []); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await supabase.from('cms_destinations').update(form).eq('id', editing.id)
    else await supabase.from('cms_destinations').insert(form)
    setShowForm(false); setEditing(null)
    setForm({ name: '', country: 'India', image_url: '', hotel_count: 0, display_order: 0, is_active: true })
    load()
  }
  const toggleActive = async (d) => { await supabase.from('cms_destinations').update({ is_active: !d.is_active }).eq('id', d.id); load() }
  const deleteDest = async (d) => { if (!confirm('Delete?')) return; await supabase.from('cms_destinations').delete().eq('id', d.id); load() }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Destinations</div><div className="page-subtitle">{dests.length} featured destinations</div></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ name: '', country: 'India', image_url: '', hotel_count: 0, display_order: 0, is_active: true }); setShowForm(true) }}><Plus size={14} /> Add Destination</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Image</th><th>Name</th><th>Country</th><th>Hotels</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {dests.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No destinations</td></tr> :
                dests.map(d => (
                  <tr key={d.id}>
                    <td>{d.image_url && <img className="img-thumb" src={d.image_url} alt="" />}</td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.country}</td>
                    <td>{d.hotel_count}+</td>
                    <td>{d.display_order}</td>
                    <td><span className={`badge ${d.is_active ? 'badge-success' : 'badge-neutral'}`}>{d.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(d); setForm(d); setShowForm(true) }}><Edit2 size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(d)}>{d.is_active ? 'Hide' : 'Show'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteDest(d)}><Trash2 size={14} /></button>
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
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="label">Name *</label><input className="input" value={form.name} onChange={e => update('name', e.target.value)} required /></div>
                <div className="form-group"><label className="label">Country</label><input className="input" value={form.country} onChange={e => update('country', e.target.value)} /></div>
                <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => update('image_url', e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Hotel Count</label><input className="input" type="number" value={form.hotel_count} onChange={e => update('hotel_count', +e.target.value)} /></div>
                  <div className="form-group"><label className="label">Display Order</label><input className="input" type="number" value={form.display_order} onChange={e => update('display_order', +e.target.value)} /></div>
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

function CMSOffers() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('cms_offers_content').select('*').eq('id', 1).maybeSingle().then(({ data }) => { setData(data); setLoading(false) })
  }, [])

  const update = (k, v) => setData(p => ({ ...p, [k]: v }))
  const save = async () => {
    setSaving(true)
    await supabase.from('cms_offers_content').upsert({ ...data, id: 1, updated_at: new Date().toISOString() })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!data) return <div className="empty-state"><h3>No offers content</h3><button className="btn btn-primary" onClick={save}>Create Default</button></div>

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Offers Section</div><div className="page-subtitle">Edit the offers section content</div></div>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? <span className="spinner" /> : <><Save size={14} /> Save</>}</button>
      </div>
      {saved && <div className="badge badge-success" style={{ marginBottom: 16 }}>Saved!</div>}
      <div className="card" style={{ padding: 24, maxWidth: 600 }}>
        <div className="form-group"><label className="label">Section Title</label><input className="input" value={data.section_title || ''} onChange={e => update('section_title', e.target.value)} /></div>
        <div className="form-group"><label className="label">Section Subtitle</label><input className="input" value={data.section_subtitle || ''} onChange={e => update('section_subtitle', e.target.value)} /></div>
      </div>
    </div>
  )
}
