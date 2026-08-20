import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { formatPrice, formatDate } from '../../lib/format'
import { Check, CreditCard, Smartphone, Building2, Wallet, ArrowLeft } from 'lucide-react'

export default function PublicBooking() {
  const navigate = useNavigate()
  const location = useLocation()
  const b = location.state || {}

  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  if (!b.hotelId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0efef]">
        <h3 className="font-display text-2xl font-bold text-[#252525]">No booking selected</h3>
        <p className="mt-2 font-display text-base text-[#a1a7b0]">Please select a room from a hotel to start booking.</p>
        <button onClick={() => navigate('/hotels')} className="mt-4 rounded-xl bg-[#c49c74] px-6 py-3 font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84]">Browse Hotels</button>
      </div>
    )
  }

  const handleConfirm = () => {
    if (!guestName || !guestEmail || !guestPhone) { setError('Please fill in all guest details'); return }
    setLoading(true)
    setError('')
    setTimeout(() => {
      setSuccess({ booking_reference: 'BK' + Date.now().toString().slice(-8) })
      setLoading(false)
    }, 800)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0efef] px-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#252525]">Booking Confirmed!</h2>
          <p className="mt-2 font-display text-base text-[#a1a7b0]">Your booking reference is <strong className="font-mono text-[#c49c74]">{success.booking_reference}</strong></p>
          <div className="mt-6 space-y-3 rounded-xl bg-[#f0efef] p-6 text-left">
            <div className="flex justify-between font-display text-base"><span className="text-[#a1a7b0]">Hotel</span><strong className="text-[#252525]">{b.hotelName}</strong></div>
            <div className="flex justify-between font-display text-base"><span className="text-[#a1a7b0]">Room</span><strong className="text-[#252525]">{b.roomName}</strong></div>
            <div className="flex justify-between font-display text-base"><span className="text-[#a1a7b0]">Check-in</span><strong className="text-[#252525]">{formatDate(b.checkIn)}</strong></div>
            <div className="flex justify-between font-display text-base"><span className="text-[#a1a7b0]">Check-out</span><strong className="text-[#252525]">{formatDate(b.checkOut)}</strong></div>
            <div className="flex justify-between font-display text-base"><span className="text-[#a1a7b0]">Guests</span><strong className="text-[#252525]">{b.guests}</strong></div>
            <div className="flex justify-between border-t border-[#e2e8f0] pt-3 font-display text-lg font-bold"><span className="text-[#252525]">Total Paid</span><span className="text-[#c49c74]">{formatPrice(b.totalAmount)}</span></div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={() => navigate('/')} className="rounded-xl bg-[#c49c74] px-6 py-3 font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84]">Go Home</button>
            <button onClick={() => navigate('/hotels')} className="rounded-xl bg-[#252525] px-6 py-3 font-display text-base font-medium text-white hover:bg-[#1c1c1c]">Browse More</button>
          </div>
        </div>
      </div>
    )
  }

  const methods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ]

  return (
    <div className="min-h-screen bg-[#f0efef]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#1c1c1c] px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-end gap-0.5 text-[#f6f6f6]">
            <span className="font-display text-2xl font-normal tracking-[0.1px] lg:text-3xl">Bookme.</span>
            <span className="font-display text-base font-normal tracking-[0.1px] lg:text-lg">com</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="rounded-full bg-[#c49c74] px-6 py-2 font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84]">Sign in</button>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-8 lg:px-12">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 font-display text-base text-[#252525] hover:text-[#c49c74]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h2 className="mb-8 font-display text-3xl font-bold text-[#252525]">Confirm Your Booking</h2>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Guest details */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-4 font-display text-lg font-bold text-[#252525]">Guest Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Full Name</label>
                  <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Enter full name" className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none placeholder:text-[#a1a7b0]" />
                </div>
                <div>
                  <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Email</label>
                  <input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="Enter email" className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none placeholder:text-[#a1a7b0]" />
                </div>
                <div>
                  <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Phone</label>
                  <input value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="Enter phone number" className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none placeholder:text-[#a1a7b0]" />
                </div>
                <div>
                  <label className="mb-1 block font-display text-sm font-medium text-[#252525]">Special Requests</label>
                  <input value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Any special requests?" className="h-11 w-full rounded-lg border-0 bg-[#f0efef] px-4 font-display text-base text-[#252525] outline-none placeholder:text-[#a1a7b0]" />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-4 font-display text-lg font-bold text-[#252525]">Payment Method</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {methods.map(m => {
                  const Icon = m.icon
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)} className={`flex items-center gap-3 rounded-xl px-4 py-4 font-display text-base font-medium transition-all ${method === m.id ? 'bg-[#c49c74]/10 ring-2 ring-[#c49c74]' : 'bg-[#f0efef] hover:bg-[#e8e7e7]'}`}>
                      <Icon className="h-5 w-5 text-[#252525]" /> {m.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 font-display text-lg font-bold text-[#252525]">Booking Summary</h3>
              <div className="mb-2 font-display text-base text-[#a1a7b0]">{b.hotelName}</div>
              <div className="mb-4 font-display text-base text-[#252525]">{b.roomName}</div>
              <div className="space-y-2 font-display text-sm">
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Check-in</span><span className="text-[#252525]">{formatDate(b.checkIn)}</span></div>
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Check-out</span><span className="text-[#252525]">{formatDate(b.checkOut)}</span></div>
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Nights</span><span className="text-[#252525]">{b.nights}</span></div>
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Guests</span><span className="text-[#252525]">{b.guests}</span></div>
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Rooms</span><span className="text-[#252525]">{b.roomsCount}</span></div>
              </div>
              <div className="my-4 h-px bg-[#f0efef]" />
              <div className="space-y-2 font-display text-sm">
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Base Amount</span><span className="text-[#252525]">{formatPrice(b.baseAmount)}</span></div>
                {b.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(b.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-[#a1a7b0]">Taxes</span><span className="text-[#252525]">{formatPrice(b.taxAmount)}</span></div>
                <div className="flex justify-between border-t border-[#f0efef] pt-2 text-base font-bold"><span className="text-[#252525]">Total</span><span className="text-[#c49c74]">{formatPrice(b.totalAmount)}</span></div>
              </div>
              {error && <p className="mt-3 font-display text-sm text-red-500">{error}</p>}
              <button onClick={handleConfirm} disabled={loading} className="mt-6 h-12 w-full rounded-xl bg-[#c49c74] font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84] disabled:opacity-50">
                {loading ? <span className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[#252525] border-t-transparent" /> : `Pay ${formatPrice(b.totalAmount)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
