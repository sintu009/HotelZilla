import { useState } from 'react'
import { paymentsApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatPrice, formatDate } from '../lib/format'
import { Search } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_BADGE = { completed: 'badge-success', refunded: 'badge-info', pending: 'badge-warning', failed: 'badge-error' }

export default function Payments() {
  const toast = useToast()
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmRefund, setConfirmRefund] = useState(null)
  const [acting, setActing]             = useState(false)

  const { data, loading, error, refetch } = useFetch(() => paymentsApi.list(1, 100))
  const allRows = data?.data ?? []

  const rows = allRows.filter(p => {
    const ms  = !search || String(p.id).includes(search) || p.customer_name?.toLowerCase().includes(search.toLowerCase())
    const mst = !statusFilter || p.status === statusFilter
    return ms && mst
  })

  const totalCompleted = allRows.filter(p => p.status === 'completed').reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const totalPending   = allRows.filter(p => p.status === 'pending').reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const totalRefunded  = allRows.filter(p => p.status === 'refunded').reduce((s, p) => s + parseFloat(p.amount || 0), 0)

  const processRefund = async (p) => {
    setActing(true)
    try {
      await paymentsApi.refund(p.id)
      toast.success('Refund Processed', `Payment #${p.id} has been refunded.`)
      refetch()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setActing(false)
      setConfirmRefund(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Payments</div><div className="page-subtitle">{rows.length} payment records</div></div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{formatPrice(totalCompleted)}</div><div className="stat-label">Total Completed</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPending)}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRefunded)}</div><div className="stat-label">Refunded</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>#ID</th><th>Booking</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={8} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payments found</td></tr>
                    : rows.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{p.id}</td>
                        <td>#{p.booking_ref || p.booking_id}</td>
                        <td>{p.customer_name}</td>
                        <td style={{ fontWeight: 600 }}>{formatPrice(p.amount)}</td>
                        <td><span className="badge badge-neutral">{p.method || '—'}</span></td>
                        <td><span className={`badge ${STATUS_BADGE[p.status] || 'badge-neutral'}`}>{p.status}</span></td>
                        <td>{formatDate(p.created_at)}</td>
                        <td>
                          {p.status === 'completed' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => setConfirmRefund(p)}>Refund</button>
                          )}
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmRefund}
        onClose={() => setConfirmRefund(null)}
        onConfirm={() => processRefund(confirmRefund)}
        loading={acting}
        variant="warning"
        title="Process Refund?"
        message={`Payment #${confirmRefund?.id} of ${formatPrice(confirmRefund?.amount)} will be refunded.`}
        confirmLabel="Yes, Refund"
      />
    </div>
  )
}
