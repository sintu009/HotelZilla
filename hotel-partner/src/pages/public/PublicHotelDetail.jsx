import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HOTELS, ROOMS, REVIEWS } from '../../lib/mockData'
import { formatPrice, formatDate, nightsBetween } from '../../lib/format'
import { Star, MapPin, Check, Users, Bed, Maximize, Wifi, Car, Coffee, Dumbbell, Save as Waves, ArrowLeft } from 'lucide-react'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'AC': Check, 'Spa': Waves, 'Beach Access': Waves, 'Room Service': Coffee, 'Bar': Coffee, 'TV': Check, 'Mini Bar': Coffee, 'Sea View': Waves, 'Jacuzzi': Waves, 'Private Pool': Waves, 'Butler': Users, 'Garden View': Waves, 'Living Area': Maximize, 'Balcony': Maximize }

export default function PublicHotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hotel = HOTELS.find(h => h.id === id)
  const rooms = ROOMS.filter(r => r.hotel_id === id && r.status === 'active')
  const reviews = REVIEWS.filter(r => r.hotel_id === id && r.is_approved)

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [roomsCount, setRoomsCount] = useState(1)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  const nights = nightsBetween(checkIn, checkOut)
  const baseAmount = selectedRoom ? selectedRoom.base_price * nights * roomsCount : 0
  const taxAmount = Math.round(baseAmount * 0.12)
  const totalAmount = baseAmount + taxAmount - discount

  const applyCoupon = () => {
    setCouponError('')
    setDiscount(0)
    if (couponCode.toUpperCase() === 'WEEKEND20') {
      setDiscount(Math.round(baseAmount * 0.2))
    } else if (couponCode.toUpperCase() === 'EARLY1000') {
      setDiscount(1000)
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handleBook = () => {
    if (!selectedRoom || !checkIn || !checkOut) return
    navigate('/booking', {
      state: {
        hotelId: hotel.id, roomId: selectedRoom.id, roomName: selectedRoom.name, hotelName: hotel.name,
        checkIn, checkOut, nights, guests, roomsCount, baseAmount, taxAmount, discount, totalAmount,
        couponCode: discount > 0 ? couponCode : '', pricePerNight: selectedRoom.base_price,
      }
    })
  }

  if (!hotel) return <div className="public-container empty-state" style={{ paddingTop: 48 }}><h3>Hotel not found</h3><button className="btn btn-primary" onClick={() => navigate('/hotels')}>Back to Hotels</button></div>

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : hotel.rating

  return (
    <div className="public-container" style={{ paddingTop: 24 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Hotels
      </button>

      <div className="public-detail-gallery">
        <div className="public-detail-gallery-main"><img src={hotel.cover_image} alt={hotel.name} /></div>
      </div>

      <div className="public-detail-grid">
        <div className="public-detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            <span className="badge badge-success">{avgRating} ★</span>
          </div>
          <h1>{hotel.name}</h1>
          <div className="public-detail-location"><MapPin size={14} /> {hotel.address}</div>
          <div className="public-detail-amenities">
            {hotel.amenities.map(a => { const Icon = amenityIcons[a] || Check; return <span key={a} className="public-detail-amenity"><Icon size={12} /> {a}</span> })}
          </div>
          <div className="public-detail-section">
            <h3>About</h3>
            <p>{hotel.description}</p>
          </div>

          <div className="public-detail-section">
            <h3>Available Rooms</h3>
            {rooms.map(room => (
              <div key={room.id} className="public-room-card">
                <div className="public-room-card-body">
                  <div className="public-room-card-name">{room.name}</div>
                  <div className="public-room-card-info">
                    <span><Users size={12} /> {room.max_guests} guests</span>
                    <span><Bed size={12} /> {room.bed_type}</span>
                    <span><Maximize size={12} /> {room.size_sqft} sqft</span>
                  </div>
                  <div className="public-room-card-amenities">
                    {room.amenities.map(a => <span key={a} className="public-hotel-amenity">{a}</span>)}
                  </div>
                  <div className="public-room-card-footer">
                    <div className="public-hotel-price">{formatPrice(room.base_price)} <small>/night</small></div>
                    <button className={`btn ${selectedRoom?.id === room.id ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setSelectedRoom(room)}>
                      {selectedRoom?.id === room.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="public-detail-section">
            <h3>Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p> : reviews.map(r => (
              <div key={r.id} className="public-review-card">
                <div className="public-review-header">
                  <div className="public-review-avatar">{(r.reviewer || 'G')[0].toUpperCase()}</div>
                  <div>
                    <div className="public-review-name">{r.reviewer}</div>
                    <div className="public-review-date">{formatDate(r.created_at)}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}><span className="badge badge-success">{r.rating} ★</span></div>
                </div>
                {r.title && <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{r.title}</div>}
                <p className="public-review-text">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="public-booking-card">
            <div className="public-booking-price">{selectedRoom ? formatPrice(selectedRoom.base_price) : formatPrice(hotel.price_from)} <small>/night</small></div>
            <div className="public-booking-divider" />
            <div className="form-group"><label className="label">Check-in</label><input className="input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
            <div className="form-group"><label className="label">Check-out</label><input className="input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} /></div>
            <div className="form-group"><label className="label">Guests</label><select className="input" value={guests} onChange={e => setGuests(+e.target.value)}><option value={1}>1 Guest</option><option value={2}>2 Guests</option><option value={3}>3 Guests</option><option value={4}>4 Guests</option><option value={5}>5+ Guests</option></select></div>
            <div className="form-group"><label className="label">Rooms</label><select className="input" value={roomsCount} onChange={e => setRoomsCount(+e.target.value)}><option value={1}>1 Room</option><option value={2}>2 Rooms</option><option value={3}>3 Rooms</option></select></div>

            {selectedRoom && checkIn && checkOut && (
              <>
                <div className="public-booking-divider" />
                <div className="public-booking-row"><span>Base ({nights} nights × {roomsCount} rooms)</span><span>{formatPrice(baseAmount)}</span></div>
                {discount > 0 && <div className="public-booking-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="public-booking-row"><span>Taxes (12%)</span><span>{formatPrice(taxAmount)}</span></div>
                <div className="public-booking-row total"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
