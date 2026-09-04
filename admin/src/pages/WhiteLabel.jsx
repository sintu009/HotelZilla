import { useState, useEffect } from 'react'
import { hotelsApi, whiteLabelApi, uploadImage } from '../lib/api'
import { useToast } from '../components/Toast'
import { Save, Eye, EyeOff, RefreshCw, Globe, Palette, ImagePlus, User, Lock, ChevronDown, ExternalLink, Copy, CheckCheck } from 'lucide-react'

const THEMES = [
  { id: 'emerald', name: 'Emerald', primary: '#1a9981', gradient: 'linear-gradient(135deg,#1a9981,#0d6e5a)' },
  { id: 'ocean',   name: 'Ocean',   primary: '#0284c7', gradient: 'linear-gradient(135deg,#0284c7,#0369a1)' },
  { id: 'rose',    name: 'Rose',    primary: '#e11d48', gradient: 'linear-gradient(135deg,#e11d48,#be123c)' },
  { id: 'amber',   name: 'Amber',   primary: '#d97706', gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  { id: 'violet',  name: 'Violet',  primary: '#7c3aed', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
]

const EMPTY = {
  brand_name: '', brand_tagline: '', logo_text: '', logo_url: '', theme: 'emerald',
  cover_image: '', contact_email: '', contact_phone: '', landing_page_enabled: false,
  description: '', address: '', city: '', amenities: [],
  hero_heading: '', hero_subheading: '',
  feature1_title: '', feature1_desc: '',
  feature2_title: '', feature2_desc: '',
  feature3_title: '', feature3_desc: '',
  feature4_title: '', feature4_desc: '',
  cta_heading: '', cta_subheading: '',
  footer_tagline: '',
}


export default function WhiteLabel() {
  const toast = useToast()
  const [hotels, setHotels]         = useState([])
  const [hotelId, setHotelId]       = useState('')
  const [hotel, setHotel]           = useState(null)
  const [form, setForm]             = useState({ ...EMPTY })
  const [tab, setTab]               = useState('branding')
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState('')
  const [password, setPassword]     = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [savingPw, setSavingPw]     = useState(false)
  const [loadingHotel, setLoadingHotel] = useState(false)

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Load all hotels for dropdown
  useEffect(() => {
    hotelsApi.list(1, 100)
      .then(res => setHotels(res.data || []))
      .catch(() => {})
  }, [])

  // Load selected hotel config
  useEffect(() => {
    if (!hotelId) { setHotel(null); setForm({ ...EMPTY }); return }
    setLoadingHotel(true)
    hotelsApi.getById(hotelId)
      .then(h => {
        setHotel(h)
        setForm({
          brand_name:          h.brand_name          || h.name || '',
          brand_tagline:       h.brand_tagline        || '',
          logo_text:           h.logo_text            || (h.name || '').slice(0, 2).toUpperCase(),
          logo_url:            h.logo_url             || '',
          theme:               h.theme                || 'emerald',
          cover_image:         h.cover_image          || (h.images || [])[0] || '',
          contact_email:       h.contact_email        || '',
          contact_phone:       h.contact_phone        || '',
          landing_page_enabled: h.landing_page_enabled || false,
          description:         h.description          || '',
          address:             h.address              || '',
          city:                h.city                 || '',
          amenities:           h.amenities            || [],
          hero_heading:        h.hero_heading         || h.name || '',
          hero_subheading:     h.hero_subheading      || '',
          feature1_title:      h.feature1_title       || 'Premium Quality',
          feature1_desc:       h.feature1_desc        || 'Carefully curated rooms with top-tier amenities.',
          feature2_title:      h.feature2_title       || 'Best Price Guarantee',
          feature2_desc:       h.feature2_desc        || 'Book directly and get the best available rates.',
          feature3_title:      h.feature3_title       || '24/7 Support',
          feature3_desc:       h.feature3_desc        || 'Our team is available around the clock.',
          feature4_title:      h.feature4_title       || 'Instant Confirmation',
          feature4_desc:       h.feature4_desc        || 'Receive your booking confirmation immediately.',
          cta_heading:         h.cta_heading          || 'Ready for an Unforgettable Stay?',
          cta_subheading:      h.cta_subheading       || 'Book directly and enjoy exclusive rates.',
          footer_tagline:      h.footer_tagline       || 'Experience luxury and comfort at its finest.',
        })
      })
      .catch(() => toast.error('Error', 'Failed to load hotel'))
      .finally(() => setLoadingHotel(false))
  }, [hotelId])


  const handleSave = async () => {
    if (!hotelId) return
    setSaving(true)
    try {
      await whiteLabelApi.save(hotelId, {
        ...form,
        name: hotel.name,
        amenities: typeof form.amenities === 'string'
          ? form.amenities.split(',').map(s => s.trim()).filter(Boolean)
          : form.amenities,
      })
      toast.success('Saved', 'White label configuration updated.')
    } catch (err) { toast.error('Error', err.message) }
    finally { setSaving(false) }
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(field)
    try {
      const url = await uploadImage(file)
      upd(field, url)
      toast.success('Uploaded', 'Image uploaded successfully.')
    } catch (err) { toast.error('Upload failed', err.message) }
    finally { setUploading(''); e.target.value = '' }
  }

  const handleSavePassword = async () => {
    if (!hotel?.owner_id) { toast.error('Error', 'No owner linked to this hotel'); return }
    if (!password || password.length < 6) { toast.error('Error', 'Password must be at least 6 characters'); return }
    setSavingPw(true)
    try {
      await whiteLabelApi.setPartnerPassword(hotel.owner_id, password)
      toast.success('Password Updated', 'Partner can now login with the new password.')
      setPassword('')
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingPw(false) }
  }

  const selectedTheme = THEMES.find(t => t.id === form.theme) || THEMES[0]
  const PARTNER_URL = `http://localhost:5174/?hotel=${hotelId}`

  const [copied, setCopied] = useState(false)
  const copyLink = () => {
    navigator.clipboard.writeText(PARTNER_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }


  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">White Labeling</div>
          <div className="page-subtitle">Select a hotel to configure its landing page, branding and partner credentials</div>
        </div>
        {hotel && (
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner" /> : <><Save size={14} /> Save All Changes</>}
          </button>
        )}
      </div>

      {/* Hotel selector */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <label className="label" style={{ marginBottom: 8, display: 'block' }}>Select Hotel to Configure</label>
        <div style={{ position: 'relative', maxWidth: 480 }}>
          <select
            className="input"
            value={hotelId}
            onChange={e => setHotelId(e.target.value)}
            style={{ paddingRight: 36, appearance: 'none' }}
          >
            <option value="">— Choose a hotel —</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} · {h.city} [{h.status}]
              </option>
            ))}
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} />
        </div>
      </div>

      {!hotel && !loadingHotel && (
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          <Globe size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No hotel selected</div>
          <div style={{ fontSize: '0.85rem' }}>Select a hotel above to configure its white-label landing page</div>
        </div>
      )}

      {loadingHotel && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span className="spinner" />
        </div>
      )}


      {hotel && !loadingHotel && (
        <>
          {/* Hotel info banner */}
          <div className="card" style={{ padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: selectedTheme.gradient, color: '#fff', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {form.logo_text || hotel.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{form.brand_name || hotel.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{form.brand_tagline || 'No tagline set'} · {hotel.city}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${hotel.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{hotel.status}</span>
              <span className={`badge ${form.landing_page_enabled ? 'badge-success' : 'badge-neutral'}`}>
                {form.landing_page_enabled ? 'Landing Page ON' : 'Landing Page OFF'}
              </span>
            </div>
          </div>

          {/* Live website link banner */}
          {form.landing_page_enabled ? (
            <div className="card" style={{ padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, background: '#f0fdf4', border: '1px solid #86efac' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0, boxShadow: '0 0 0 3px #bbf7d0' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700, marginBottom: 2 }}>LIVE — Landing page is active</div>
                <a href={PARTNER_URL} target="_blank" rel="noreferrer"
                  style={{ fontSize: '0.88rem', color: '#166534', fontFamily: 'monospace', textDecoration: 'none', fontWeight: 600 }}>
                  {PARTNER_URL}
                </a>
              </div>
              <button className="btn btn-sm" onClick={copyLink}
                style={{ background: copied ? '#dcfce7' : 'white', border: '1px solid #86efac', color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
                {copied ? <><CheckCheck size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
              </button>
              <a href={PARTNER_URL} target="_blank" rel="noreferrer" className="btn btn-sm"
                style={{ background: '#16a34a', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <ExternalLink size={13} /> Open Site
              </a>
            </div>
          ) : (
            <div className="card" style={{ padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, background: '#fafafa', border: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9ca3af', flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Landing page is <strong>disabled</strong>. Enable it in the <strong>Branding & Theme</strong> tab to make the site live.
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            {[
              ['branding',    'Branding & Theme'],
              ['hero',        'Hero Section'],
              ['features',    'Features Section'],
              ['cta',         'CTA & Footer'],
              ['credentials', 'Partner Credentials'],
            ].map(([key, label]) => (
              <button key={key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>


          {/* ── BRANDING TAB ── */}
          {tab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Palette size={16} /> Brand Identity</h3>
                <div className="form-group"><label className="label">Brand Name</label>
                  <input className="input" value={form.brand_name} onChange={e => upd('brand_name', e.target.value)} placeholder={hotel.name} /></div>
                <div className="form-group"><label className="label">Brand Tagline</label>
                  <input className="input" value={form.brand_tagline} onChange={e => upd('brand_tagline', e.target.value)} placeholder="e.g. Luxury Redefined" /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Logo Text (2-3 letters)</label>
                    <input className="input" maxLength={3} value={form.logo_text} onChange={e => upd('logo_text', e.target.value.toUpperCase())} /></div>
                  <div className="form-group"><label className="label">Logo URL (optional)</label>
                    <input className="input" value={form.logo_url} onChange={e => upd('logo_url', e.target.value)} placeholder="https://..." /></div>
                </div>
                <div className="form-group"><label className="label">Support Email</label>
                  <input className="input" type="email" value={form.contact_email} onChange={e => upd('contact_email', e.target.value)} /></div>
                <div className="form-group"><label className="label">Support Phone</label>
                  <input className="input" value={form.contact_phone} onChange={e => upd('contact_phone', e.target.value)} /></div>
                <div className="form-group"><label className="label">Footer Tagline</label>
                  <input className="input" value={form.footer_tagline} onChange={e => upd('footer_tagline', e.target.value)} /></div>
                <div className="form-group">
                  <label className="label">Enable Landing Page</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <div className={`toggle ${form.landing_page_enabled ? 'active' : ''}`} onClick={() => upd('landing_page_enabled', !form.landing_page_enabled)} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{form.landing_page_enabled ? 'Landing page is live' : 'Landing page is hidden'}</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Theme Color</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {THEMES.map(t => (
                    <button key={t.id} type="button" onClick={() => upd('theme', t.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--radius)', border: form.theme === t.id ? `2px solid ${t.primary}` : '2px solid var(--border)', background: form.theme === t.id ? t.primary + '12' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: t.gradient, flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t.name}</span>
                      {form.theme === t.id && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: t.primary, fontWeight: 700 }}>Active</span>}
                    </button>
                  ))}
                </div>

                <h3 style={{ marginBottom: 12 }}>Cover Image</h3>
                {form.cover_image && (
                  <img src={form.cover_image} alt="cover" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 10 }}
                    onError={e => { e.target.style.display = 'none' }} />
                )}
                <div className="form-group"><label className="label">Cover Image URL</label>
                  <input className="input" value={form.cover_image} onChange={e => upd('cover_image', e.target.value)} placeholder="https://..." /></div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: uploading === 'cover_image' ? 'not-allowed' : 'pointer' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={!!uploading}
                    onChange={e => handleImageUpload(e, 'cover_image')} />
                  <span className="btn btn-secondary btn-sm">
                    {uploading === 'cover_image' ? <span className="spinner" /> : <><ImagePlus size={13} /> Upload Cover</>}
                  </span>
                </label>
              </div>
            </div>
          )}


          {/* ── HERO TAB ── */}
          {tab === 'hero' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Hero Section</h3>
              <div className="form-group"><label className="label">Hero Heading</label>
                <input className="input" value={form.hero_heading} onChange={e => upd('hero_heading', e.target.value)} placeholder="e.g. Welcome to Grand Palace" /></div>
              <div className="form-group"><label className="label">Hero Sub-heading</label>
                <input className="input" value={form.hero_subheading} onChange={e => upd('hero_subheading', e.target.value)} placeholder="e.g. Experience luxury like never before" /></div>
              <div className="form-group"><label className="label">Hotel Description</label>
                <textarea className="input" rows={4} value={form.description} onChange={e => upd('description', e.target.value)} placeholder="Full hotel description shown on landing page..." /></div>
              <div className="form-grid">
                <div className="form-group"><label className="label">City</label>
                  <input className="input" value={form.city} onChange={e => upd('city', e.target.value)} /></div>
                <div className="form-group"><label className="label">Address</label>
                  <input className="input" value={form.address} onChange={e => upd('address', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="label">Amenities (comma separated)</label>
                <input className="input" value={Array.isArray(form.amenities) ? form.amenities.join(', ') : form.amenities}
                  onChange={e => upd('amenities', e.target.value)} placeholder="Free WiFi, Pool, Spa, Restaurant..." /></div>

              <div style={{ marginTop: 20 }}>
                <h4 style={{ marginBottom: 12 }}>Hero Background Image</h4>
                {form.cover_image && (
                  <img src={form.cover_image} alt="hero" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 10 }}
                    onError={e => { e.target.style.display = 'none' }} />
                )}
                <div className="form-group"><label className="label">Image URL</label>
                  <input className="input" value={form.cover_image} onChange={e => upd('cover_image', e.target.value)} placeholder="https://..." /></div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: uploading === 'cover_image' ? 'not-allowed' : 'pointer' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={!!uploading}
                    onChange={e => handleImageUpload(e, 'cover_image')} />
                  <span className="btn btn-secondary btn-sm">
                    {uploading === 'cover_image' ? <span className="spinner" /> : <><ImagePlus size={13} /> Upload Image</>}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ── FEATURES TAB ── */}
          {tab === 'features' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 4 }}>Features / Why Choose Us Section</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>These 4 cards appear in the "Why Choose Us" section of the landing page.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="card" style={{ padding: 16, background: 'var(--bg)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10, color: 'var(--text-secondary)' }}>Feature {n}</div>
                    <div className="form-group"><label className="label">Title</label>
                      <input className="input" value={form[`feature${n}_title`]} onChange={e => upd(`feature${n}_title`, e.target.value)} /></div>
                    <div className="form-group"><label className="label">Description</label>
                      <textarea className="input" rows={2} value={form[`feature${n}_desc`]} onChange={e => upd(`feature${n}_desc`, e.target.value)} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA TAB ── */}
          {tab === 'cta' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>CTA Banner & Footer</h3>
              <div className="form-group"><label className="label">CTA Heading</label>
                <input className="input" value={form.cta_heading} onChange={e => upd('cta_heading', e.target.value)} placeholder="Ready for an Unforgettable Stay?" /></div>
              <div className="form-group"><label className="label">CTA Sub-heading</label>
                <input className="input" value={form.cta_subheading} onChange={e => upd('cta_subheading', e.target.value)} placeholder="Book directly and enjoy exclusive rates." /></div>
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>Footer</h4>
                <div className="form-group"><label className="label">Footer Tagline</label>
                  <input className="input" value={form.footer_tagline} onChange={e => upd('footer_tagline', e.target.value)} placeholder="Experience luxury and comfort at its finest." /></div>
                <div className="form-group"><label className="label">Support Email (shown in footer)</label>
                  <input className="input" type="email" value={form.contact_email} onChange={e => upd('contact_email', e.target.value)} /></div>
                <div className="form-group"><label className="label">Support Phone (shown in footer)</label>
                  <input className="input" value={form.contact_phone} onChange={e => upd('contact_phone', e.target.value)} /></div>
              </div>
            </div>
          )}


          {/* ── CREDENTIALS TAB ── */}
          {tab === 'credentials' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} /> Partner Account Info</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  The hotel partner uses these credentials to log in to their dashboard at <strong>/login</strong>.
                </p>
                {hotel.owner_id ? (
                  <div>
                    {[
                      ['Owner ID',   hotel.owner_id],
                      ['Owner Name', hotel.owner_name || '—'],
                      ['Email',      hotel.owner_email || '—'],
                      ['Hotel',      hotel.name],
                      ['Status',     hotel.status],
                    ].map(([l, v]) => (
                      <div key={l} className="detail-row">
                        <div className="detail-label">{l}</div>
                        <div className="detail-value" style={{ fontFamily: l === 'Email' ? 'monospace' : 'inherit' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No owner linked to this hotel. The hotel was created by admin without an owner account.
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={16} /> Set Partner Password</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  Set or reset the password for this hotel partner's dashboard login.
                </p>
                {hotel.owner_id ? (
                  <>
                    <div className="form-group">
                      <label className="label">Login Email</label>
                      <input className="input" value={hotel.owner_email || ''} readOnly style={{ background: 'var(--bg)', cursor: 'default' }} />
                    </div>
                    <div className="form-group">
                      <label className="label">New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="input"
                          type={showPw ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          style={{ paddingRight: 40 }}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          style={{ position: 'absolute', right: 10, top: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={handleSavePassword} disabled={savingPw || !password}>
                      {savingPw ? <span className="spinner" /> : <><RefreshCw size={13} /> Update Password</>}
                    </button>
                    <div style={{ marginTop: 16, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Partner Login URL:</strong><br />
                      <span style={{ fontFamily: 'monospace' }}>http://localhost:5174/login</span>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No owner account linked. Assign an owner to this hotel first.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save button bottom */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" /> : <><Save size={14} /> Save All Changes</>}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
