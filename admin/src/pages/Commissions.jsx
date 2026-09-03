import { paymentsApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatPrice, formatDate } from '../lib/format'

export default function Commissions() {
  const { data, loading, error } = useFetch(() => paymentsApi.list(1, 200))
  const allRows = data?.data ?? []

  // Commission = 10% of each completed payment
  const rows = allRows
    .filter(p => p.status === 'completed' || p.status === 'refunded')
    .map(p => ({
      ...p,
      commission: parseFloat((parseFloat(p.amount || 0) * 0.1).toFixed(2)),
    }))

  const totalCommission = rows.reduce((s, r) => s + r.commission, 0)
  const completedCommission = rows.filter(r => r.status === 'completed').reduce((s, r) => s + r.commission, 0)
  const refundedCommission  = rows.filter(r => r.status === 'refunded').reduce((s, r) => s + r.commission, 0)

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Commissions</div><div className="page-subtitle">Platform commission tracking (10% per booking)</div></div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{formatPrice(totalCommission)}</div><div className="stat-label">Total Commission</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(completedCommission)}</div><div className="stat-label">From Completed</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(refundedCommission)}</div><div className="stat-label">From Refunded</div></div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Payment #</th><th>Booking</th><th>Customer</th><th>Booking Amount</th><th>Commission (10%)</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No commission data yet</td></tr>
                    : rows.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{r.id}</td>
                        <td>#{r.booking_ref || r.booking_id}</td>
                        <td>{r.customer_name}</td>
                        <td>{formatPrice(r.amount)}</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(r.commission)}</td>
                        <td><span className={`badge ${r.status === 'completed' ? 'badge-success' : 'badge-info'}`}>{r.status}</span></td>
                        <td>{formatDate(r.created_at)}</td>
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
