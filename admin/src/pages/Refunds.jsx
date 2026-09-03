import { paymentsApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatPrice, formatDate } from '../lib/format'

export default function Refunds() {
  const { data, loading, error } = useFetch(() => paymentsApi.list(1, 100))
  const allRows = data?.data ?? []
  const rows = allRows.filter(p => p.status === 'refunded')

  const total   = rows.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const pending = allRows.filter(p => p.status === 'pending').reduce((s, p) => s + parseFloat(p.amount || 0), 0)

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Refunds</div><div className="page-subtitle">{rows.length} refund records</div></div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{formatPrice(total)}</div><div className="stat-label">Total Refunded</div></div>
        <div className="stat-card"><div className="stat-value">{rows.length}</div><div className="stat-label">Refund Count</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(pending)}</div><div className="stat-label">Pending Payments</div></div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>#ID</th><th>Booking</th><th>Customer</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No refunds yet</td></tr>
                    : rows.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{p.id}</td>
                        <td>#{p.booking_ref || p.booking_id}</td>
                        <td>{p.customer_name}</td>
                        <td style={{ fontWeight: 600 }}>{formatPrice(p.amount)}</td>
                        <td><span className="badge badge-neutral">{p.method || '—'}</span></td>
                        <td>{formatDate(p.created_at)}</td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
