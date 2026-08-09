import { useState } from 'react'
import { BOOKINGS } from '../lib/mockData'
import { formatPrice, formatDate } from '../lib/format'
import { Search, Eye } from 'lucide-react'

const STATUS_BADGE = { confirmed: 'badge-success', cancelled: 'badge-error', completed: 'badge-info', pending: 'badge-warning' }

export default function Bookings() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [hotelFilter, setHotelFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = BOOKINGS.filter(b => {
    const ms = !search || b.booking_reference.toLowerCase().includes(search.toLowerCase()) || b.guest_name.toLowerCase().includes(search.toLowerCase())
    const mst = !statusFilter || b.status === statusFilter
    const msh = !hotelFilter || b.hotel_id === hotelFilter
    return ms && mst && msh
  })

  const totalRevenue = filtered.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0)
  const totalPayout = filtered.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.payout, 0)

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Bookings</div><div className="page-subtitle">{filtered.length} bookings across your properties</div></div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{filtered.length}</div><div className="stat-label">Total Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRevenue)}</div><div className="stat-label">Gross Revenue</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--primary)' }}>{formatPrice(totalPayout)}</div><div className="stat-label">Your Payout</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by ref or guest..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={hotelFilter} onChange={e => setHotelFilter(e.target.value)}>
          <option value="">All Hotels</option>
          <option value="h1">The Grand Palace Resort</option>
          <option value="h2">Ocean View Hotel</option>
          <option value="h3">Sunset Bay Hotel</option>
        </select>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Reference</th><th>Hotel</th><th>Guest</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Payout</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found</td></tr>
                : filtered.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.booking_reference}</td>
                    <td style={{ fontWeight: 600 }}>{b.hotel_name}</td>
                    <td>{b.guest_name}</td>
                    <td>{formatDate(b.check_in)}</td>
                    <td>{formatDate(b.check_out)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(b.total_amount)}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatPrice(b.payout)}</td>
                    <td><span className={`badge ${STATUS_BADGE[b.status]}`}>{b.status}</span></td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}><Eye size={14} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Booking Details</h3><button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button></div>
            <div className="modal-body">
              {[
                ['Reference', selected.booking_reference],
                ['Hotel', selected.hotel_name],
                ['Room', selected.room_name],
                ['Guest', `${selected.guest_name} (${selected.guest_email})`],
                ['Phone', selected.guest_phone],
                ['Check-in', formatDate(selected.check_in)],
                ['Check-out', formatDate(selected.check_out)],
                ['Nights', selected.nights],
                ['Guests', selected.guests],
                ['Rooms', selected.rooms_count],
                ['Base Amount', formatPrice(selected.base_amount)],
                ['Discount', selected.discount_amount > 0 ? `-${formatPrice(selected.discount_amount)}` : '—'],
                ['Tax', formatPrice(selected.tax_amount)],
                ['Total', formatPrice(selected.total_amount)],
                ['Commission', `-${formatPrice(selected.commission)}`],
                ['Your Payout', <span style={{ color: 'var(--primary)' }}>{formatPrice(selected.payout)}</span>],
                ['Payment', <span className={`badge ${selected.payment_status === 'paid' ? 'badge-success' : 'badge-error'}`}>{selected.payment_status}</span>],
                ['Status', <span className={`badge ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>],
                ['Special Requests', selected.special_requests || '—'],
                ['Booked On', formatDate(selected.created_at)],
              ].map(([l, v]) => (
                <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
