import { useState } from 'react'
import { COMMISSIONS } from '../lib/mockData'
import { formatPrice, formatDate } from '../lib/format'

export default function Commissions() {
  const [rows, setRows] = useState(COMMISSIONS)
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = statusFilter ? rows.filter(c => c.payout_status === statusFilter) : rows

  const updatePayout = (c, payout_status) =>
    setRows(prev => prev.map(x => x.id === c.id ? { ...x, payout_status, payout_date: payout_status === 'paid' ? new Date().toISOString() : x.payout_date } : x))

  const total = rows.reduce((s, c) => s + c.commission_amount, 0)
  const paid = rows.filter(c => c.payout_status === 'paid').reduce((s, c) => s + c.commission_amount, 0)
  const pending = rows.filter(c => c.payout_status === 'pending').reduce((s, c) => s + c.commission_amount, 0)

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Commissions</div><div className="page-subtitle">Platform commission tracking</div></div></div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{formatPrice(total)}</div><div className="stat-label">Total Commission</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(paid)}</div><div className="stat-label">Paid Out</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(pending)}</div><div className="stat-label">Pending Payout</div></div>
      </div>

      <div className="filter-bar">
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Booking Ref</th><th>Hotel</th><th>Booking Amount</th><th>Rate</th><th>Commission</th><th>Payout Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No commissions yet</td></tr>
                : filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.booking_reference}</td>
                    <td style={{ fontWeight: 600 }}>{c.hotel_name}</td>
                    <td>{formatPrice(c.booking_amount)}</td>
                    <td>{c.commission_rate}%</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(c.commission_amount)}</td>
                    <td><span className={`badge ${c.payout_status === 'paid' ? 'badge-success' : c.payout_status === 'on_hold' ? 'badge-warning' : 'badge-neutral'}`}>{c.payout_status}</span></td>
                    <td>{formatDate(c.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {c.payout_status === 'pending' && <>
                          <button className="btn btn-success btn-sm" onClick={() => updatePayout(c, 'paid')}>Mark Paid</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => updatePayout(c, 'on_hold')}>Hold</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
