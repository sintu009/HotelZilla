import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Building2, CalendarClock, TrendingUp, Users,
  Ban, CircleCheck as CheckCircle, MapPin, Star, Phone, Mail,
  CalendarDays, IndianRupee, XCircle, CheckCircle2, Clock, BarChart2
} from 'lucide-react'
import { ownersApi } from '../lib/api'
import { formatDate, formatPrice } from '../lib/format'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_BADGE = {
  confirmed:   'badge-success',
  checked_in:  'badge-info',
  checked_out: 'badge-neutral',
  cancelled:   'badge-error',
  pending:     'badge-warning',
}

const HOTEL_STATUS_BADGE = {
  approved:  'badge-success',
  pending:   'badge-warning',
  rejected:  'badge-error',
  suspended: 'badge-neutral',
}

export default function OwnerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [tab, setTab]                 = useState('overview')
  const [confirmToggle, setConfirmToggle] = useState(false)
  const [toggling, setToggling]       = useState(false)

  const load = () => {
    setLoading(true)
    ownersApi.getById(id)
      .then(setData)
      .catch(err => toast.error('Error', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const toggleStatus = async () => {
    setToggling(true)
    try {
      await ownersApi.toggle(id)
      toast[data.owner.is_active ? 'warning' : 'success'](
        data.owner.is_active ? 'Owner Suspended' : 'Owner Activated',
        `${data.owner.name}'s account has been updated.`
      )
      load()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setToggling(false)
      setConfirmToggle(false)
    }
  }

  if (loading) return <div className="loading-center"><span className="spinner" /></div>
  if (!data)   return <div className="empty-state">Owner not found.</div>

  const { owner, hotels, bookings, stats, monthly } = data

  const TABS = [
    { key: 'overview',  label: 'Overview',  icon: <Users size={14}/> },
    { key: 'hotels',    label: 'Hotels',    icon: <Building2 size={14}/>, count: hotels.length },
    { key: 'bookings',  label: 'Bookings',  icon: <CalendarClock size={14}/>, count: bookings.length },
    { key: 'revenue',   label: 'Revenue',   icon: <TrendingUp size={14}/> },
  ]

  const maxRevenue = Math.max(...monthly.map(m => Number(m.revenue)), 1)

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/users/hotel-owners')}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="page-title">{owner.name}</div>
            <div className="page-subtitle">{owner.email} · Joined {formatDate(owner.created_at)}</div>
          </div>
        </div>
        <button
          className={`btn btn-sm ${owner.is_active ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => setConfirmToggle(true)}
        >
          {owner.is_active ? <><Ban size={13}/> Suspend</> : <><CheckCircle size={13}/> Activate</>}
        </button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Hotels',    value: hotels.length,                    icon: <Building2 size={18}/>,    color: '#6366f1' },
          { label: 'Total Bookings',  value: stats.total_bookings,             icon: <CalendarClock size={18}/>, color: '#059669' },
          { label: 'Total Revenue',   value: formatPrice(stats.total_revenue), icon: <IndianRupee size={18}/>,  color: '#f59e0b' },
          { label: 'Cancellations',   value: stats.cancelled_bookings,         icon: <XCircle size={18}/>,      color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="hotel-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`hotel-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
            {t.count != null && <span className="hotel-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Profile */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Owner Profile</div>
            {[
              [<Mail size={14}/>,        'Email',   owner.email],
              [<Phone size={14}/>,       'Phone',   owner.phone || '—'],
              [<CalendarDays size={14}/>, 'Joined',  formatDate(owner.created_at)],
              [<CheckCircle2 size={14}/>, 'Status',
                <span className={`badge ${owner.is_active ? 'badge-success' : 'badge-error'}`}>
                  {owner.is_active ? 'Active' : 'Suspended'}
                </span>
              ],
              [<Building2 size={14}/>,   'Hotels',  hotels.length],
            ].map(([icon, label, value]) => (
              <div key={label} className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{icon}</span>
                <span className="detail-label" style={{ width: 100 }}>{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Booking Summary</div>
            {[
              ['Total Bookings',   stats.total_bookings,    '#059669'],
              ['Active Bookings',  stats.active_bookings,   '#6366f1'],
              ['Cancellations',    stats.cancelled_bookings,'#ef4444'],
              ['Total Revenue',    formatPrice(stats.total_revenue), '#f59e0b'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Recent hotels */}
          {hotels.length > 0 && (
            <div className="card" style={{ padding: 24, gridColumn: '1 / -1' }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Hotels at a Glance</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {hotels.slice(0, 6).map(h => (
                  <div key={h.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    {h.images?.[0] && <img src={h.images[0]} alt={h.name} style={{ width: '100%', height: 90, objectFit: 'cover' }} />}
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{h.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11}/>{h.city}{h.state ? `, ${h.state}` : ''}
                      </div>
                      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`badge ${HOTEL_STATUS_BADGE[h.status] || 'badge-neutral'}`}>{h.status}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.room_count} rooms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HOTELS ── */}
      {tab === 'hotels' && (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Hotel</th><th>City</th><th>Stars</th><th>Rooms</th>
                  <th>Price From</th><th>Status</th><th>Listed</th>
                </tr>
              </thead>
              <tbody>
                {hotels.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotels</td></tr>
                  : hotels.map(h => (
                    <tr key={h.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {h.images?.[0] && <img src={h.images[0]} alt="" className="img-thumb" />}
                          <span style={{ fontWeight: 600 }}>{h.name}</span>
                        </div>
                      </td>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12}/>{h.city}</div></td>
                      <td>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[...Array(h.star_rating || 0)].map((_, i) => <Star key={i} size={11} fill="#f59e0b" color="#f59e0b"/>)}
                        </div>
                      </td>
                      <td>{h.room_count}</td>
                      <td>{h.price_from ? formatPrice(h.price_from) : '—'}</td>
                      <td><span className={`badge ${HOTEL_STATUS_BADGE[h.status] || 'badge-neutral'}`}>{h.status}</span></td>
                      <td>{formatDate(h.created_at)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {tab === 'bookings' && (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Hotel</th><th>Check-in</th>
                  <th>Check-out</th><th>Amount</th><th>Status</th><th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings</td></tr>
                  : bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{b.id}</td>
                      <td style={{ fontWeight: 600 }}>{b.customer_name}</td>
                      <td>{b.hotel_name}</td>
                      <td>{formatDate(b.checkin_date)}</td>
                      <td>{formatDate(b.checkout_date)}</td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(b.amount)}</td>
                      <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>{b.status}</span></td>
                      <td>{formatDate(b.created_at)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── REVENUE ── */}
      {tab === 'revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { label: 'Total Revenue',  value: formatPrice(stats.total_revenue),  color: '#059669', icon: <IndianRupee size={20}/> },
              { label: 'Total Bookings', value: stats.total_bookings,              color: '#6366f1', icon: <CalendarClock size={20}/> },
              { label: 'Cancellations',  value: stats.cancelled_bookings,          color: '#ef4444', icon: <XCircle size={20}/> },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color + '18', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly bar chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <BarChart2 size={16} color="var(--accent)"/>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Monthly Revenue — Last 12 Months</span>
            </div>
            {monthly.length === 0
              ? <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>No data yet</div>
              : (
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: monthly.length * 64, height: 180, paddingBottom: 4 }}>
                    {monthly.map(m => {
                      const pct = (Number(m.revenue) / maxRevenue) * 100
                      return (
                        <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 56 }}>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{formatPrice(m.revenue)}</div>
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                            <div
                              style={{
                                width: '70%', height: Math.max(pct * 1.4, 4),
                                background: 'linear-gradient(180deg, #059669, #34d399)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.3s',
                                position: 'relative',
                              }}
                              title={`Revenue: ${formatPrice(m.revenue)}\nBookings: ${m.bookings}\nCancellations: ${m.cancellations}`}
                            />
                            {Number(m.cancellations) > 0 && (
                              <div
                                style={{
                                  width: '70%', height: Math.max((Number(m.cancellations) / Math.max(Number(m.bookings) + Number(m.cancellations), 1)) * 20, 2),
                                  background: '#ef444440',
                                  borderRadius: '0 0 4px 4px',
                                }}
                              />
                            )}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{m.month}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#059669', display: 'inline-block' }}/> Revenue</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef444440', display: 'inline-block' }}/> Cancellations</span>
                  </div>
                </div>
              )
            }
          </div>

          {/* Monthly table */}
          {monthly.length > 0 && (
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr><th>Month</th><th>Revenue</th><th>Bookings</th><th>Cancellations</th><th>Avg/Booking</th></tr>
                  </thead>
                  <tbody>
                    {[...monthly].reverse().map(m => (
                      <tr key={m.month}>
                        <td style={{ fontWeight: 600 }}>{m.month}</td>
                        <td style={{ fontWeight: 700, color: '#059669' }}>{formatPrice(m.revenue)}</td>
                        <td>{m.bookings}</td>
                        <td style={{ color: Number(m.cancellations) > 0 ? '#ef4444' : 'var(--text-muted)' }}>{m.cancellations}</td>
                        <td>{Number(m.bookings) > 0 ? formatPrice(Math.round(Number(m.revenue) / Number(m.bookings))) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmToggle}
        onClose={() => setConfirmToggle(false)}
        onConfirm={toggleStatus}
        loading={toggling}
        variant={owner.is_active ? 'warning' : 'info'}
        title={owner.is_active ? 'Suspend Owner?' : 'Activate Owner?'}
        message={owner.is_active
          ? `${owner.name} and all their hotels will be suspended.`
          : `${owner.name}'s account will be restored.`}
        confirmLabel={owner.is_active ? 'Suspend' : 'Activate'}
      />
    </div>
  )
}
