import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../lib/useAuthStore'
import { formatPrice, formatDate, nightsBetween } from '../lib/format'
import { Star, MapPin, Check, Users, Wifi, Car, Coffee, Dumbbell, Save as Waves, ArrowLeft, ChevronLeft, ChevronRight, X, Shield, FileText, HelpCircle } from 'lucide-react'
import hotelsApi from '../api/hotels'
import bookingsApi from '../api/bookings'
import AuthModal from '../components/AuthModal'

const amenityIcons = {
  'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee,
  'Gym': Dumbbell, 'Swimming Pool': Waves, 'AC': Check,
  'Spa': Waves, 'Beach Access': Waves, 'Room Service': Coffee, 'Bar': Coffee
}

const TABS = [
  { id: 'rooms', label: 'Rooms' },
  { id: 'about', label: 'About the Hotel' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'location', label: 'Location' },
  { id: 'reviews', label: 'Rating & Reviews' },
  { id: 'policies', label: 'Rules & Policies' },
  { id: 'faqs', label: 'FAQs' },
]

function RoomGallery({ images, hotelFallback }) {
  const [idx, setIdx] = useState(0)
  const imgs = images && images.length > 0 ? images : [hotelFallback || 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg']
  return (
    <div style={{ position: 'relative', width: 200, height: 140, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
      <img src={imgs[idx]} alt="room" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={e => { e.target.src = 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg' }} />
      {imgs.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length) }}
            style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % imgs.length) }}
            style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <ChevronRight size={14} />
          </button>
          <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3 }}>
            {imgs.map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === idx ? '#fff' : 'rgba(255,255,255,0.5)' }} />)}
          </div>
        </>
      )}
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border-light)' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{question}</span>
        <span style={{ fontSize: 18, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 8 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ fontSize: 14, color: 'var(--text-secondary)', paddingBottom: 14, lineHeight: 1.6 }}>{answer}</div>}
    </div>
  )
}

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const bookingRef = useRef(null)
  const tabBarRef = useRef(null)

  const sectionRefs = {
    rooms: useRef(null),
    about: useRef(null),
    amenities: useRef(null),
    location: useRef(null),
    reviews: useRef(null),
    policies: useRef(null),
    faqs: useRef(null),
  }

  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeTab, setActiveTab] = useState('rooms')

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [roomsCount, setRoomsCount] = useState(1)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    hotelsApi.getById(id)
      .then(res => { setHotel(res.hotel || res); setRooms(res.rooms || []); setReviews(res.reviews || []) })
      .catch(() => setHotel(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const tabBarHeight = 112
    const handleScroll = () => {
      const scrollY = window.scrollY + tabBarHeight + 8
      let current = 'rooms'
      for (const tab of TABS) {
        const el = sectionRefs[tab.id]?.current
        if (el && el.offsetTop <= scrollY) current = tab.id
      }
      setActiveTab(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hotel])

  const scrollToTab = (tabId) => {
    const el = sectionRefs[tabId]?.current
    if (!el) return
    const offset = tabBarRef.current ? tabBarRef.current.offsetHeight + 64 + 8 : 120
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveTab(tabId)
  }

  const nights = nightsBetween(checkIn, checkOut)
  const baseAmount = selectedRoom ? Number(selectedRoom.price_per_night) * nights * roomsCount : 0
  const taxAmount = Math.round(baseAmount * 0.12)
  const totalAmount = baseAmount + taxAmount - discount

  const selectRoom = (room) => {
    setSelectedRoom(room)
    setTimeout(() => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
  }

  const applyCoupon = async () => {
    setCouponError(''); setDiscount(0)
    if (!couponCode) return
    setCouponLoading(true)
    try {
      const res = await bookingsApi.validateCoupon(couponCode, baseAmount)
      setDiscount(res.discount || 0)
    } catch { setCouponError('Invalid or expired coupon code') }
    finally { setCouponLoading(false) }
  }

  const handleBook = () => {
    if (!user) { setShowAuthModal(true); return }
    if (!selectedRoom || !checkIn || !checkOut) return
    navigate('/booking', {
      state: {
        hotelId: hotel.id, roomId: selectedRoom.id,
        roomName: selectedRoom.name || `Room ${selectedRoom.room_number}`,
        hotelName: hotel.name, checkIn, checkOut, nights, guests, roomsCount,
        baseAmount, taxAmount, discount, totalAmount,
        couponCode: discount > 0 ? couponCode : '',
        pricePerNight: selectedRoom.price_per_night,
      }
    })
  }

  if (loading) return <div className="container empty-state"><span className="spinner" /></div>
  if (!hotel) return <div className="container empty-state"><h3>Hotel not found</h3><button className="btn btn-primary" onClick={() => navigate('/hotels')}>Back to Hotels</button></div>

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null
  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ paddingBottom: 64 }}>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => { setShowAuthModal(false); handleBook() }} />
      )}

      {/* ── Gallery ── */}
      <div className="container" style={{ paddingTop: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')} style={{ marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Hotels
        </button>
        <div className="detail-gallery" style={{ marginBottom: 16 }}>
          <div className="detail-gallery-main">
            <img src={(hotel.images || [])[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt={hotel.name}
              onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }} />
          </div>
          <div className="detail-gallery-thumbs">
            {(hotel.images || []).slice(1, 4).map((img, i) => (
              <div key={i} className="detail-gallery-thumb"><img src={img} alt="" onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }} /></div>
            ))}
          </div>
        </div>

        {/* Hotel title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          {[...Array(hotel.star_rating || 3)].map((_, i) => <Star key={i} size={16} className="star" fill="currentColor" />)}
          {avgRating && <span className="badge badge-success" style={{ marginLeft: 4 }}>{avgRating} ★</span>}
        </div>
        <h1 style={{ marginBottom: 4 }}>{hotel.name}</h1>
        <div className="detail-location"><MapPin size={14} style={{ display: 'inline' }} /> {hotel.address}{hotel.city ? `, ${hotel.city}` : ''}</div>
      </div>

      {/* ── Sticky Tab Bar ── */}
      <div ref={tabBarRef} style={{
        position: 'sticky', top: 64, zIndex: 90,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(15,23,42,0.06)', marginTop: 16,
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => scrollToTab(tab.id)}
                style={{
                  padding: '14px 18px', fontSize: 14, fontWeight: 600,
                  whiteSpace: 'nowrap', background: 'none', border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--sage)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--sage)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="detail-grid">
          {/* LEFT COLUMN */}
          <div className="detail-info">

            {/* ROOMS */}
            <div ref={sectionRefs.rooms} className="detail-section" style={{ marginTop: 0 }}>
              <h3 style={{ marginBottom: 16 }}>Rooms</h3>
              {rooms.length === 0
                ? <p style={{ color: 'var(--text-muted)' }}>No rooms available at this time.</p>
                : rooms.map(room => {
                  const isSelected = selectedRoom?.id === room.id
                  return (
                    <div key={room.id} onClick={() => selectRoom(room)}
                      style={{
                        border: `2px solid ${isSelected ? 'var(--sage)' : 'var(--border)'}`,
                        borderRadius: 10, padding: 16, marginBottom: 12,
                        display: 'flex', gap: 16, cursor: 'pointer',
                        background: isSelected ? 'var(--sage-light)' : 'var(--surface)',
                        transition: 'all 0.15s',
                      }}>
                      <RoomGallery images={room.images} hotelFallback={(hotel.images || [])[0]} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div className="room-card-name">{room.name || `Room ${room.room_number}`}</div>
                          {isSelected && (
                            <span style={{ background: 'var(--sage)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Check size={11} /> Selected
                            </span>
                          )}
                        </div>
                        <div className="room-card-info">
                          <span><Users size={12} style={{ display: 'inline' }} /> {room.capacity} guests</span>
                          {room.room_type && <span>{room.room_type}</span>}
                        </div>
                        <div className="room-card-amenities">
                          {(room.amenities || []).slice(0, 4).map(a => <span key={a} className="hotel-card-amenity">{a}</span>)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                          <div className="room-card-price">{formatPrice(room.price_per_night)} <small>/night</small></div>
                          <button className={`btn btn-sm ${isSelected ? 'btn-accent' : 'btn-secondary'}`}
                            onClick={e => { e.stopPropagation(); selectRoom(room) }}>
                            {isSelected ? '✓ Selected' : 'Select Room'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>

            {/* ABOUT */}
            <div ref={sectionRefs.about} className="detail-section">
              <h3 style={{ marginBottom: 12 }}>About the Hotel</h3>
              {hotel.description
                ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{hotel.description}</p>
                : <p style={{ color: 'var(--text-muted)' }}>No description available.</p>
              }
              {hotel.city && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {hotel.star_rating && <span className="badge badge-neutral">{hotel.star_rating} Star Hotel</span>}
                  {hotel.city && <span className="badge badge-neutral"><MapPin size={11} /> {hotel.city}</span>}
                </div>
              )}
            </div>

            {/* AMENITIES */}
            <div ref={sectionRefs.amenities} className="detail-section">
              <h3 style={{ marginBottom: 12 }}>Amenities</h3>
              {(hotel.amenities || []).length === 0
                ? <p style={{ color: 'var(--text-muted)' }}>No amenities listed.</p>
                : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                    {(hotel.amenities || []).map(a => {
                      const Icon = amenityIcons[a] || Check
                      return (
                        <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
                          <span style={{ color: 'var(--sage)', display: 'flex' }}><Icon size={16} /></span>
                          {a}
                        </div>
                      )
                    })}
                  </div>
                )
              }
            </div>

            {/* LOCATION */}
            <div ref={sectionRefs.location} className="detail-section">
              <h3 style={{ marginBottom: 12 }}>Location</h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                <MapPin size={16} style={{ color: 'var(--sage)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {hotel.address}{hotel.city ? `, ${hotel.city}` : ''}{hotel.state ? `, ${hotel.state}` : ''}
                </span>
              </div>
              <div style={{ width: '100%', height: 220, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <iframe
                  title="Hotel Location"
                  width="100%" height="220" style={{ border: 0 }} loading="lazy"
                  src={`https://maps.google.com/maps?q=${hotel.latitude && hotel.longitude ? `${hotel.latitude},${hotel.longitude}` : encodeURIComponent((hotel.address || '') + ' ' + (hotel.city || ''))}&output=embed`}
                />
              </div>
            </div>

            {/* REVIEWS */}
            <div ref={sectionRefs.reviews} className="detail-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Rating &amp; Reviews</h3>
                {avgRating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--sage-light)', borderRadius: 8, padding: '4px 12px' }}>
                    <Star size={14} className="star" fill="currentColor" />
                    <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--sage-dark)' }}>{avgRating}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/ 5 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              {reviews.length === 0
                ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
                : reviews.map(r => (
                  <div key={r.id} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">{(r.customer_name || 'G')[0].toUpperCase()}</div>
                      <div>
                        <div className="review-name">{r.customer_name || 'Guest'}</div>
                        <div className="review-date">{formatDate(r.created_at)}</div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}><span className="badge badge-success">{r.rating} ★</span></div>
                    </div>
                    <div className="review-comment">{r.comment}</div>
                  </div>
                ))
              }
            </div>

            {/* RULES & POLICIES */}
            <div ref={sectionRefs.policies} className="detail-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Shield size={18} style={{ color: 'var(--sage)' }} />
                <h3 style={{ margin: 0 }}>Rules &amp; Policies</h3>
              </div>
              {[
                { label: 'Check-in Time', value: hotel.check_in_time || '12:00 PM' },
                { label: 'Check-out Time', value: hotel.check_out_time || '11:00 AM' },
                { label: 'Cancellation Policy', value: hotel.cancellation_policy || 'Free cancellation up to 24 hours before check-in. After that, 1 night charge applies.' },
                { label: 'Pets', value: hotel.pets_allowed ? 'Pets allowed' : 'Pets not allowed' },
                { label: 'Smoking', value: hotel.smoking_allowed ? 'Smoking allowed in designated areas' : 'Non-smoking property' },
                { label: 'Outside Food', value: 'Outside food is not allowed inside the premises.' },
                { label: 'ID Proof', value: 'Valid government-issued photo ID required at check-in.' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ minWidth: 160, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', flex: 1 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div ref={sectionRefs.faqs} className="detail-section" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <HelpCircle size={18} style={{ color: 'var(--sage)' }} />
                <h3 style={{ margin: 0 }}>FAQs</h3>
              </div>
              {[
                { q: 'Is breakfast included?', a: hotel.breakfast_included ? 'Yes, complimentary breakfast is included.' : 'Breakfast is not included but available at an additional cost.' },
                { q: 'Is there free parking?', a: (hotel.amenities || []).includes('Parking') ? 'Yes, free parking is available on the premises.' : 'Parking is not available at this property.' },
                { q: 'Is there free WiFi?', a: (hotel.amenities || []).includes('Free WiFi') ? 'Yes, free WiFi is available throughout the property.' : 'WiFi is not available at this property.' },
                { q: 'What is the check-in process?', a: 'Please carry a valid government-issued photo ID. Check-in is available from ' + (hotel.check_in_time || '12:00 PM') + '.' },
                { q: 'Can I request an early check-in?', a: 'Early check-in is subject to availability. Please contact the hotel in advance.' },
              ].map(({ q, a }, i) => (
                <FaqItem key={i} question={q} answer={a} />
              ))}
            </div>

          </div>

          {/* BOOKING CARD */}
          <div ref={bookingRef}>
            <div className="booking-card">
              {selectedRoom ? (
                <div style={{ background: 'var(--sage-light)', border: '1px solid var(--sage)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--sage-dark)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Selected Room</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedRoom.name || `Room ${selectedRoom.room_number}`}</div>
                  </div>
                  <button onClick={() => setSelectedRoom(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={14} /></button>
                </div>
              ) : (
                <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--warning-text)', fontWeight: 500 }}>
                  ← Select a room from the list to continue
                </div>
              )}

              <div className="booking-price">
                {selectedRoom ? formatPrice(selectedRoom.price_per_night) : formatPrice(hotel.price_from || 0)}
                <small> /night</small>
              </div>
              <div className="booking-divider" />

              <div className="form-group">
                <label className="label">Check-in</label>
                <input className="input" type="date" value={checkIn} min={today}
                  onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }} />
              </div>
              <div className="form-group">
                <label className="label">Check-out</label>
                <input className="input" type="date" value={checkOut} min={checkIn || today}
                  onChange={e => setCheckOut(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">Guests</label>
                <select className="input" value={guests} onChange={e => setGuests(+e.target.value)}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Rooms</label>
                <select className="input" value={roomsCount} onChange={e => setRoomsCount(+e.target.value)}>
                  {[1,2,3].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>

              {selectedRoom && checkIn && checkOut && nights > 0 && (
                <>
                  <div className="booking-divider" />
                  <div className="booking-row"><span>{formatPrice(selectedRoom.price_per_night)} × {nights} nights × {roomsCount} room{roomsCount > 1 ? 's' : ''}</span><span>{formatPrice(baseAmount)}</span></div>
                  <div className="booking-row"><span>Taxes (12%)</span><span>{formatPrice(taxAmount)}</span></div>
                  {discount > 0 && <div className="booking-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="booking-row total"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
                </>
              )}

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="label">Coupon Code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input" placeholder="Enter code" value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponError(''); setDiscount(0) }} />
                  <button className="btn btn-secondary btn-sm" onClick={applyCoupon} disabled={couponLoading || !couponCode || !baseAmount}>
                    {couponLoading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Apply'}
                  </button>
                </div>
                {couponError && <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: 4 }}>{couponError}</div>}
                {discount > 0 && <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: 4 }}>✓ Saved {formatPrice(discount)}!</div>}
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}
                onClick={handleBook}
                disabled={!selectedRoom || !checkIn || !checkOut || nights < 1}>
                {!selectedRoom ? 'Select a Room First' : !checkIn || !checkOut ? 'Select Dates' : `Book Now — ${formatPrice(totalAmount)}`}
              </button>

              {!user && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>You'll be asked to sign in before booking</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
