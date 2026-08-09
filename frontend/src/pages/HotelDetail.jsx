import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { formatPrice, formatDate, nightsBetween } from '../lib/format'
import { Star, MapPin, Check, Users, Bed, Maximize, Wifi, Car, Coffee, Dumbbell, Save as Waves, ArrowLeft } from 'lucide-react'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'AC': Check, 'Spa': Waves, 'Beach Access': Waves, 'Room Service': Coffee, 'Bar': Coffee }

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [roomsCount, setRoomsCount] = useState(1)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    Promise.all([
      supabase.from('hotels').select('*').eq('id', id).maybeSingle(),
      supabase.from('rooms').select('*').eq('hotel_id', id),
      supabase.from('reviews').select('*, profiles!reviews_customer_id_fkey(full_name)').eq('hotel_id', id).eq('is_approved', true).order('created_at', { ascending: false }),
    ]).then(([h, r, rv]) => {
      setHotel(h.data)
      setRooms(r.data || [])
      setReviews(rv.data || [])
      setLoading(false)
    })
  }, [id])

  const nights = nightsBetween(checkIn, checkOut)
  const baseAmount = selectedRoom ? selectedRoom.price_per_night * nights * roomsCount : 0
  const taxAmount = Math.round(baseAmount * 0.12)
  const totalAmount = baseAmount + taxAmount - discount

  const applyCoupon = async () => {
    setCouponError('')
    setDiscount(0)
    if (!couponCode) return
    const { data } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).maybeSingle()
    if (!data) { setCouponError('Invalid coupon code'); return }
    if (baseAmount < data.min_order_amount) { setCouponError(`Minimum order ${formatPrice(data.min_order_amount)} required`); return }
    let d = data.discount_type === 'percentage' ? Math.round(baseAmount * data.discount_value / 100) : data.discount_value
    if (data.max_discount_amount > 0 && d > data.max_discount_amount) d = data.max_discount_amount
    setDiscount(d)
  }

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedRoom || !checkIn || !checkOut) return
    navigate('/booking', {
      state: {
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        hotelName: hotel.name,
        checkIn, checkOut, nights, guests, roomsCount,
        baseAmount, taxAmount, discount, totalAmount,
        couponCode: discount > 0 ? couponCode : '',
        pricePerNight: selectedRoom.price_per_night,
      }
    })
  }

  if (loading) return <div className="container loading-center"><div className="spinner" /></div>
  if (!hotel) return <div className="container empty-state"><h3>Hotel not found</h3><button className="btn btn-primary" onClick={() => navigate('/hotels')}>Back to Hotels</button></div>

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Hotels
      </button>

      {/* Gallery */}
      <div className="detail-gallery">
        <div className="detail-gallery-main">
          <img src={hotel.cover_image || hotel.images?.[0] || 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg'} alt={hotel.name} />
        </div>
        <div className="detail-gallery-thumbs">
          {(hotel.images || []).slice(0, 3).map((img, i) => (
            <div key={i} className="detail-gallery-thumb"><img src={img} alt="" /></div>
          ))}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={16} className="star" fill="currentColor" />)}
            <span className="badge badge-success">{avgRating} ★</span>
          </div>
          <h1>{hotel.name}</h1>
          <div className="detail-location"><MapPin size={14} style={{ display: 'inline' }} /> {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}</div>

          <div className="detail-amenities">
            {(hotel.amenities || []).map(a => {
              const Icon = amenityIcons[a] || Check
              return <span key={a} className="detail-amenity"><Icon size={12} /> {a}</span>
            })}
          </div>

          <div className="detail-section">
            <h3>About</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{hotel.description}</p>
          </div>

          {/* Rooms */}
          <div className="detail-section">
            <h3>Available Rooms</h3>
            {rooms.length === 0 ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No rooms available for this hotel.</p> : rooms.map(room => (
              <div key={room.id} className="room-card">
                <img className="room-card-img" src={room.images?.[0] || hotel.cover_image || 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg'} alt={room.name} />
                <div className="room-card-body">
                  <div className="room-card-name">{room.name}</div>
                  <div className="room-card-info">
                    <span><Users size={12} style={{ display: 'inline' }} /> {room.capacity} guests</span>
                    <span><Bed size={12} style={{ display: 'inline' }} /> {room.bed_type}</span>
                    <span><Maximize size={12} style={{ display: 'inline' }} /> {room.size_sqft} sqft</span>
                  </div>
                  <div className="room-card-amenities">
                    {(room.amenities || []).map(a => <span key={a} className="hotel-card-amenity">{a}</span>)}
                  </div>
                  <div className="room-card-footer">
                    <div className="room-card-price">{formatPrice(room.price_per_night)} <small>/night</small></div>
                    <button
                      className={`btn ${selectedRoom?.id === room.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      {selectedRoom?.id === room.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="detail-section">
            <h3>Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No reviews yet. Be the first to review!</p>
            ) : reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{(r.profiles?.full_name || 'G')[0].toUpperCase()}</div>
                  <div>
                    <div className="review-name">{r.profiles?.full_name || 'Guest'}</div>
                    <div className="review-date">{formatDate(r.created_at)}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span className="badge badge-success">{r.rating} ★</span>
                  </div>
                </div>
                {r.title && <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{r.title}</div>}
                <div className="review-comment">{r.comment}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <div className="booking-card">
            <div className="booking-price">{selectedRoom ? formatPrice(selectedRoom.price_per_night) : formatPrice(hotel.price_from)} <small>/night</small></div>
            <div className="booking-divider" />
            <div className="form-group">
              <label className="label">Check-in</label>
              <input className="input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label className="label">Check-out</label>
              <input className="input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label className="label">Guests</label>
              <select className="input" value={guests} onChange={e => setGuests(+e.target.value)}>
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5+ Guests</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Rooms</label>
              <select className="input" value={roomsCount} onChange={e => setRoomsCount(+e.target.value)}>
                <option value={1}>1 Room</option>
                <option value={2}>2 Rooms</option>
                <option value={3}>3 Rooms</option>
              </select>
            </div>

            {selectedRoom && checkIn && checkOut && (
              <>
                <div className="booking-divider" />
                <div className="booking-row"><span>Base ({nights} nights × {roomsCount} rooms)</span><span>{formatPrice(baseAmount)}</span></div>
                {discount > 0 && <div className="booking-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="booking-row"><span>Taxes (12%)</span><span>{formatPrice(taxAmount)}</span></div>
                <div className="booking-row total"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
              </>
            )}

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="label">Coupon Code</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                <button className="btn btn-secondary btn-sm" onClick={applyCoupon}>Apply</button>
              </div>
              {couponError && <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: 4 }}>{couponError}</div>}
              {discount > 0 && <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: 4 }}>Saved {formatPrice(discount)}!</div>}
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} onClick={handleBook} disabled={!selectedRoom || !checkIn || !checkOut}>
              {selectedRoom ? 'Book Now' : 'Select a room to book'}
            </button>
            {!user && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>Sign in required to book</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
