import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { formatPrice, formatDate } from '../lib/format'

export default function MyBookings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from('bookings')
      .select('*, hotels(name, city, cover_image), rooms(name)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false) })
  }, [user])

  if (!user) {
    return <div className="container empty-state" style={{ paddingTop: 48 }}>
      <h3>Sign in required</h3>
      <p>Please sign in to view your bookings.</p>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>Sign In</button>
    </div>
  }

  if (loading) return <div className="container loading-center"><div className="spinner" /></div>

  const statusBadge = (status) => {
    const map = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-error', completed: 'badge-info', no_show: 'badge-neutral' }
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2 className="section-title">My Bookings</h2>
      <p className="section-subtitle">Manage your hotel reservations</p>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Start exploring and book your first stay!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/hotels')}>Browse Hotels</button>
        </div>
      ) : (
        <div className="my-bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-item">
              <img className="booking-item-img" src={b.hotels?.cover_image || 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg'} alt="" />
              <div className="booking-item-body">
                <div className="booking-item-header">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{b.hotels?.name}</div>
                    <div className="booking-item-ref">{b.booking_reference}</div>
                  </div>
                  {statusBadge(b.status)}
                </div>
                <div className="booking-item-dates">
                  {formatDate(b.check_in)} → {formatDate(b.check_out)} • {b.nights} nights • {b.guests} guests
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Room: {b.rooms?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(b.total_amount)}</div>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => navigate(`/hotels/${b.hotel_id}`)}>View Hotel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
