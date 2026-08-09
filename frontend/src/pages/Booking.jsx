import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { formatPrice, formatDate } from '../lib/format'
import { Check, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react'

export default function Booking() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile } = useAuth()
  const b = location.state || {}

  const [guestName, setGuestName] = useState(profile?.full_name || '')
  const [guestEmail, setGuestEmail] = useState(user?.email || '')
  const [guestPhone, setGuestPhone] = useState(profile?.phone || '')
  const [specialRequests, setSpecialRequests] = useState('')
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  if (!b.hotelId) {
    return <div className="container empty-state" style={{ paddingTop: 48 }}>
      <h3>No booking selected</h3>
      <p>Please select a room from a hotel to start booking.</p>
      <button className="btn btn-primary" onClick={() => navigate('/hotels')}>Browse Hotels</button>
    </div>
  }

  const handleConfirm = async () => {
    if (!guestName || !guestEmail || !guestPhone) { setError('Please fill in all guest details'); return }
    if (!user) { navigate('/login'); return }
    setLoading(true)
    setError('')

    try {
      const { data: booking, error: bErr } = await supabase.from('bookings').insert({
        customer_id: user.id,
        hotel_id: b.hotelId,
        room_id: b.roomId,
        check_in: b.checkIn,
        check_out: b.checkOut,
        nights: b.nights,
        guests: b.guests,
        rooms_count: b.roomsCount,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        base_amount: b.baseAmount,
        discount_amount: b.discount,
        tax_amount: b.taxAmount,
        total_amount: b.totalAmount,
        coupon_code: b.couponCode || '',
        status: 'confirmed',
        special_requests: specialRequests,
      }).select().single()

      if (bErr) throw bErr

      await supabase.from('payments').insert({
        booking_id: booking.id,
        customer_id: user.id,
        amount: b.totalAmount,
        method,
        status: 'paid',
        transaction_id: 'TXN' + Date.now(),
        payment_date: new Date().toISOString(),
      })

      const { data: settings } = await supabase.from('settings').select('default_commission_rate').eq('id', 1).maybeSingle()
      const rate = settings?.default_commission_rate || 10
      await supabase.from('commissions').insert({
        booking_id: booking.id,
        hotel_id: b.hotelId,
        booking_amount: b.totalAmount,
        commission_rate: rate,
        commission_amount: Math.round(b.totalAmount * rate / 100),
        payout_status: 'pending',
      })

      if (b.couponCode) {
        const { data: coupon } = await supabase.from('coupons').select('used_count').eq('code', b.couponCode).maybeSingle()
        if (coupon) await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('code', b.couponCode)
      }

      setSuccess(booking)
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container" style={{ paddingTop: 48, paddingBottom: 48, maxWidth: 600, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={32} color="#15803d" />
        </div>
        <h2>Booking Confirmed!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your booking reference is <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{success.booking_reference}</strong></p>

        <div className="card" style={{ textAlign: 'left', padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Hotel</span><strong>{b.hotelName}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Room</span><strong>{b.roomName}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Check-in</span><strong>{formatDate(b.checkIn)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Check-out</span><strong>{formatDate(b.checkOut)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Guests</span><strong>{b.guests}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', fontWeight: 700 }}><span>Total Paid</span><span>{formatPrice(b.totalAmount)}</span></div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Home</button>
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
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48, maxWidth: 900 }}>
      <h2 style={{ marginBottom: 24 }}>Confirm Your Booking</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Guest Details</h3>
            <div className="reg-grid">
              <div className="form-group">
                <label className="label">Full Name</label>
                <input className="input" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label className="label">Phone</label>
                <input className="input" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label className="label">Special Requests</label>
                <input className="input" value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Any special requests?" />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {methods.map(m => {
                const Icon = m.icon
                return (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', border: method === m.id ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius)', background: method === m.id ? 'var(--primary-light)' : 'var(--surface)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.15s',
                  }}>
                    <Icon size={18} /> {m.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="booking-card">
            <h3 style={{ marginBottom: 16 }}>Booking Summary</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{b.hotelName}</div>
            <div style={{ fontSize: '0.85rem', marginBottom: 16 }}>{b.roomName}</div>
            <div className="booking-row"><span>Check-in</span><span>{formatDate(b.checkIn)}</span></div>
            <div className="booking-row"><span>Check-out</span><span>{formatDate(b.checkOut)}</span></div>
            <div className="booking-row"><span>Nights</span><span>{b.nights}</span></div>
            <div className="booking-row"><span>Guests</span><span>{b.guests}</span></div>
            <div className="booking-row"><span>Rooms</span><span>{b.roomsCount}</span></div>
            <div className="booking-divider" />
            <div className="booking-row"><span>Base Amount</span><span>{formatPrice(b.baseAmount)}</span></div>
            {b.discount > 0 && <div className="booking-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>-{formatPrice(b.discount)}</span></div>}
            <div className="booking-row"><span>Taxes</span><span>{formatPrice(b.taxAmount)}</span></div>
            <div className="booking-row total"><span>Total</span><span>{formatPrice(b.totalAmount)}</span></div>

            {error && <div className="auth-error" style={{ marginTop: 12 }}>{error}</div>}

            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={handleConfirm} disabled={loading}>
              {loading ? <span className="spinner" /> : `Pay ${formatPrice(b.totalAmount)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
