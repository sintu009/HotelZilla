import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { formatPrice, formatDate } from '../lib/format'

const MOCK_BOOKINGS = [
  { id: 'b1', booking_reference: 'BK12345678', hotel_id: '1', status: 'confirmed', check_in: '2025-08-10', check_out: '2025-08-13', nights: 3, guests: 2, total_amount: 28050, hotels: { name: 'The Grand Palace', city: 'Mumbai', cover_image: 'https://images.treebohotels.com/images/Masthead-Jul-Web-Masthead.jpg' }, rooms: { name: 'Deluxe Sea View' } },
  { id: 'b2', booking_reference: 'BK87654321', hotel_id: '2', status: 'completed', check_in: '2025-06-01', check_out: '2025-06-04', nights: 3, guests: 2, total_amount: 17472, hotels: { name: 'Sea Breeze Resort', city: 'Goa', cover_image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg' }, rooms: { name: 'Beach Cottage' } },
]

export default function MyBookings() {
  const navigate = useNavigate()
  const { user } = useAuth()

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
      <div className="my-bookings-list">
        {MOCK_BOOKINGS.map(b => (
          <div key={b.id} className="booking-item">
            <img className="booking-item-img" src={b.hotels?.cover_image || 'https://images.treebohotels.com/images/Masthead-Jul-Web-Masthead.jpg'} alt="" />
            <div className="booking-item-body">
              <div className="booking-item-header">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{b.hotels?.name}</div>
                  <div className="booking-item-ref">{b.booking_reference}</div>
                </div>
                {statusBadge(b.status)}
              </div>
              <div className="booking-item-dates">{formatDate(b.check_in)} → {formatDate(b.check_out)} • {b.nights} nights • {b.guests} guests</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Room: {b.rooms?.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(b.total_amount)}</div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => navigate(`/hotels/${b.hotel_id}`)}>View Hotel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
