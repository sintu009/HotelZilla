import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/format'
import { Search, Ban, CircleCheck as CheckCircle, Eye, Building2 } from 'lucide-react'

export default function HotelOwners() {
  const [users, setUsers] = useState([])
  const [hotelCounts, setHotelCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('role', 'hotel_owner').order('created_at', { ascending: false }),
      supabase.from('hotels').select('owner_id, id, status'),
    ]).then(([u, h]) => {
      setUsers(u.data || [])
      const counts = {}
      ;(h.data || []).forEach(hotel => {
        if (!counts[hotel.owner_id]) counts[hotel.owner_id] = { total: 0, approved: 0, pending: 0 }
        counts[hotel.owner_id].total++
        if (hotel.status === 'approved') counts[hotel.owner_id].approved++
        if (hotel.status === 'pending') counts[hotel.owner_id].pending++
      })
      setHotelCounts(counts)
      setLoading(false)
    })
  }, [])

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hotel Owners</div>
          <div className="page-subtitle">{users.length} registered hotel owners</div>
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
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Hotels</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotel owners found</td></tr>
              ) : filtered.map(u => {
                const c = hotelCounts[u.id] || { total: 0, approved: 0, pending: 0 }
                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.full_name || '—'}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className="badge badge-info">{c.total} total</span>{' '}
                      <span className="badge badge-success">{c.approved} approved</span>
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hotel Owner Details</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><div className="detail-label">Name</div><div className="detail-value">{selected.full_name || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Email</div><div className="detail-value">{selected.email}</div></div>
              <div className="detail-row"><div className="detail-label">Phone</div><div className="detail-value">{selected.phone || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Status</div><div className="detail-value">{selected.status}</div></div>
              <div className="detail-row"><div className="detail-label">Hotels</div><div className="detail-value">{hotelCounts[selected.id]?.total || 0} total ({hotelCounts[selected.id]?.approved || 0} approved)</div></div>
              <div className="detail-row"><div className="detail-label">Joined</div><div className="detail-value">{formatDate(selected.created_at)}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
