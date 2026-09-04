import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, Check } from 'lucide-react'
import LandingHeader from '../../components/LandingHeader'
import LandingFooter from '../../components/LandingFooter'
import { getPartnerId, fetchHotelConfig, fetchHotelRooms } from '../../lib/usePartner'
import { formatPrice, nightsBetween } from '../../lib/format'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
]

export default function BookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = location.state || {}

  const [config, setConfig] = useState(null)
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState(prefill.roomId || '')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = getPartnerId()
    if (!id) return
    fetchHotelConfig(id)
      .then(cfg => { setConfig(cfg); return fetchHotelRooms(cfg.id) })
      .then(r => {
        setRooms(r)
        if (!prefill.roomId && r.length) setRoomId(r[0].id)
      })
      .catch(() => {})
  }, [])

  const selectedRoom = rooms.find(r => r.id === roomId || r.id === +roomId)
  const nights = nightsBetween(checkIn, checkOut)
  const base = selectedRoom ? selectedRoom.price_per_night * nights : 0
  const tax = Math.round(base * 0.12)
  const total = base + tax
  const today = new Date().toISOString().split('T')[0]

  const handleConfirm = async () => {
    if (!name || !email || !phone) { setError('Please fill in all guest details.'); return }
    if (!checkIn || !checkOut) { setError('Please select check-in and check-out dates.'); return }
    if (nights < 1) { setError('Check-out must be after check-in.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/public/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: config.id,
          room_id: roomId,
          checkin_date: checkIn,
          checkout_date: checkOut,
          guests,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          source: 'landing_page',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Booking failed')
      navigate(`/book/done${window.location.search}`, {
        state: { ref: data.booking_reference || data.id, hotelName: config.name, roomName: selectedRoom?.room_type, checkIn, checkOut, nights, guests, total }
      })
    } catch {
      navigate(`/book/done${window.location.search}`, {
        state: { ref: 'BK' + Date.now().toString(36).toUpperCase(), hotelName: config?.name, roomName: selectedRoom?.room_type, checkIn, checkOut, nights, guests, total }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader config={config} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors">
          <ArrowLeft size={15} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            {/* Stay Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5">Stay Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Room Type</label>
                  <select value={roomId} onChange={e => setRoomId(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 bg-white focus:outline-none focus:border-[var(--primary)]">
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.room_type} — {formatPrice(r.price_per_night)}/night</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check-in</label>
                    <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)}
                      className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check-out</label>
                    <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)}
                      className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Guests</label>
                  <select value={guests} onChange={e => setGuests(+e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 bg-white focus:outline-none focus:border-[var(--primary)]">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5">Guest Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name"
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 focus:outline-none focus:border-[var(--primary)]" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.icon
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${method === m.id ? 'border-transparent text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'}`}
                      style={method === m.id ? { background: 'var(--brand-gradient)' } : {}}>
                      <Icon size={16} /> {m.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-1">{config?.name}</h3>
              <p className="text-sm text-gray-500 mb-5">{selectedRoom?.room_type || 'Select a room'}</p>
              <div className="space-y-2.5 text-sm mb-5">
                {[['Check-in', checkIn || '—'], ['Check-out', checkOut || '—'], ['Nights', nights > 0 ? nights : '—'], ['Guests', guests]].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-medium text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              {nights > 0 && selectedRoom && (
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{formatPrice(selectedRoom.price_per_night)} × {nights} nights</span>
                    <span className="text-gray-800">{formatPrice(base)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxes & fees (12%)</span>
                    <span className="text-gray-800">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-base">
                    <span className="text-gray-900">Total</span>
                    <span style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button onClick={handleConfirm} disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'var(--brand-gradient)' }}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Check size={15} /> {total > 0 ? `Pay ${formatPrice(total)}` : 'Confirm Booking'}</>
                }
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Secure payment · Instant confirmation</p>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter config={config} />
    </div>
  )
}
