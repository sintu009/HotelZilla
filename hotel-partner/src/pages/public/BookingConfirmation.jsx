import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import LandingHeader from '../../components/LandingHeader'
import LandingFooter from '../../components/LandingFooter'
import { formatPrice, formatDate } from '../../lib/format'

export default function BookingConfirmation() {
  const navigate = useNavigate()
  const { state } = useLocation()

  if (!state?.ref) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LandingHeader />
        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
          <p className="text-gray-500 text-base mb-4">No booking found.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--brand-gradient)' }}>
            Go Home
          </button>
        </div>
        <LandingFooter />
      </div>
    )
  }

  const { ref, hotelName, roomName, checkIn, checkOut, nights, guests, total } = state

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />

      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--primary-light)' }}>
            <CheckCircle size={32} style={{ color: 'var(--primary)' }} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-6">Your reservation has been successfully placed.</p>

          <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Booking Ref</span>
              <span className="font-bold font-mono" style={{ color: 'var(--primary)' }}>{ref}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hotel</span>
              <span className="font-semibold text-gray-800">{hotelName}</span>
            </div>
            {roomName && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Room</span>
                <span className="font-semibold text-gray-800">{roomName}</span>
              </div>
            )}
            {checkIn && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-in</span>
                <span className="font-semibold text-gray-800">{formatDate(checkIn)}</span>
              </div>
            )}
            {checkOut && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-out</span>
                <span className="font-semibold text-gray-800">{formatDate(checkOut)}</span>
              </div>
            )}
            {nights > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nights</span>
                <span className="font-semibold text-gray-800">{nights}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Guests</span>
              <span className="font-semibold text-gray-800">{guests}</span>
            </div>
            {total > 0 && (
              <div className="flex justify-between text-sm border-t border-gray-200 pt-3 font-bold">
                <span className="text-gray-900">Total Paid</span>
                <span style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-6">A confirmation has been sent to your email. Please save your booking reference.</p>

          <div className="flex gap-3">
            <button onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
              <Home size={14} /> Home
            </button>
            <button onClick={() => navigate('/rooms')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--brand-gradient)' }}>
              Browse Rooms <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}
