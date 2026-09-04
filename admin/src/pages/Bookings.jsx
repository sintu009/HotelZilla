import { useState } from 'react'
import { bookingsApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatPrice, formatDate } from '../lib/format'
import { Search, Eye, Check, LogIn, LogOut, X } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_BADGE = { confirmed: 'badge-success', cancelled: 'badge-error', checked_out: 'badge-info', pending: 'badge-warning', checked_in: 'badge-info' }

const ACTIONS = {
  pending:    [{ label: 'Confirm',    icon: Check,   next: 'confirmed',   cls: 'btn-success' }, { label: 'Cancel', icon: X, next: 'cancelled', cls: 'btn-danger' }],
  confirmed:  [{ label: 'Check In',  icon: LogIn,   next: 'checked_in',  cls: 'btn-primary' }, { label: 'Cancel', icon: X, next: 'cancelled', cls: 'btn-danger' }],
  checked_in: [{ label: 'Check Out', icon: LogOut,  next: 'checked_out', cls: 'btn-primary' }],
  checked_out: [],
  cancelled:  [],
}

export default function Bookings() {
  const toast = useToast()
  const [search, setSearch]               = useState('')
  const [statusFilter, setStatusFilter]   = useState('')
  const [sourceFilter, setSourceFilter]   = useState('')
  const [selected, setSelected]           = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)
  const [acting, setActing]               = useState(false)

  const { data, loading, error, refetch } = useFetch(() => bookingsApi.list(1, 100))
  const allRows = data?.data ?? []

  const rows = allRows.filter(b => {
    const ms  = !search || String(b.id).includes(search) || b.hotel_name?.toLowerCase().includes(search.toLowerCase()) || b.customer_name?.toLowerCase().includes(search.toLowerCase())
    const mst = !statusFilter || b.status === statusFilter
    const msr = !sourceFilter || b.source === sourceFilter
    return ms && mst && msr
  })

  const sourceLabel = s => s === 'landing_page' ? 'Landing Page' : s === 'main_site' ? 'Main Site' : 'Direct'
  const sourceBadge = s => s === 'landing_page' ? 'badge-info' : 'badge-neutral'

  const updateStatus = async (booking, newStatus) => {
    setActing(true)
    try {
      await bookingsApi.updateStatus(booking.id, newStatus)
      const labels = { confirmed: 'Confirmed', cancelled: 'Cancelled', checked_in: 'Checked In', checked_out: 'Checked Out' }
      toast.success(labels[newStatus] || newStatus, `Booking #${booking.id} updated.`)
      refetch()
      setSelected(s => s ? { ...s, status: newStatus } : null)
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setActing(false)
      setConfirmCancel(null)
    }
  }

  const cancelBooking = async (b) => updateStatus(b, 'cancelled')

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Bookings</div><div className="page-subtitle">{rows.length} bookings</div></div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by ID, hotel, or guest..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="input" style={{ width: 160 }} value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          <option value="">All Sources</option>
          <option value="landing_page">Landing Page</option>
          <option value="main_site">Main Site</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>#ID</th><th>Hotel</th><th>Guest</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={8} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found</td></tr>
                    : rows.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{b.id}</td>
                        <td style={{ fontWeight: 600 }}>{b.hotel_name}</td>
                        <td>{b.customer_name}</td>
                        <td>{formatDate(b.checkin_date)}</td>
                        <td>{formatDate(b.checkout_date)}</td>
                        <td>{formatPrice(b.amount)}</td>
                        <td><span className={`badge ${sourceBadge(b.source)}`}>{sourceLabel(b.source)}</span></td>
                        <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>{b.status}</span></td>
                        <td><button className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}><Eye size={14} /></button></td>
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
            <div className="modal-header"><h3>Booking Details</h3><button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button></div>
            <div className="modal-body">
              {[
                ['Booking ID', `#${selected.id}`],
                ['Hotel', selected.hotel_name],
                ['Guest', selected.customer_name],
                ['Check-in', formatDate(selected.checkin_date)],
                ['Check-out', formatDate(selected.checkout_date)],
                ['Guests', selected.guests],
                ['Amount', formatPrice(selected.amount)],
                ['Status', <span className={`badge ${STATUS_BADGE[selected.status] || 'badge-neutral'}`}>{selected.status}</span>],
                ['Booked On', formatDate(selected.created_at)],
              ].map(([l, v]) => (
                <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
              ))}
            </div>
            <div className="modal-footer">
              {(ACTIONS[selected.status] || []).map(({ label, icon: Icon, next, cls }) => (
                <button key={next} className={`btn ${cls} btn-sm`} disabled={acting}
                  onClick={() => next === 'cancelled' ? setConfirmCancel(selected) : updateStatus(selected, next)}>
                  {acting ? <span className="spinner" /> : <><Icon size={13} /> {label}</>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => cancelBooking(confirmCancel)}
        loading={acting}
        variant="danger"
        title="Cancel Booking?"
        message={`Booking #${confirmCancel?.id} will be cancelled. This cannot be undone.`}
        confirmLabel="Yes, Cancel"
      />
    </div>
  )
}
