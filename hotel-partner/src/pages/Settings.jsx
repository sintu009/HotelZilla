import { useState } from 'react'
import { PARTNER } from '../lib/mockData'
import { WHITE_LABEL, applyWhiteLabel } from '../lib/whiteLabel'
import { THEMES } from '../lib/themes'
import { Save, Palette, Building2, Globe } from 'lucide-react'
import Toast from '../components/Toast'

export default function Settings() {
  const [profile, setProfile] = useState({ ...PARTNER })
  const [branding, setBranding] = useState({ ...WHITE_LABEL })
  const [toast, setToast] = useState(null)

  const updProfile = (k, v) => setProfile(p => ({ ...p, [k]: v }))
  const updBranding = (k, v) => setBranding(p => ({ ...p, [k]: v }))

  const saveProfile = (e) => {
    e.preventDefault()
    setToast({ message: 'Profile updated!', type: 'success' })
  }

  const saveBranding = (e) => {
    e.preventDefault()
    applyWhiteLabel(branding)
    setToast({ message: 'Branding applied! Theme changed live.', type: 'success' })
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div><div className="page-title">Settings</div><div className="page-subtitle">Manage your profile and portal branding</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Profile */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={18} /> Profile Information</h3>
          <form onSubmit={saveProfile}>
            <div className="form-group"><label className="label">Full Name</label><input className="input" value={profile.name} onChange={e => updProfile('name', e.target.value)} /></div>
            <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={profile.email} onChange={e => updProfile('email', e.target.value)} /></div>
            <div className="form-group"><label className="label">Phone</label><input className="input" value={profile.phone} onChange={e => updProfile('phone', e.target.value)} /></div>
            <div className="form-group"><label className="label">Company</label><input className="input" value={profile.company} onChange={e => updProfile('company', e.target.value)} /></div>
            <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Save Profile</button>
          </form>
        </div>

        {/* White-label branding */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Palette size={18} /> Portal Branding</h3>
          <form onSubmit={saveBranding}>
            <div className="form-group"><label className="label">Brand Name</label><input className="input" value={branding.brand_name} onChange={e => updBranding('brand_name', e.target.value)} /></div>
            <div className="form-group"><label className="label">Brand Tagline</label><input className="input" value={branding.brand_tagline} onChange={e => updBranding('brand_tagline', e.target.value)} /></div>
            <div className="form-grid">
              <div className="form-group"><label className="label">Logo Text (2 letters)</label><input className="input" maxLength={3} value={branding.logo_text} onChange={e => updBranding('logo_text', e.target.value.toUpperCase())} /></div>
              <div className="form-group"><label className="label">Logo URL (optional)</label><input className="input" value={branding.logo_url} onChange={e => updBranding('logo_url', e.target.value)} placeholder="https://..." /></div>
            </div>
            <div className="form-group">
              <label className="label">Theme</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {Object.values(THEMES).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updBranding('theme', t.id)}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 'var(--radius)',
                      border: branding.theme === t.id ? `2px solid ${t.colors.primary}` : '2px solid var(--border)',
                      background: branding.theme === t.id ? t.colors.primaryLight : 'var(--surface)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: t.colors.brandGradient, display: 'inline-block' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</span>
                    </div>
                    {branding.theme === t.id && <div style={{ fontSize: '0.7rem', color: t.colors.primaryDark, fontWeight: 600 }}>Active</div>}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Apply Branding</button>
          </form>
        </div>
      </div>

      {/* Account details */}
      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={18} /> Account & Access</h3>
        <div className="detail-row"><div className="detail-label">Partner Since</div><div className="detail-value">{new Date(profile.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
        <div className="detail-row"><div className="detail-label">Account Type</div><div className="detail-value">Hotel Owner</div></div>
        <div className="detail-row"><div className="detail-label">Portal Access</div><div className="detail-value"><span className="badge badge-success">Enabled</span></div></div>
        <div className="detail-row"><div className="detail-label">Commission Rate</div><div className="detail-value">10%</div></div>
        <div className="detail-row"><div className="detail-label">Payout Schedule</div><div className="detail-value">Monthly</div></div>
        <div className="detail-row"><div className="detail-label">Landing Page</div><div className="detail-value"><span className="badge badge-neutral">Not Enabled</span> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact admin to enable</span></div></div>
      </div>
    </div>
  )
}
