import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Check, Wifi, Car, Coffee, Waves, Dumbbell } from 'lucide-react'
import LandingHeader from '../../components/LandingHeader'
import LandingFooter from '../../components/LandingFooter'
import { getPartnerId, fetchHotelConfig, fetchHotelRooms } from '../../lib/usePartner'
import { formatPrice } from '../../lib/format'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'Spa': Waves }

export default function HotelRooms() {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [rooms, setRooms] = useState([])
  const [maxPrice, setMaxPrice] = useState(50000)
  const [minGuests, setMinGuests] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = getPartnerId()
    if (!id) { setLoading(false); return }
    fetchHotelConfig(id)
      .then(cfg => { setConfig(cfg); return fetchHotelRooms(cfg.id) })
      .then(r => {
        setRooms(r)
        if (r.length) setMaxPrice(Math.max(...r.map(x => x.price_per_night)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = rooms.filter(r => r.price_per_night <= maxPrice && r.capacity >= minGuests)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader config={config} />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--primary)' }}>Accommodations</p>
          <h1 className="text-3xl font-bold text-gray-900">{config?.name} — Rooms & Suites</h1>
          <p className="text-gray-500 text-sm mt-1">{rooms.length} room types available</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 text-sm mb-5">Filter Rooms</h3>
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Max Price / Night</label>
              <input type="range" min={500} max={Math.max(...rooms.map(r => r.price_per_night), 50000)} step={500}
                value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full accent-[var(--primary)]" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹500</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{formatPrice(maxPrice)}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Min Guests</label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => setMinGuests(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${minGuests === n ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300'}`}
                    style={minGuests === n ? { background: 'var(--brand-gradient)' } : {}}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
              No rooms match your filters.
            </div>
          ) : filtered.map(room => (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-56 h-44 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {room.images?.[0]
                    ? <img src={room.images[0]} alt={room.room_type} className="w-full h-full object-cover" />
                    : <div className="text-5xl">🛏</div>
                  }
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{room.room_type}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Users size={13} /> Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(room.amenities || []).map(a => {
                        const Icon = amenityIcons[a] || Check
                        return (
                          <span key={a} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-50 rounded-lg text-gray-600 border border-gray-100">
                            <Icon size={11} style={{ color: 'var(--primary)' }} /> {a}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0 min-w-[140px]">
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{formatPrice(room.price_per_night)}</div>
                      <div className="text-xs text-gray-400">per night</div>
                    </div>
                    <button
                      onClick={() => navigate(`/book${window.location.search}`, { state: { roomId: room.id, roomType: room.room_type, pricePerNight: room.price_per_night, hotelId: config?.id } })}
                      className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--brand-gradient)' }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LandingFooter config={config} />
    </div>
  )
}
