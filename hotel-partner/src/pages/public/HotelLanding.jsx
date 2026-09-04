import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Wifi, Car, Coffee, Waves, Dumbbell, Check, ArrowRight, Phone, Mail } from 'lucide-react'
import LandingHeader from '../../components/LandingHeader'
import LandingFooter from '../../components/LandingFooter'
import { getPartnerId, fetchHotelConfig, fetchHotelRooms } from '../../lib/usePartner'
import { formatPrice } from '../../lib/format'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'Spa': Waves, 'Beach Access': Waves }
const featureIcons = [Star, Check, Phone, Mail]

export default function HotelLanding() {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = getPartnerId()
    if (!id) { setLoading(false); return }
    fetchHotelConfig(id)
      .then(cfg => {
        setConfig(cfg)
        return fetchHotelRooms(cfg.id)
      })
      .then(r => setRooms(r))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  if (!config) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Hotel not found or landing page is not enabled.
    </div>
  )

  const features = [
    { title: config.feature1_title || 'Premium Quality',      desc: config.feature1_desc || 'Carefully curated rooms with top-tier amenities.' },
    { title: config.feature2_title || 'Best Price Guarantee', desc: config.feature2_desc || 'Book directly and get the best available rates.' },
    { title: config.feature3_title || '24/7 Support',         desc: config.feature3_desc || 'Our team is available around the clock.' },
    { title: config.feature4_title || 'Instant Confirmation', desc: config.feature4_desc || 'Receive your booking confirmation immediately.' },
  ]

  const featuredRooms = rooms.slice(0, 3)
  const amenities = config.amenities || []

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader config={config} />

      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={config.cover_image} alt={config.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <div className="flex items-center gap-1.5 mb-4">
              {[...Array(config.star_rating || 3)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-white/80 text-sm ml-1">{config.star_rating || 3}-Star Hotel</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              {config.hero_heading || config.name}
            </h1>
            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-6">
              <MapPin size={14} /> {config.address || config.city}
            </div>
            <p className="text-white/80 text-base leading-relaxed mb-8 max-w-md">
              {config.hero_subheading || config.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate(`/book${window.location.search}`)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'var(--brand-gradient)' }}>
                Book Your Stay <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate(`/rooms${window.location.search}`)}
                className="px-7 py-3.5 rounded-xl text-white font-semibold text-base border border-white/40 hover:bg-white/10 transition-all">
                View Rooms
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities strip */}
      {amenities.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-6 justify-center md:justify-start">
            {amenities.slice(0, 7).map(a => {
              const Icon = amenityIcons[a] || Check
              return (
                <div key={a} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Icon size={15} style={{ color: 'var(--primary)' }} /> {a}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Featured Rooms */}
      {featuredRooms.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--primary)' }}>Accommodations</p>
              <h2 className="text-3xl font-bold text-gray-900">Our Rooms & Suites</h2>
            </div>
            <button onClick={() => navigate(`/rooms${window.location.search}`)}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold hover:opacity-80" style={{ color: 'var(--primary)' }}>
              View all rooms <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRooms.map(room => (
              <div key={room.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {room.images?.[0]
                    ? <img src={room.images[0]} alt={room.room_type} className="w-full h-full object-cover" />
                    : <div className="absolute inset-0 flex items-center justify-center"><div className="text-4xl">🛏</div></div>
                  }
                  <div className="absolute top-3 right-3 bg-white rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm" style={{ color: 'var(--primary)' }}>
                    {formatPrice(room.price_per_night)}/night
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{room.room_type}</h3>
                  <div className="flex gap-4 text-xs text-gray-500 mb-3">
                    <span>Up to {room.capacity} guests</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(room.amenities || []).slice(0, 3).map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 bg-gray-50 rounded-md text-gray-500 border border-gray-100">{a}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/book${window.location.search}`, { state: { roomId: room.id, roomType: room.room_type, pricePerNight: room.price_per_night, hotelId: config.id } })}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--brand-gradient)' }}>
                    Book This Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--primary)' }}>Why Choose Us</p>
            <h2 className="text-3xl font-bold text-gray-900">The {config.brand_name || config.name} Experience</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = featureIcons[i]
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Icon size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden" style={{ background: 'var(--brand-gradient)' }}>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{config.cta_heading || 'Ready for an Unforgettable Stay?'}</h2>
            <p className="text-white/80 text-base mb-8 max-w-md mx-auto">{config.cta_subheading || 'Book directly and enjoy exclusive rates.'}</p>
            <button onClick={() => navigate(`/book${window.location.search}`)}
              className="inline-flex items-center gap-2 bg-white px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ color: 'var(--primary)' }}>
              Book Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <LandingFooter config={config} />
    </div>
  )
}
