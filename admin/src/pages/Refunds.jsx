import { useState } from 'react'
import { REFUNDS } from '../lib/mockData'
import { formatPrice, formatDateTime } from '../lib/format'
import { Check, X } from 'lucide-react'

export default function Refunds() {
  const [rows, setRows] = useState(REFUNDS)

  const updateStatus = (r, status) =>
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, status, processed_at: status === 'processed' ? new Date().toISOString() : x.processed_at } : x))

  const totalProcessed = rows.filter(r => r.status === 'processed').reduce((s, r) => s + r.amount, 0)
  const totalPending = rows.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0)

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Refunds</div><div className="page-subtitle">{rows.length} refund requests</div></div></div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalProcessed)}</div><div className="stat-label">Processed</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPending)}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-value">{rows.filter(r => r.status === 'rejected').length}</div><div className="stat-label">Rejected</div></div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Booking Ref</th><th>Hotel</th><th>Customer</th><th>Amount</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No refunds yet</td></tr>
                : rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.booking_reference}</td>
                    <td>{r.hotel_name}</td>
                    <td>{r.customer_email}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(r.amount)}</td>
                    <td style={{ maxWidth: 200, fontSize: '0.8rem' }}>{r.reason}</td>
                    <td><span className={`badge ${r.status === 'processed' ? 'badge-success' : r.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>{r.status}</span></td>
                    <td>{formatDateTime(r.created_at)}</td>
                    <td>
                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(r, 'processed')}><Check size={12} /> Process</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r, 'rejected')}><X size={12} /> Reject</button>
                        </div>
                      )}
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
