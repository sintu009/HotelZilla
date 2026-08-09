import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Save } from 'lucide-react'

export default function Settings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => { setData(data); setLoading(false) })
  }, [])

  const update = (k, v) => setData(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    await supabase.from('settings').upsert({ ...data, id: 1, updated_at: new Date().toISOString() })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!data) return <div className="empty-state"><h3>No settings</h3><button className="btn btn-primary" onClick={save}>Create Default</button></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Settings</div><div className="page-subtitle">Platform configuration</div></div>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? <span className="spinner" /> : <><Save size={14} /> Save</>}</button>
      </div>
      {saved && <div className="badge badge-success" style={{ marginBottom: 16 }}>Settings saved!</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>General</h3>
          <div className="form-group"><label className="label">Platform Name</label><input className="input" value={data.platform_name || ''} onChange={e => update('platform_name', e.target.value)} /></div>
          <div className="form-group"><label className="label">Support Email</label><input className="input" value={data.support_email || ''} onChange={e => update('support_email', e.target.value)} /></div>
          <div className="form-group"><label className="label">Contact Phone</label><input className="input" value={data.contact_phone || ''} onChange={e => update('contact_phone', e.target.value)} /></div>
          <div className="form-group"><label className="label">Address</label><input className="input" value={data.address || ''} onChange={e => update('address', e.target.value)} /></div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Financial</h3>
          <div className="form-grid">
            <div className="form-group"><label className="label">Currency</label><input className="input" value={data.currency || ''} onChange={e => update('currency', e.target.value)} /></div>
            <div className="form-group"><label className="label">Currency Symbol</label><input className="input" value={data.currency_symbol || ''} onChange={e => update('currency_symbol', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="label">Default Commission Rate (%)</label><input className="input" type="number" value={data.default_commission_rate || 0} onChange={e => update('default_commission_rate', +e.target.value)} /></div>
          <div className="form-group"><label className="label">Tax Rate (%)</label><input className="input" type="number" value={data.tax_rate || 0} onChange={e => update('tax_rate', +e.target.value)} /></div>
        </div>
      </div>
    </div>
  )
}
