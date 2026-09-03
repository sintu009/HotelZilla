import { useState } from 'react'
import { customersApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatDate } from '../lib/format'
import { Search, Ban, CircleCheck as CheckCircle, Eye } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

export default function Customers() {
  const toast = useToast()
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState(null)
  const [confirmToggle, setConfirmToggle] = useState(null)
  const [toggling, setToggling]       = useState(false)

  const { data, loading, error, refetch } = useFetch(() => customersApi.list(1, 100))
  const rows = data?.data ?? []

  const filtered = rows.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = async (u) => {
    setToggling(true)
    try {
      await customersApi.toggle(u.id)
      toast[u.is_active ? 'warning' : 'success'](
        u.is_active ? 'Customer Suspended' : 'Customer Activated',
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
          <div className="page-title">Customers</div>
          <div className="page-subtitle">{rows.length} registered customers</div>
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
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customers found</td></tr>
                    : filtered.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-error'}`}>{u.is_active ? 'active' : 'suspended'}</span></td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(u)}><Eye size={14} /></button>
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

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Customer Details</h3><button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button></div>
            <div className="modal-body">
              {[['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone || '—'], ['Status', selected.is_active ? 'Active' : 'Suspended'], ['Joined', formatDate(selected.created_at)]].map(([l, v]) => (
                <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => toggleStatus(confirmToggle)}
        loading={toggling}
        variant={confirmToggle?.is_active ? 'warning' : 'info'}
        title={confirmToggle?.is_active ? 'Suspend Customer?' : 'Activate Customer?'}
        message={confirmToggle?.is_active ? `${confirmToggle?.name} will lose access to the platform.` : `${confirmToggle?.name}'s account will be restored.`}
        confirmLabel={confirmToggle?.is_active ? 'Suspend' : 'Activate'}
      />
    </div>
  )
}
