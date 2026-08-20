import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HOTELS, ROOMS, REVIEWS } from '../../lib/mockData'
import { formatPrice, formatDate, nightsBetween } from '../../lib/format'
import { Star, MapPin, Check, Users, Bed, Maximize, Wifi, Car, Coffee, Dumbbell, Waves, ArrowLeft } from 'lucide-react'

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

  if (!hotel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0efef]">
        <h3 className="font-display text-2xl font-bold text-[#252525]">Hotel not found</h3>
        <button onClick={() => navigate('/hotels')} className="mt-4 rounded-xl bg-[#c49c74] px-6 py-3 font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84]">Back to Hotels</button>
      </div>
    )
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : hotel.rating

  return (
    <div className="min-h-screen bg-[#f0efef]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#1c1c1c] px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-end gap-0.5 text-[#f6f6f6]">
            <span className="font-display text-2xl font-normal tracking-[0.1px] lg:text-3xl">Bookme.</span>
            <span className="font-display text-base font-normal tracking-[0.1px] lg:text-lg">com</span>
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            <button onClick={() => navigate('/')} className="font-display text-base text-white/80 hover:text-white">Home</button>
            <button onClick={() => navigate('/hotels')} className="font-display text-base text-white hover:text-white/80">Hotels</button>
            <button onClick={() => navigate('/dashboard')} className="font-display text-base text-white/80 hover:text-white">Partner</button>
          </nav>
          <button onClick={() => navigate('/dashboard')} className="rounded-full bg-[#c49c74] px-6 py-2 font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84]">Sign in</button>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-12">
        <button onClick={() => navigate('/hotels')} className="mb-6 flex items-center gap-2 font-display text-base text-[#252525] hover:text-[#c49c74]">
          <ArrowLeft className="h-4 w-4" /> Back to Hotels
        </button>

        {/* Gallery */}
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img src={hotel.cover_image} alt={hotel.name} className="h-[400px] w-full object-cover" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main info */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#c49c74] text-[#c49c74]" />)}
              <span className="rounded-full bg-[#c49c74]/15 px-3 py-1 font-display text-sm font-bold text-[#c49c74]">{avgRating} ★</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-[#252525] lg:text-4xl">{hotel.name}</h1>
            <div className="mt-2 flex items-center gap-1 font-display text-base text-[#a1a7b0]">
              <MapPin className="h-4 w-4" /> {hotel.address}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {hotel.amenities.map(a => {
                const Icon = amenityIcons[a] || Check
                return <span key={a} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-display text-sm text-[#252525]"><Icon className="h-3.5 w-3.5" /> {a}</span>
              })}
            </div>

            <div className="mt-8">
              <h3 className="font-display text-xl font-bold text-[#252525]">About</h3>
              <p className="mt-3 font-display text-base leading-relaxed text-[#252525]">{hotel.description}</p>
            </div>

            {/* Rooms */}
            <div className="mt-8">
              <h3 className="font-display text-xl font-bold text-[#252525]">Available Rooms</h3>
              <div className="mt-4 space-y-4">
                {rooms.map(room => (
                  <div key={room.id} className={`rounded-2xl bg-white p-5 transition-all ${selectedRoom?.id === room.id ? 'ring-2 ring-[#c49c74]' : 'shadow-md'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-lg font-bold text-[#252525]">{room.name}</h4>
                        <div className="mt-2 flex flex-wrap gap-4 font-display text-sm text-[#a1a7b0]">
                          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {room.max_guests} guests</span>
                          <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {room.bed_type}</span>
                          <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {room.size_sqft} sqft</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {room.amenities.map(a => <span key={a} className="rounded-full bg-[#f0efef] px-2.5 py-1 font-display text-xs text-[#252525]">{a}</span>)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-extrabold text-[#c49c74]">{formatPrice(room.base_price)}</div>
                        <div className="font-display text-sm text-[#a1a7b0]">/night</div>
                        <button onClick={() => setSelectedRoom(room)} className={`mt-3 rounded-lg px-4 py-2 font-display text-sm font-medium transition-colors ${selectedRoom?.id === room.id ? 'bg-[#c49c74] text-[#252525]' : 'bg-[#252525] text-white hover:bg-[#1c1c1c]'}`}>
                          {selectedRoom?.id === room.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h3 className="font-display text-xl font-bold text-[#252525]">Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="mt-3 font-display text-base text-[#a1a7b0]">No reviews yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="rounded-2xl bg-white p-5 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c49c74] font-display text-base font-bold text-white">{(r.reviewer || 'G')[0].toUpperCase()}</div>
                        <div>
                          <div className="font-display text-base font-bold text-[#252525]">{r.reviewer}</div>
                          <div className="font-display text-sm text-[#a1a7b0]">{formatDate(r.created_at)}</div>
                        </div>
                        <span className="ml-auto rounded-full bg-[#c49c74]/15 px-3 py-1 font-display text-sm font-bold text-[#c49c74]">{r.rating} ★</span>
                      </div>
                      {r.title && <div className="mt-3 font-display text-base font-semibold text-[#252525]">{r.title}</div>}
                      <p className="mt-1 font-display text-base text-[#252525]">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking card */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-end gap-1">
                <span className="font-display text-2xl font-extrabold text-[#c49c74]">{selectedRoom ? formatPrice(selectedRoom.base_price) : formatPrice(hotel.price_from)}</span>
                <span className="font-display text-base text-[#a1a7b0]">/night</span>
              </div>

              <div className="my-6 h-px bg-[#f0efef]" />

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Check-in</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none" />
                </div>
                <div>
                  <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Check-out</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Guests</label>
                    <select value={guests} onChange={e => setGuests(+e.target.value)} className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-3 font-display text-base text-[#252525] outline-none">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Rooms</label>
                    <select value={roomsCount} onChange={e => setRoomsCount(+e.target.value)} className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-3 font-display text-base text-[#252525] outline-none">
                      {[1,2,3].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {selectedRoom && checkIn && checkOut && (
                <>
                  <div className="my-6 h-px bg-[#f0efef]" />
                  <div className="space-y-2 font-display text-sm">
                    <div className="flex justify-between"><span className="text-[#a1a7b0]">Base ({nights} nights × {roomsCount} rooms)</span><span className="text-[#252525]">{formatPrice(baseAmount)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between"><span className="text-[#a1a7b0]">Taxes (12%)</span><span className="text-[#252525]">{formatPrice(taxAmount)}</span></div>
                    <div className="flex justify-between border-t border-[#f0efef] pt-2 text-base font-bold"><span className="text-[#252525]">Total</span><span className="text-[#c49c74]">{formatPrice(totalAmount)}</span></div>
                  </div>
                </>
              )}

              <div className="mt-4">
                <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Coupon Code</label>
                <div className="flex gap-2">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter code" className="h-11 flex-1 rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none placeholder:text-[#a1a7b0]" />
                  <button onClick={applyCoupon} className="rounded-lg bg-[#252525] px-4 font-display text-sm font-medium text-white hover:bg-[#1c1c1c]">Apply</button>
                </div>
                {couponError && <p className="mt-1 font-display text-sm text-red-500">{couponError}</p>}
                {discount > 0 && <p className="mt-1 font-display text-sm text-green-600">Saved {formatPrice(discount)}!</p>}
              </div>

              <button onClick={handleBook} disabled={!selectedRoom || !checkIn || !checkOut} className="mt-6 h-12 w-full rounded-xl bg-[#c49c74] font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84] disabled:cursor-not-allowed disabled:opacity-50">
                {selectedRoom ? 'Book Now' : 'Select a room to book'}
              </button>
              <p className="mt-2 text-center font-display text-xs text-[#a1a7b0]">Try coupons: WEEKEND20 or EARLY1000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
