import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/format'
import { Search, Ban, CircleCheck as CheckCircle, Eye } from 'lucide-react'

export default function Customers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
    if (selected?.id === user.id) setSelected({ ...user, status: newStatus })
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Customers</div>
          <div className="page-subtitle">{users.length} registered customers</div>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customers found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.full_name || '—'}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
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
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><div className="detail-label">Name</div><div className="detail-value">{selected.full_name || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Email</div><div className="detail-value">{selected.email}</div></div>
              <div className="detail-row"><div className="detail-label">Phone</div><div className="detail-value">{selected.phone || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Role</div><div className="detail-value">{selected.role}</div></div>
              <div className="detail-row"><div className="detail-label">Status</div><div className="detail-value">{selected.status}</div></div>
              <div className="detail-row"><div className="detail-label">Joined</div><div className="detail-value">{formatDate(selected.created_at)}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
