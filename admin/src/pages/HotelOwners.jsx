import { useState } from 'react'
import { HOTEL_OWNERS } from '../lib/mockData'
import { formatDate } from '../lib/format'
import { Search, Ban, CircleCheck as CheckCircle, Eye } from 'lucide-react'

export default function HotelOwners() {
  const [rows, setRows] = useState(HOTEL_OWNERS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = rows.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = (u) =>
    setRows(prev => prev.map(r => r.id === u.id ? { ...r, status: r.status === 'active' ? 'suspended' : 'active' } : r))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hotel Owners</div>
          <div className="page-subtitle">{rows.length} registered hotel owners</div>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search hotel owners..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Hotels</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotel owners found</td></tr>
                : filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className="badge badge-info" style={{ marginRight: 4 }}>{u.hotels_count} total</span>
                      <span className="badge badge-success">{u.approved} approved</span>
                    </td>
                    <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>{u.status}</span></td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(u)}><Eye size={14} /></button>
                        <button className={`btn btn-sm ${u.status === 'active' ? 'btn-secondary' : 'btn-success'}`} onClick={() => toggleStatus(u)}>
                          {u.status === 'active' ? <><Ban size={12} /> Suspend</> : <><CheckCircle size={12} /> Activate</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Hotel Owner Details</h3><button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button></div>
            <div className="modal-body">
              {[['Name', selected.full_name], ['Email', selected.email], ['Phone', selected.phone], ['Status', selected.status], ['Hotels', `${selected.hotels_count} total (${selected.approved} approved, ${selected.pending} pending)`], ['Joined', formatDate(selected.created_at)]].map(([l, v]) => (
                <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
