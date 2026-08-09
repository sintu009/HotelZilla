import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../lib/format'

export default function Commissions() {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    supabase.from('commissions').select('*, hotels(name, city), bookings(booking_reference)').order('created_at', { ascending: false })
      .then(({ data }) => { setCommissions(data || []); setLoading(false) })
  }, [])

  const filtered = statusFilter ? commissions.filter(c => c.payout_status === statusFilter) : commissions

  const updatePayout = async (c, status) => {
    const update = { payout_status: status }
    if (status === 'paid') update.payout_date = new Date().toISOString()
    await supabase.from('commissions').update(update).eq('id', c.id)
    setCommissions(prev => prev.map(x => x.id === c.id ? { ...x, ...update } : x))
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const totalCommission = commissions.reduce((s, c) => s + Number(c.commission_amount), 0)
  const totalPaid = commissions.filter(c => c.payout_status === 'paid').reduce((s, c) => s + Number(c.commission_amount), 0)
  const totalPending = commissions.filter(c => c.payout_status === 'pending').reduce((s, c) => s + Number(c.commission_amount), 0)

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Commissions</div><div className="page-subtitle">Platform commission tracking</div></div></div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalCommission)}</div><div className="stat-label">Total Commission</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPaid)}</div><div className="stat-label">Paid Out</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalPending)}</div><div className="stat-label">Pending Payout</div></div>
      </div>

      <div className="filter-bar">
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="on_hold">On Hold</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Booking</th><th>Hotel</th><th>Booking Amount</th><th>Rate</th><th>Commission</th><th>Payout Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No commissions yet</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.bookings?.booking_reference || '—'}</td>
                  <td style={{ fontWeight: 600 }}>{c.hotels?.name || '—'}</td>
                  <td>{formatPrice(c.booking_amount)}</td>
                  <td>{c.commission_rate}%</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(c.commission_amount)}</td>
                  <td><span className={`badge ${c.payout_status === 'paid' ? 'badge-success' : c.payout_status === 'on_hold' ? 'badge-warning' : 'badge-neutral'}`}>{c.payout_status}</span></td>
                  <td>{formatDate(c.created_at)}</td>
                  <td>
                    {c.payout_status === 'pending' && <button className="btn btn-success btn-sm" onClick={() => updatePayout(c, 'paid')}>Mark Paid</button>}
                    {c.payout_status === 'pending' && <button className="btn btn-secondary btn-sm" onClick={() => updatePayout(c, 'on_hold')}>Hold</button>}
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
