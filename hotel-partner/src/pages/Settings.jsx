import { useState } from 'react'
import { PARTNER } from '../lib/mockData'
import { Save } from 'lucide-react'

export default function Settings() {
  const [data, setData] = useState({ ...PARTNER })
  const [saved, setSaved] = useState(false)
  const upd = (k, v) => setData(p => ({ ...p, [k]: v }))

  const save = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Settings</div><div className="page-subtitle">Manage your partner profile</div></div>
        <button className="btn btn-primary btn-sm" form="settings-form" type="submit"><Save size={14} /> Save Changes</button>
      </div>

      {saved && <div className="badge badge-success" style={{ marginBottom: 16, display: 'inline-flex' }}>Profile updated!</div>}

      <form id="settings-form" onSubmit={save}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Profile Information</h3>
            <div className="form-group"><label className="label">Full Name</label><input className="input" value={data.name} onChange={e => upd('name', e.target.value)} /></div>
            <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={data.email} onChange={e => upd('email', e.target.value)} /></div>
            <div className="form-group"><label className="label">Phone</label><input className="input" value={data.phone} onChange={e => upd('phone', e.target.value)} /></div>
            <div className="form-group"><label className="label">Company</label><input className="input" value={data.company} onChange={e => upd('company', e.target.value)} /></div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Account Details</h3>
            <div className="detail-row"><div className="detail-label">Partner Since</div><div className="detail-value">{new Date(data.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
            <div className="detail-row"><div className="detail-label">Account Type</div><div className="detail-value">Hotel Owner</div></div>
            <div className="detail-row"><div className="detail-label">Status</div><div className="detail-value"><span className="badge badge-success">Active</span></div></div>
            <div className="detail-row"><div className="detail-label">Commission Rate</div><div className="detail-value">10%</div></div>
            <div className="detail-row"><div className="detail-label">Payout Schedule</div><div className="detail-value">Monthly</div></div>
          </div>
        </div>
      </form>
    </div>
  )
}
