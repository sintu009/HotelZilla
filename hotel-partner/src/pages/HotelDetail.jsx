import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HOTELS, ROOMS, REVIEWS } from '../lib/mockData'
import { formatPrice, formatDate } from '../lib/format'
import { Star, MapPin, BedDouble, ArrowLeft, Check, Wifi, Car, Coffee, Dumbbell, Save as Waves } from 'lucide-react'

const AMENITY_ICONS = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'Beach Access': Waves }

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  const hotel = HOTELS.find(h => h.id === id)
  if (!hotel) return <div className="empty-state"><h3>Hotel not found</h3><button className="btn btn-primary btn-sm" onClick={() => navigate('/hotels')} style={{ marginTop: 12 }}>Back to Hotels</button></div>

  const hotelRooms = ROOMS.filter(r => r.hotel_id === id)
  const hotelReviews = REVIEWS.filter(r => r.hotel_id === id)

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Hotels
      </button>

      {/* Hero */}
      <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <img src={hotel.cover_image} alt={hotel.name} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={16} color="#fbbf24" fill="currentColor" />)}
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.75rem' }}>{hotel.name}</h1>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} /> {hotel.address}
            </div>
          </div>
          <span className={`badge ${hotel.status === 'approved' ? 'badge-success' : 'badge-warning'}`} style={{ position: 'absolute', top: 16, right: 16 }}>
            {hotel.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</div>
        <div className={`tab ${tab === 'rooms' ? 'active' : ''}`} onClick={() => setTab('rooms')}>Rooms ({hotelRooms.length})</div>
        <div className={`tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>Reviews ({hotelReviews.length})</div>
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 12 }}>About this hotel</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{hotel.description}</p>

            <h4 style={{ marginBottom: 12 }}>Amenities</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {hotel.amenities.map(a => {
                const Icon = AMENITY_ICONS[a] || Check
                return (
                  <span key={a} className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <Icon size={14} /> {a}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Quick Stats</h3>
            {[
              ['Price From', formatPrice(hotel.price_from)],
              ['Total Rooms', hotel.total_rooms],
              ['Rating', `${hotel.rating || '—'} ★`],
              ['Reviews', hotel.review_count],
              ['Commission Rate', `${hotel.commission_rate}%`],
              ['Status', <span className={`badge ${hotel.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{hotel.status}</span>],
              ['Contact', hotel.contact_phone],
              ['Email', hotel.contact_email],
            ].map(([l, v]) => (
              <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
            ))}
          </div>
        </div>
      )}

      {tab === 'rooms' && (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Room Name</th><th>Bed Type</th><th>Max Guests</th><th>Size</th><th>Inventory</th><th>Price/Night</th><th>Status</th></tr></thead>
              <tbody>
                {hotelRooms.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No rooms configured</td></tr>
                  : hotelRooms.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.bed_type}</td>
                      <td>{r.max_guests}</td>
                      <td>{r.size_sqft} sq ft</td>
                      <td>{r.total_inventory}</td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(r.base_price)}</td>
                      <td><span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{r.status}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {hotelReviews.length === 0
            ? <div className="empty-state"><h3>No reviews yet</h3></div>
            : hotelReviews.map(r => (
              <div key={r.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.reviewer}</div>
                    <div style={{ display: 'flex', gap: 1, marginTop: 2 }}>
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} color="#fbbf24" fill="currentColor" />)}
                    </div>
                  </div>
                  <span className={`badge ${r.is_approved ? 'badge-success' : 'badge-warning'}`}>{r.is_approved ? 'Published' : 'Pending'}</span>
                </div>
                {r.title && <h4 style={{ marginBottom: 4 }}>{r.title}</h4>}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{r.comment}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>{formatDate(r.created_at)}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
