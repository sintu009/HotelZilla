import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Save as Waves, ArrowRight, Search } from 'lucide-react'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves }

export default function Landing() {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [destinations, setDestinations] = useState([])
  const [offers, setOffers] = useState([])
  const [banners, setBanners] = useState([])
  const [homepage, setHomepage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [bannerIdx, setBannerIdx] = useState(0)

  useEffect(() => {
    Promise.all([
      supabase.from('hotels').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(8),
      supabase.from('cms_destinations').select('*').eq('is_active', true).order('display_order'),
      supabase.from('offers').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('cms_banners').select('*').eq('is_active', true).order('display_order'),
      supabase.from('cms_homepage').select('*').eq('id', 1).maybeSingle(),
    ]).then(([h, d, o, b, hp]) => {
      setHotels(h.data || [])
      setDestinations(d.data || [])
      setOffers(o.data || [])
      setBanners(b.data || [])
      setHomepage(hp.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [banners.length])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/hotels${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url(https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg)' }} />
        <div className="hero-content">
          <h1>{homepage?.hero_title || 'Find Your Perfect Stay'}</h1>
          <p>{homepage?.hero_subtitle || 'Discover and book from thousands of hotels worldwide'}</p>
          <form className="search-bar" onSubmit={handleSearch} style={{ marginTop: 8 }}>
            <div className="search-field">
              <label className="label">Destination</label>
              <input className="input" placeholder={homepage?.hero_search_placeholder || 'Search by city, hotel, or location'} value={searchCity} onChange={e => setSearchCity(e.target.value)} />
            </div>
            <div className="search-field">
              <label className="label">Check-in</label>
              <input className="input" type="date" />
            </div>
            <div className="search-field">
              <label className="label">Check-out</label>
              <input className="input" type="date" />
            </div>
            <div className="search-field" style={{ flex: '0 0 auto' }}>
              <label className="label">Guests</label>
              <select className="input"><option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>4+ Guests</option></select>
            </div>
            <button type="submit" className="btn btn-primary btn-lg"><Search size={18} /> Search</button>
          </form>
        </div>
      </section>

      {/* Banner carousel */}
      {banners.length > 0 && (
        <section className="container" style={{ paddingTop: 32 }}>
          <div className="banner-carousel">
            {banners.map((b, i) => (
              <div key={b.id} className={`banner-slide ${i === bannerIdx ? 'active' : ''}`}>
                <img src={b.image_url} alt={b.title} />
                <div className="banner-slide-overlay">
                  <h2 style={{ color: '#fff' }}>{b.title}</h2>
                  <p style={{ opacity: 0.9 }}>{b.subtitle}</p>
                </div>
              </div>
            ))}
            <div className="banner-dots">
              {banners.map((_, i) => (
                <div key={i} className={`banner-dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Hotels */}
      <section className="container section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 className="section-title">Featured Hotels</h2>
            <p className="section-subtitle">Handpicked stays for you</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/hotels')}>View All <ArrowRight size={14} /></button>
        </div>
        {loading ? (
          <div className="hotel-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
          </div>
        ) : (
          <div className="hotel-grid">
            {hotels.map(hotel => (
              <div key={hotel.id} className="card hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                <img className="hotel-card-img" src={hotel.cover_image || hotel.images?.[0] || 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg'} alt={hotel.name} />
                <div className="hotel-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={12} className="star" fill="currentColor" />)}
                  </div>
                  <div className="hotel-card-name">{hotel.name}</div>
                  <div className="hotel-card-location"><MapPin size={12} style={{ display: 'inline', marginRight: 2 }} />{hotel.city}, {hotel.state}</div>
                  <div className="hotel-card-amenities">
                    {(hotel.amenities || []).slice(0, 3).map(a => <span key={a} className="hotel-card-amenity">{a}</span>)}
                  </div>
                  <div className="hotel-card-footer">
                    <div className="hotel-card-price">{formatPrice(hotel.price_from)} <small>/night</small></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Destinations */}
      {destinations.length > 0 && (
        <section className="container section">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Explore top cities and their best stays</p>
          <div className="dest-grid">
            {destinations.map(d => (
              <div key={d.id} className="dest-card" onClick={() => navigate(`/hotels?city=${encodeURIComponent(d.name)}`)}>
                <img src={d.image_url} alt={d.name} />
                <div className="dest-card-overlay">
                  <div className="dest-card-name">{d.name}</div>
                  <div className="dest-card-count">{d.hotel_count}+ Hotels</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Offers */}
      {offers.length > 0 && (
        <section className="container section">
          <h2 className="section-title">Exclusive Offers</h2>
          <p className="section-subtitle">Save big on your next stay</p>
          <div className="offer-grid">
            {offers.map(o => (
              <div key={o.id} className="offer-card" onClick={() => navigate('/offers')}>
                <img src={o.image_url} alt={o.title} />
                <div className="offer-card-overlay">
                  <div className="offer-card-title">{o.title}</div>
                  <div className="offer-card-desc">{o.description}</div>
                  {o.code && <span className="offer-card-code">Code: {o.code}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Book With Us */}
      <section className="container section">
        <h2 className="section-title">{homepage?.feature_section_title || 'Why Book With Us'}</h2>
        <p className="section-subtitle">We make hotel booking simple and rewarding</p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><Star size={24} /></div>
            <div className="feature-title">Best Price Guarantee</div>
            <div className="feature-desc">Find a lower price and we'll match it</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MapPin size={24} /></div>
            <div className="feature-title">Top Locations</div>
            <div className="feature-desc">Hotels in the best destinations</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Waves size={24} /></div>
            <div className="feature-title">Premium Amenities</div>
            <div className="feature-desc">Curated stays with great facilities</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Coffee size={24} /></div>
            <div className="feature-title">24/7 Support</div>
            <div className="feature-desc">We're here whenever you need us</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{homepage?.stats_hotels || '50,000+'}</div>
            <div className="stat-label">Hotels</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{homepage?.stats_customers || '10M+'}</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{homepage?.stats_cities || '1,500+'}</div>
            <div className="stat-label">Cities</div>
          </div>
        </div>
      </section>
    </div>
  )
}


