import { useState } from 'react'
import { WHITE_LABELS, ADMIN_THEMES } from '../lib/mockData'
import { formatDate } from '../lib/format'
import { Search, Eye, Palette, Check, X, Globe, Building2 } from 'lucide-react'

export default function WhiteLabel() {
  const [rows, setRows] = useState(WHITE_LABELS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = rows.filter(w =>
    w.owner_name.toLowerCase().includes(search.toLowerCase()) ||
    w.brand_name.toLowerCase().includes(search.toLowerCase()) ||
    w.owner_email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAccess = (w) =>
    setRows(prev => prev.map(r => r.id === w.id ? { ...r, portal_access: !r.portal_access } : r))

  const updateConfig = (w, updates) => {
    setRows(prev => prev.map(r => r.id === w.id ? { ...r, ...updates } : r))
    setSelected(prev => prev?.id === w.id ? { ...prev, ...updates } : prev)
  }

  const activeCount = rows.filter(r => r.portal_access).length
  const landingCount = rows.filter(r => r.landing_page_enabled).length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">White Labeling</div>
          <div className="page-subtitle">Configure portal access and branding for each hotel partner</div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{rows.length}</div><div className="stat-label">Total Partners</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{activeCount}</div><div className="stat-label">Portal Access Enabled</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--warning)' }}>{landingCount}</div><div className="stat-label">Landing Pages Active</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by partner or brand..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Partner</th><th>Brand Name</th><th>Theme</th><th>Portal Access</th><th>Landing Page</th><th>Configured</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No partners found</td></tr>
                : filtered.map(w => (
                  <tr key={w.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{w.owner_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.owner_email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 32, height: 32, borderRadius: 'var(--radius)', background: (ADMIN_THEMES[w.theme] || ADMIN_THEMES.emerald).gradient, color: '#fff', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{w.logo_text}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{w.brand_name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{w.brand_tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ background: (ADMIN_THEMES[w.theme] || ADMIN_THEMES.emerald).primary + '15', color: (ADMIN_THEMES[w.theme] || ADMIN_THEMES.emerald).primary }}>
                        {(ADMIN_THEMES[w.theme] || ADMIN_THEMES.emerald).name}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${w.portal_access ? 'badge-success' : 'badge-error'}`}>
                        {w.portal_access ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${w.landing_page_enabled ? 'badge-success' : 'badge-neutral'}`}>
                        {w.landing_page_enabled ? 'Active' : 'Off'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{formatDate(w.configured_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(w)}><Eye size={14} /></button>
                        <button className={`btn btn-sm ${w.portal_access ? 'btn-secondary' : 'btn-success'}`} onClick={() => toggleAccess(w)}>
                          {w.portal_access ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>White Label Configuration</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Partner info */}
              <div className="card" style={{ padding: 16, marginBottom: 20, background: 'var(--bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Building2 size={16} color="var(--text-secondary)" />
                  <span style={{ fontWeight: 700 }}>{selected.owner_name}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selected.owner_email}</div>
              </div>

              {/* Access controls */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ marginBottom: 12 }}>Access Control</h4>
                <div className="detail-row" style={{ alignItems: 'center' }}>
                  <div className="detail-label">Portal Access</div>
                  <div className="detail-value">
                    <div className={`toggle ${selected.portal_access ? 'active' : ''}`} onClick={() => updateConfig(selected, { portal_access: !selected.portal_access })} />
                  </div>
                </div>
                <div className="detail-row" style={{ alignItems: 'center' }}>
                  <div className="detail-label">Landing Page</div>
                  <div className="detail-value">
                    <div className={`toggle ${selected.landing_page_enabled ? 'active' : ''}`} onClick={() => updateConfig(selected, { landing_page_enabled: !selected.landing_page_enabled })} />
                  </div>
                </div>
                {selected.landing_page_enabled && (
                  <div className="form-group" style={{ marginTop: 12 }}>
                    <label className="label">Landing Page Theme</label>
                    <select className="input" value={selected.landing_page_theme} onChange={e => updateConfig(selected, { landing_page_theme: e.target.value })}>
                      {Object.values(ADMIN_THEMES).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 4 }} />Custom Domain (optional)</label>
                  <input className="input" value={selected.custom_domain} onChange={e => updateConfig(selected, { custom_domain: e.target.value })} placeholder="grandpalace.stayfinder.com" />
                </div>
              </div>

              {/* Branding */}
              <div>
                <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Palette size={16} /> Branding</h4>
                <div className="form-group"><label className="label">Brand Name</label><input className="input" value={selected.brand_name} onChange={e => updateConfig(selected, { brand_name: e.target.value })} /></div>
                <div className="form-group"><label className="label">Brand Tagline</label><input className="input" value={selected.brand_tagline} onChange={e => updateConfig(selected, { brand_tagline: e.target.value })} /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Logo Text</label><input className="input" maxLength={3} value={selected.logo_text} onChange={e => updateConfig(selected, { logo_text: e.target.value.toUpperCase() })} /></div>
                  <div className="form-group"><label className="label">Logo URL (optional)</label><input className="input" value={selected.logo_url} onChange={e => updateConfig(selected, { logo_url: e.target.value })} /></div>
                </div>
                <div className="form-group">
                  <label className="label">Dashboard Theme</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {Object.values(ADMIN_THEMES).map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateConfig(selected, { theme: t.id })}
                        style={{
                          flex: 1, padding: '12px 16px', borderRadius: 'var(--radius)',
                          border: selected.theme === t.id ? `2px solid ${t.primary}` : '2px solid var(--border)',
                          background: selected.theme === t.id ? t.primary + '10' : 'var(--surface)',
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ width: 24, height: 24, borderRadius: '50%', background: t.gradient, display: 'inline-block' }} />
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</span>
                        </div>
                        {selected.theme === t.id && <div style={{ fontSize: '0.7rem', color: t.primary, fontWeight: 600 }}>Active</div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-primary btn-sm" onClick={() => setSelected(null)}><Check size={14} /> Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
