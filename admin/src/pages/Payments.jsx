import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDateTime } from '../lib/format'
import { Search } from 'lucide-react'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    supabase.from('payments').select('*, bookings(booking_reference, hotels(name)), profiles!payments_customer_id_fkey(email)').order('created_at', { ascending: false })
      .then(({ data }) => { setPayments(data || []); setLoading(false) })
  }, [])

  const filtered = payments.filter(p => {
    const matchSearch = !search || p.transaction_id?.toLowerCase().includes(search.toLowerCase()) || p.bookings?.hotels?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Payments</div><div className="page-subtitle">{filtered.length} payment records</div></div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPaid)}</div><div className="stat-label">Total Paid</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPending)}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-value">{payments.filter(p => p.status === 'refunded').length}</div><div className="stat-label">Refunded</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by transaction or hotel..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Transaction ID</th><th>Hotel</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payments found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.transaction_id || '—'}</td>
                  <td>{p.bookings?.hotels?.name || '—'}</td>
                  <td>{p.profiles?.email || '—'}</td>
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
