import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDateTime } from '../lib/format'
import { Check, X } from 'lucide-react'

export default function Refunds() {
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('refunds').select('*, bookings(booking_reference, hotels(name)), profiles!refunds_customer_id_fkey(email)').order('created_at', { ascending: false })
      .then(({ data }) => { setRefunds(data || []); setLoading(false) })
  }, [])

  const updateStatus = async (r, status) => {
    const update = { status }
    if (status === 'processed') update.processed_at = new Date().toISOString()
    await supabase.from('refunds').update(update).eq('id', r.id)
    if (status === 'processed') await supabase.from('payments').update({ status: 'refunded' }).eq('id', r.payment_id)
    setRefunds(prev => prev.map(x => x.id === r.id ? { ...x, ...update } : x))
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const totalProcessed = refunds.filter(r => r.status === 'processed').reduce((s, r) => s + Number(r.amount), 0)
  const totalPending = refunds.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.amount), 0)

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Refunds</div><div className="page-subtitle">{refunds.length} refund requests</div></div></div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalProcessed)}</div><div className="stat-label">Processed</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPending)}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-value">{refunds.filter(r => r.status === 'rejected').length}</div><div className="stat-label">Rejected</div></div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Booking</th><th>Hotel</th><th>Customer</th><th>Amount</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {refunds.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No refunds yet</td></tr>
              ) : refunds.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.bookings?.booking_reference || '—'}</td>
                  <td>{r.bookings?.hotels?.name || '—'}</td>
                  <td>{r.profiles?.email || '—'}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(r.amount)}</td>
                  <td style={{ maxWidth: 200 }}>{r.reason || '—'}</td>
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
