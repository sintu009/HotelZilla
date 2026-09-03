import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../lib/useAuthStore'
import { formatPrice, formatDate } from '../lib/format'
import bookingsApi from '../api/bookings'

export default function MyBookings() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    bookingsApi.getMyAll()
      .then(res => setBookings(res.data || res || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return <div className="container empty-state" style={{ paddingTop: 48 }}>
      <h3>Sign in required</h3>
      <p>Please sign in to view your bookings.</p>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>Sign In</button>
    </div>
  }

  const statusBadge = (status) => {
    const map = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-error', completed: 'badge-info', no_show: 'badge-neutral' }
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2 className="section-title">My Bookings</h2>
      <p className="section-subtitle">Manage your hotel reservations</p>
      {loading ? (
        <div className="empty-state"><span className="spinner" /></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Start exploring hotels and make your first booking!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/hotels')}>Browse Hotels</button>
        </div>
      ) : (
        <div className="my-bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-item">
              <img className="booking-item-img" src={b.hotel_cover_image || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt="" />
              <div className="booking-item-body">
                <div className="booking-item-header">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{b.hotel_name}</div>
                    <div className="booking-item-ref">{b.id}</div>
                  </div>
                  {statusBadge(b.status)}
                </div>
                <div className="booking-item-dates">
                  {formatDate(b.checkin_date)} → {formatDate(b.checkout_date)} • {b.guests} guests
                </div>
                {b.room_number && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Room: {b.room_number}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(b.amount)}</div>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => navigate(`/hotels/${b.hotel_id}`)}>View Hotel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
