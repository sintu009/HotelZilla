import { useState } from 'react'
import { SETTINGS } from '../lib/mockData'
import { Save } from 'lucide-react'

export default function Settings() {
  const [data, setData] = useState({ ...SETTINGS })
  const [saved, setSaved] = useState(false)

  const upd = (k, v) => setData(p => ({ ...p, [k]: v }))

  const save = (e) => {
    e.preventDefault()
    // When connected to Node.js/PostgreSQL: PUT /api/settings
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Settings</div><div className="page-subtitle">Platform configuration</div></div>
        <button className="btn btn-primary btn-sm" form="settings-form" type="submit"><Save size={14} /> Save</button>
      </div>

      {saved && <div className="badge badge-success" style={{ marginBottom: 16, display: 'inline-flex' }}>Settings saved!</div>}

      <form id="settings-form" onSubmit={save}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>General</h3>
            <div className="form-group"><label className="label">Platform Name</label><input className="input" value={data.platform_name} onChange={e => upd('platform_name', e.target.value)} /></div>
            <div className="form-group"><label className="label">Support Email</label><input className="input" type="email" value={data.support_email} onChange={e => upd('support_email', e.target.value)} /></div>
            <div className="form-group"><label className="label">Contact Phone</label><input className="input" value={data.contact_phone} onChange={e => upd('contact_phone', e.target.value)} /></div>
            <div className="form-group"><label className="label">Address</label><textarea className="input" rows={2} value={data.address} onChange={e => upd('address', e.target.value)} /></div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Financial</h3>
            <div className="form-grid">
              <div className="form-group"><label className="label">Currency</label><input className="input" value={data.currency} onChange={e => upd('currency', e.target.value)} /></div>
              <div className="form-group"><label className="label">Currency Symbol</label><input className="input" value={data.currency_symbol} onChange={e => upd('currency_symbol', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Default Commission Rate (%)</label><input className="input" type="number" value={data.default_commission_rate} onChange={e => upd('default_commission_rate', +e.target.value)} /></div>
            <div className="form-group"><label className="label">Tax Rate (%)</label><input className="input" type="number" value={data.tax_rate} onChange={e => upd('tax_rate', +e.target.value)} /></div>
          </div>
        </div>
      </form>
    </div>
  )
}
