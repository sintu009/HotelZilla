import { useState } from 'react'
import { PAYMENTS } from '../lib/mockData'
import { formatPrice, formatDateTime } from '../lib/format'
import { Search } from 'lucide-react'

export default function Payments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = PAYMENTS.filter(p => {
    const ms = !search || p.transaction_id.toLowerCase().includes(search.toLowerCase()) || p.hotel_name.toLowerCase().includes(search.toLowerCase()) || p.customer_email.toLowerCase().includes(search.toLowerCase())
    const mst = !statusFilter || p.status === statusFilter
    return ms && mst
  })

  const totalPaid = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = PAYMENTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const totalRefunded = PAYMENTS.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Payments</div><div className="page-subtitle">{filtered.length} payment records</div></div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPaid)}</div><div className="stat-label">Total Paid</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPending)}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRefunded)}</div><div className="stat-label">Refunded</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by TXN ID, hotel, or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Transaction ID</th><th>Hotel</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payments found</td></tr>
                : filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.transaction_id}</td>
                    <td>{p.hotel_name}</td>
                    <td>{p.customer_email}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(p.amount)}</td>
                    <td><span className="badge badge-neutral">{p.method}</span></td>
                    <td><span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'refunded' ? 'badge-info' : p.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>{p.status}</span></td>
                    <td>{formatDateTime(p.payment_date)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
