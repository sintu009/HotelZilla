import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../lib/format'
import { Search, Eye, X } from 'lucide-react'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('bookings').select('*, hotels(name, city), rooms(name), profiles!bookings_customer_id_fkey(full_name, email)').order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false) })
  }, [])

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.booking_reference?.toLowerCase().includes(search.toLowerCase()) || b.hotels?.name?.toLowerCase().includes(search.toLowerCase()) || b.guest_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = async (booking, status) => {
    await supabase.from('bookings').update({ status }).eq('id', booking.id)
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status } : b))
    if (selected?.id === booking.id) setSelected({ ...booking, status })
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Bookings</div><div className="page-subtitle">{filtered.length} total bookings</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by ref, hotel, or guest..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
          <option value="no_show">No Show</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Reference</th><th>Hotel</th><th>Guest</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.booking_reference || b.id.slice(0, 8)}</td>
                  <td style={{ fontWeight: 600 }}>{b.hotels?.name || '—'}</td>
                  <td>{b.guest_name || b.profiles?.full_name || '—'}</td>
                  <td>{formatDate(b.check_in)}</td>
                  <td>{formatDate(b.check_out)}</td>
                  <td>{formatPrice(b.total_amount)}</td>
                  <td><span className={`badge ${b.status === 'confirmed' ? 'badge-success' : b.status === 'cancelled' ? 'badge-error' : b.status === 'completed' ? 'badge-info' : 'badge-warning'}`}>{b.status}</span></td>
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
              <div className="detail-row"><div className="detail-label">Reference</div><div className="detail-value" style={{ fontFamily: 'monospace' }}>{selected.booking_reference}</div></div>
              <div className="detail-row"><div className="detail-label">Hotel</div><div className="detail-value">{selected.hotels?.name}, {selected.hotels?.city}</div></div>
              <div className="detail-row"><div className="detail-label">Room</div><div className="detail-value">{selected.rooms?.name || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Guest</div><div className="detail-value">{selected.guest_name} ({selected.guest_email})</div></div>
              <div className="detail-row"><div className="detail-label">Phone</div><div className="detail-value">{selected.guest_phone || '—'}</div></div>
              <div className="detail-row"><div className="detail-label">Check-in</div><div className="detail-value">{formatDate(selected.check_in)}</div></div>
              <div className="detail-row"><div className="detail-label">Check-out</div><div className="detail-value">{formatDate(selected.check_out)}</div></div>
              <div className="detail-row"><div className="detail-label">Nights</div><div className="detail-value">{selected.nights}</div></div>
              <div className="detail-row"><div className="detail-label">Guests</div><div className="detail-value">{selected.guests}</div></div>
              <div className="detail-row"><div className="detail-label">Rooms</div><div className="detail-value">{selected.rooms_count}</div></div>
              <div className="detail-row"><div className="detail-label">Base Amount</div><div className="detail-value">{formatPrice(selected.base_amount)}</div></div>
              {selected.discount_amount > 0 && <div className="detail-row"><div className="detail-label">Discount</div><div className="detail-value" style={{ color: 'var(--success)' }}>-{formatPrice(selected.discount_amount)}</div></div>}
              <div className="detail-row"><div className="detail-label">Tax</div><div className="detail-value">{formatPrice(selected.tax_amount)}</div></div>
              <div className="detail-row"><div className="detail-label">Total</div><div className="detail-value" style={{ fontWeight: 700 }}>{formatPrice(selected.total_amount)}</div></div>
              {selected.coupon_code && <div className="detail-row"><div className="detail-label">Coupon</div><div className="detail-value">{selected.coupon_code}</div></div>}
              <div className="detail-row"><div className="detail-label">Status</div><div className="detail-value"><span className={`badge ${selected.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{selected.status}</span></div></div>
              {selected.special_requests && <div className="detail-row"><div className="detail-label">Special Requests</div><div className="detail-value">{selected.special_requests}</div></div>}
              <div className="detail-row"><div className="detail-label">Booked On</div><div className="detail-value">{formatDate(selected.created_at)}</div></div>
            </div>
            <div className="modal-footer">
              {selected.status !== 'cancelled' && <button className="btn btn-danger btn-sm" onClick={() => updateStatus(selected, 'cancelled')}>Cancel Booking</button>}
              {selected.status === 'confirmed' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(selected, 'completed')}>Mark Completed</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
