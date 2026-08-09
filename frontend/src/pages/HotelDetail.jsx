import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { formatPrice, formatDate, nightsBetween } from '../lib/format'
import { Star, MapPin, Check, Users, Bed, Maximize, Wifi, Car, Coffee, Dumbbell, Save as Waves, ArrowLeft } from 'lucide-react'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'AC': Check, 'Spa': Waves, 'Beach Access': Waves, 'Room Service': Coffee, 'Bar': Coffee }

const MOCK_HOTELS = {
  '1': { id: '1', name: 'The Grand Palace', city: 'Mumbai', state: 'Maharashtra', country: 'India', address: '123 Marine Drive', star_rating: 5, price_from: 8500, amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Gym', 'Spa'], description: 'A luxurious 5-star hotel in the heart of Mumbai with stunning sea views and world-class amenities.', cover_image: 'https://images.treebohotels.com/images/Masthead-Jul-Web-Masthead.jpg', images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'] },
  '2': { id: '2', name: 'Sea Breeze Resort', city: 'Goa', state: 'Goa', country: 'India', address: 'Calangute Beach Road', star_rating: 4, price_from: 5200, amenities: ['Free WiFi', 'Beach Access', 'Bar', 'Restaurant'], description: 'A beautiful beachside resort in Goa with direct beach access and vibrant nightlife nearby.', cover_image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', images: [] },
  '3': { id: '3', name: 'Mountain View Inn', city: 'Manali', state: 'Himachal Pradesh', country: 'India', address: 'Mall Road, Manali', star_rating: 3, price_from: 2800, amenities: ['Free WiFi', 'Parking', 'Restaurant'], description: 'A cozy mountain inn with breathtaking views of the Himalayas.', cover_image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg', images: [] },
  '4': { id: '4', name: 'Royal Heritage Hotel', city: 'Jaipur', state: 'Rajasthan', country: 'India', address: 'Civil Lines, Jaipur', star_rating: 5, price_from: 9200, amenities: ['Free WiFi', 'Spa', 'Gym', 'Restaurant', 'Swimming Pool'], description: 'Experience royal Rajasthani hospitality in this heritage palace hotel.', cover_image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg', images: [] },
  '5': { id: '5', name: 'Backwaters Retreat', city: 'Kochi', state: 'Kerala', country: 'India', address: 'Alleppey Backwaters', star_rating: 4, price_from: 4500, amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant'], description: 'A serene retreat amidst the famous Kerala backwaters.', cover_image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', images: [] },
  '6': { id: '6', name: 'City Centre Suites', city: 'Bangalore', state: 'Karnataka', country: 'India', address: 'MG Road, Bangalore', star_rating: 4, price_from: 3800, amenities: ['Free WiFi', 'Gym', 'Parking'], description: 'Modern business hotel in the heart of Bangalore\'s tech hub.', cover_image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', images: [] },
  '7': { id: '7', name: 'Desert Sands Hotel', city: 'Jaisalmer', state: 'Rajasthan', country: 'India', address: 'Sam Sand Dunes Road', star_rating: 3, price_from: 3200, amenities: ['Free WiFi', 'Restaurant', 'AC'], description: 'Experience the magic of the Thar Desert from this unique desert hotel.', cover_image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg', images: [] },
  '8': { id: '8', name: 'Hilltop Escape', city: 'Ooty', state: 'Tamil Nadu', country: 'India', address: 'Doddabetta Peak Road', star_rating: 4, price_from: 4100, amenities: ['Free WiFi', 'Spa', 'Restaurant'], description: 'A peaceful hilltop retreat in the Nilgiri mountains of Ooty.', cover_image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', images: [] },
}

const MOCK_ROOMS = {
  '1': [
    { id: 'r1', name: 'Deluxe Sea View', price_per_night: 8500, capacity: 2, bed_type: 'King', size_sqft: 450, amenities: ['AC', 'Free WiFi', 'Mini Bar'], images: ['https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg'] },
    { id: 'r2', name: 'Premium Suite', price_per_night: 15000, capacity: 4, bed_type: 'King + Sofa', size_sqft: 800, amenities: ['AC', 'Free WiFi', 'Jacuzzi', 'Mini Bar'], images: [] },
  ],
  '2': [{ id: 'r3', name: 'Beach Cottage', price_per_night: 5200, capacity: 2, bed_type: 'Queen', size_sqft: 350, amenities: ['AC', 'Free WiFi'], images: [] }],
  '3': [{ id: 'r4', name: 'Mountain Room', price_per_night: 2800, capacity: 2, bed_type: 'Double', size_sqft: 280, amenities: ['Heating', 'Free WiFi'], images: [] }],
  '4': [{ id: 'r5', name: 'Heritage Suite', price_per_night: 9200, capacity: 2, bed_type: 'King', size_sqft: 600, amenities: ['AC', 'Free WiFi', 'Balcony'], images: [] }],
  '5': [{ id: 'r6', name: 'Backwater Villa', price_per_night: 4500, capacity: 2, bed_type: 'Queen', size_sqft: 400, amenities: ['AC', 'Free WiFi'], images: [] }],
  '6': [{ id: 'r7', name: 'Business Room', price_per_night: 3800, capacity: 1, bed_type: 'Single', size_sqft: 300, amenities: ['AC', 'Free WiFi', 'Work Desk'], images: [] }],
  '7': [{ id: 'r8', name: 'Desert Tent Suite', price_per_night: 3200, capacity: 2, bed_type: 'Double', size_sqft: 320, amenities: ['AC', 'Free WiFi'], images: [] }],
  '8': [{ id: 'r9', name: 'Hill View Room', price_per_night: 4100, capacity: 2, bed_type: 'Queen', size_sqft: 380, amenities: ['Heating', 'Free WiFi'], images: [] }],
}

const MOCK_REVIEWS = [
  { id: 'rv1', rating: 5, title: 'Excellent stay!', comment: 'Absolutely loved the experience. Staff was very helpful.', created_at: '2025-01-15', profiles: { full_name: 'Priya Sharma' } },
  { id: 'rv2', rating: 4, title: 'Great location', comment: 'Perfect location and clean rooms. Would visit again.', created_at: '2025-02-10', profiles: { full_name: 'Rahul Mehta' } },
]

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const hotel = MOCK_HOTELS[id] || null
  const rooms = MOCK_ROOMS[id] || []
  const reviews = MOCK_REVIEWS

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [roomsCount, setRoomsCount] = useState(1)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  const nights = nightsBetween(checkIn, checkOut)
  const baseAmount = selectedRoom ? selectedRoom.price_per_night * nights * roomsCount : 0
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
    if (!user) { navigate('/login'); return }
    if (!selectedRoom || !checkIn || !checkOut) return
    navigate('/booking', {
      state: {
        hotelId: hotel.id, roomId: selectedRoom.id, roomName: selectedRoom.name, hotelName: hotel.name,
        checkIn, checkOut, nights, guests, roomsCount, baseAmount, taxAmount, discount, totalAmount,
        couponCode: discount > 0 ? couponCode : '', pricePerNight: selectedRoom.price_per_night,
      }
    })
  }

  if (!hotel) return <div className="container empty-state"><h3>Hotel not found</h3><button className="btn btn-primary" onClick={() => navigate('/hotels')}>Back to Hotels</button></div>

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Hotels
      </button>

      <div className="detail-gallery">
        <div className="detail-gallery-main"><img src={hotel.cover_image} alt={hotel.name} /></div>
        <div className="detail-gallery-thumbs">
          {hotel.images.slice(0, 3).map((img, i) => <div key={i} className="detail-gallery-thumb"><img src={img} alt="" /></div>)}
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
            {hotel.amenities.map(a => { const Icon = amenityIcons[a] || Check; return <span key={a} className="detail-amenity"><Icon size={12} /> {a}</span> })}
          </div>
          <div className="detail-section">
            <h3>About</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{hotel.description}</p>
          </div>

          <div className="detail-section">
            <h3>Available Rooms</h3>
            {rooms.map(room => (
              <div key={room.id} className="room-card">
                <img className="room-card-img" src={room.images?.[0] || hotel.cover_image} alt={room.name} />
                <div className="room-card-body">
                  <div className="room-card-name">{room.name}</div>
                  <div className="room-card-info">
                    <span><Users size={12} style={{ display: 'inline' }} /> {room.capacity} guests</span>
                    <span><Bed size={12} style={{ display: 'inline' }} /> {room.bed_type}</span>
                    <span><Maximize size={12} style={{ display: 'inline' }} /> {room.size_sqft} sqft</span>
                  </div>
                  <div className="room-card-amenities">
                    {room.amenities.map(a => <span key={a} className="hotel-card-amenity">{a}</span>)}
                  </div>
                  <div className="room-card-footer">
                    <div className="room-card-price">{formatPrice(room.price_per_night)} <small>/night</small></div>
                    <button className={`btn ${selectedRoom?.id === room.id ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setSelectedRoom(room)}>
                      {selectedRoom?.id === room.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-section">
            <h3>Reviews ({reviews.length})</h3>
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{(r.profiles?.full_name || 'G')[0].toUpperCase()}</div>
                  <div>
                    <div className="review-name">{r.profiles?.full_name || 'Guest'}</div>
                    <div className="review-date">{formatDate(r.created_at)}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}><span className="badge badge-success">{r.rating} ★</span></div>
                </div>
                {r.title && <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{r.title}</div>}
                <div className="review-comment">{r.comment}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="booking-card">
            <div className="booking-price">{selectedRoom ? formatPrice(selectedRoom.price_per_night) : formatPrice(hotel.price_from)} <small>/night</small></div>
            <div className="booking-divider" />
            <div className="form-group"><label className="label">Check-in</label><input className="input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
            <div className="form-group"><label className="label">Check-out</label><input className="input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} /></div>
            <div className="form-group"><label className="label">Guests</label><select className="input" value={guests} onChange={e => setGuests(+e.target.value)}><option value={1}>1 Guest</option><option value={2}>2 Guests</option><option value={3}>3 Guests</option><option value={4}>4 Guests</option><option value={5}>5+ Guests</option></select></div>
            <div className="form-group"><label className="label">Rooms</label><select className="input" value={roomsCount} onChange={e => setRoomsCount(+e.target.value)}><option value={1}>1 Room</option><option value={2}>2 Rooms</option><option value={3}>3 Rooms</option></select></div>

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
