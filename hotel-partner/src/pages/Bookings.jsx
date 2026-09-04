import { useState, useEffect } from 'react'
import { bookingsApi } from '../lib/api'
import { formatPrice, formatDate } from '../lib/format'
import { Search, Eye, Check, LogIn, LogOut, X } from 'lucide-react'
import { useToast } from '../components/Toast'

const STATUS_BADGE = {
  confirmed:   'badge-success',
  cancelled:   'badge-error',
  checked_out: 'badge-info',
  pending:     'badge-warning',
  checked_in:  'badge-info',
}

const ACTIONS = {
  pending:     [{ label: 'Confirm',   icon: Check,  next: 'confirmed',   cls: 'btn-success' }, { label: 'Cancel', icon: X, next: 'cancelled', cls: 'btn-danger' }],
  confirmed:   [{ label: 'Check In',  icon: LogIn,  next: 'checked_in',  cls: 'btn-primary' }, { label: 'Cancel', icon: X, next: 'cancelled', cls: 'btn-danger' }],
  checked_in:  [{ label: 'Check Out', icon: LogOut, next: 'checked_out', cls: 'btn-primary' }],
  checked_out: [],
  cancelled:   [],
}

export default function Bookings() {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [acting, setActing]     = useState(false)

  const load = () => {
    setLoading(true)
    bookingsApi.list()
      .then(res => setBookings(Array.isArray(res) ? res : res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = bookings.filter(b => {
    const ms  = !search || String(b.id).includes(search) || b.hotel_name?.toLowerCase().includes(search.toLowerCase()) || b.customer_name?.toLowerCase().includes(search.toLowerCase())
    const mst = !statusFilter || b.status === statusFilter
    return ms && mst
  })

  const updateStatus = async (booking, newStatus) => {
    setActing(true)
    try {
      await bookingsApi.updateStatus(booking.id, newStatus)
      const labels = { confirmed: 'Confirmed', cancelled: 'Cancelled', checked_in: 'Checked In', checked_out: 'Checked Out' }
      toast.success(labels[newStatus] || newStatus, `Booking #${booking.id} updated.`)
      setBookings(bs => bs.map(b => b.id === booking.id ? { ...b, status: newStatus } : b))
      setSelected(s => s?.id === booking.id ? { ...s, status: newStatus } : s)
    } catch (err) {
      toast.error('Error', err.message)
    } finally { setActing(false) }
  }

  const totalRevenue = filtered.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.amount || 0), 0)
  const sourceLabel = s => s === 'landing_page' ? 'Landing Page' : s === 'main_site' ? 'Main Site' : 'Direct'
  const sourceBadge = s => s === 'landing_page' ? 'badge-info' : 'badge-neutral'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bookings</div>
          <div className="page-subtitle">{filtered.length} bookings across your properties</div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{filtered.length}</div><div className="stat-label">Total Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{filtered.filter(b => b.status === 'confirmed').length}</div><div className="stat-label">Confirmed</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRevenue)}</div><div className="stat-label">Gross Revenue</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by ID, hotel or guest..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>#ID</th><th>Hotel</th><th>Guest</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Source</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={8} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : filtered.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found</td></tr>
                  : filtered.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{b.id}</td>
                      <td style={{ fontWeight: 600 }}>{b.hotel_name}</td>
                      <td>{b.customer_name}</td>
                      <td>{formatDate(b.checkin_date)}</td>
                      <td>{formatDate(b.checkout_date)}</td>
                      <td style={{ fontWeight: 600 }}>{formatPrice(b.amount)}</td>
                      <td><span className={`badge ${sourceBadge(b.source)}`}>{sourceLabel(b.source)}</span></td>
                      <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>{b.status}</span></td>
                      <td style={{ display: 'flex', gap: 4 }}>
                        {(ACTIONS[b.status] || []).map(({ label, icon: Icon, next, cls }) => (
                          <button key={next} className={`btn ${cls} btn-sm`} disabled={acting}
                            onClick={() => updateStatus(b, next)} title={label}>
                            <Icon size={12} />
                          </button>
                        ))}
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking #{selected.id}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                ['Hotel',      selected.hotel_name],
                ['Room',       selected.room_number ? `Room ${selected.room_number}` : '—'],
                ['Guest',      selected.customer_name],
                ['Phone',      selected.customer_phone || '—'],
                ['Check-in',   formatDate(selected.checkin_date)],
                ['Check-out',  formatDate(selected.checkout_date)],
                ['Guests',     selected.guests],
                ['Amount',     formatPrice(selected.amount)],
                ['Status',     <span className={`badge ${STATUS_BADGE[selected.status] || 'badge-neutral'}`}>{selected.status}</span>],
                ['Booked On',  formatDate(selected.created_at)],
              ].map(([l, v]) => (
                <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
              ))}
            </div>
            <div className="modal-footer">
              {(ACTIONS[selected.status] || []).map(({ label, icon: Icon, next, cls }) => (
                <button key={next} className={`btn ${cls} btn-sm`} disabled={acting}
                  onClick={() => updateStatus(selected, next)}>
                  {acting ? <span className="spinner" /> : <><Icon size={13} /> {label}</>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
