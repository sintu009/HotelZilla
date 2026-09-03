import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownersApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatDate } from '../lib/format'
import { Search, Ban, CircleCheck as CheckCircle, Eye } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

export default function HotelOwners() {
  const toast = useToast()
  const navigate = useNavigate()
  const [search, setSearch]               = useState('')
  const [confirmToggle, setConfirmToggle] = useState(null)
  const [toggling, setToggling]           = useState(false)

  const { data, loading, error, refetch } = useFetch(() => ownersApi.list(1, 100))
  const rows = data?.data ?? []

  const filtered = rows.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = async (u) => {
    setToggling(true)
    try {
      await ownersApi.toggle(u.id)
      toast[u.is_active ? 'warning' : 'success'](
        u.is_active ? 'Owner Suspended' : 'Owner Activated',
        `${u.name}'s account has been ${u.is_active ? 'suspended' : 'activated'}.`
      )
      refetch()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setToggling(false)
      setConfirmToggle(null)
    }
  }

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
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotel owners found</td></tr>
                    : filtered.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-error'}`}>{u.is_active ? 'active' : 'suspended'}</span></td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/users/hotel-owners/${u.id}`)}><Eye size={14} /></button>
                            <button
                              className={`btn btn-sm ${u.is_active ? 'btn-secondary' : 'btn-success'}`}
                              onClick={() => setConfirmToggle(u)}
                            >
                              {u.is_active ? <><Ban size={12} /> Suspend</> : <><CheckCircle size={12} /> Activate</>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => toggleStatus(confirmToggle)}
        loading={toggling}
        variant={confirmToggle?.is_active ? 'warning' : 'info'}
        title={confirmToggle?.is_active ? 'Suspend Owner?' : 'Activate Owner?'}
        message={confirmToggle?.is_active ? `${confirmToggle?.name} and their hotels will be suspended.` : `${confirmToggle?.name}'s account will be restored.`}
        confirmLabel={confirmToggle?.is_active ? 'Suspend' : 'Activate'}
      />
    </div>
  )
}
