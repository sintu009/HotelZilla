import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import {
  Star, MapPin, Coffee, Wifi, Car, Dumbbell,
  ArrowRight, Search, CalendarDays, UsersRound,
  ChevronDown, Shield, Clock, ThumbsUp, Phone
} from 'lucide-react'
import hotelsApi from '../api/hotels'
import client from '../api/client'

const today    = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const AMENITY_ICONS = { WiFi: <Wifi size={13}/>, Parking: <Car size={13}/>, Gym: <Dumbbell size={13}/>, Breakfast: <Coffee size={13}/> }

const DEFAULT_FEATURE_ICONS = [
  <Shield size={28}/>, <ThumbsUp size={28}/>, <Star size={28}/>,
  <Clock size={28}/>,  <Coffee size={28}/>,   <Phone size={28}/>,
]

const FALLBACK_DESTINATIONS = [
  { id: 1, name: 'Mumbai',    hotel_count: 320, image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80' },
  { id: 2, name: 'Delhi',     hotel_count: 280, image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80' },
  { id: 3, name: 'Bangalore', hotel_count: 210, image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80' },
  { id: 4, name: 'Goa',       hotel_count: 180, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
  { id: 5, name: 'Jaipur',    hotel_count: 150, image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80' },
  { id: 6, name: 'Chennai',   hotel_count: 130, image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80' },
]

const FALLBACK_OFFERS = [
  { id: 1, title: 'Weekend Getaway', description: 'Flat 20% off on weekend stays at select hotels', code: 'WEEKEND20', image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80' },
  { id: 2, title: 'Early Bird Deal', description: 'Book 7 days in advance and save up to 15%', code: 'EARLY15',   image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 3, title: 'Couple Special',  description: 'Romantic stays with complimentary breakfast', code: 'COUPLE10', image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80' },
  { id: 4, title: 'Business Travel', description: 'Exclusive rates for corporate bookings',       code: 'BIZ25',    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [searchCity, setSearchCity]           = useState('')
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [checkin, setCheckin]                 = useState(today)
  const [checkout, setCheckout]               = useState(tomorrow)
  const [showDatePanel, setShowDatePanel]     = useState(false)
  const [showGuestPanel, setShowGuestPanel]   = useState(false)
  const [rooms, setRooms]     = useState(1)
  const [adults, setAdults]   = useState(1)
  const [children, setChildren] = useState(0)
  const datePanelRef  = useRef(null)
  const guestPanelRef = useRef(null)

  const [hotels, setHotels]           = useState([])
  const [destinations, setDestinations] = useState(FALLBACK_DESTINATIONS)
  const [offers, setOffers]           = useState(FALLBACK_OFFERS)
  const [cmsContent, setCmsContent]   = useState({
    hero_title: 'Hotels You Can Trust',
    hero_subtitle: 'Guaranteed quality stays at the best prices',
    hero_show_text: true,
    stats_hotels: '50,000+', stats_customers: '10M+', stats_cities: '1,500+',
    feature_section_title: 'Why Book With HotelZilla',
    features: [
      { image: '', title: 'Verified Quality',  desc: 'Every hotel is inspected and quality-certified before listing', show_text: true },
      { image: '', title: 'Best Price',        desc: 'Guaranteed lowest prices — we match any lower rate you find',  show_text: true },
      { image: '', title: 'Reward Points',     desc: 'Earn points on every stay and redeem for free nights',         show_text: true },
      { image: '', title: 'Instant Booking',   desc: 'Confirm your stay in seconds with real-time availability',     show_text: true },
      { image: '', title: 'Free Breakfast',    desc: 'Complimentary breakfast at 5,000+ partner properties',        show_text: true },
      { image: '', title: '24/7 Support',      desc: 'Round-the-clock customer support via chat, call or email',    show_text: true },
    ],
  })

  useEffect(() => {
    hotelsApi.search().then(r => setHotels(r.data || [])).catch(() => {})
    client.get('/api/admin/cms/public/destinations').then(r => { const d = r.data || r; if (Array.isArray(d) && d.length) setDestinations(d) }).catch(() => {})
    client.get('/api/admin/cms/public/offers').then(r => { const d = r.data || r; if (Array.isArray(d) && d.length) setOffers(d) }).catch(() => {})
    client.get('/api/admin/cms/public/homepage').then(r => { if (r && Object.keys(r).length) setCmsContent(p => ({ ...p, ...r })) }).catch(() => {})
  }, [])

  useEffect(() => {
    const h = e => {
      if (datePanelRef.current  && !datePanelRef.current.contains(e.target))  setShowDatePanel(false)
      if (guestPanelRef.current && !guestPanelRef.current.contains(e.target)) setShowGuestPanel(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (searchCity) p.set('city', searchCity)
    if (checkin)    p.set('checkin', checkin)
    if (checkout)   p.set('checkout', checkout)
    p.set('rooms', rooms); p.set('adults', adults); p.set('children', children)
    navigate(`/hotels?${p.toString()}`)
  }

  const fmtDate  = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''
  const nights   = checkin && checkout ? Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000)) : 1
  const guestLbl = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`

  const allCities       = [...new Set(hotels.map(h => h.city).filter(Boolean))]
  const citySuggestions = searchCity ? allCities.filter(c => c.toLowerCase().includes(searchCity.toLowerCase())) : allCities

  return (
    <div className="lp">

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" style={{ backgroundImage: `url(${cmsContent.hero_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80'})` }} />
        <div className="lp-hero-overlay" />
        {cmsContent.hero_show_text !== false && (
          <div className="lp-hero-text">
            <p className="lp-hero-eyebrow">Trusted by 10 Million+ Travellers</p>
            <h1 className="lp-hero-title">{cmsContent.hero_title}</h1>
            <p className="lp-hero-sub">{cmsContent.hero_subtitle}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="lp-search-wrap">
          <form className="lp-search" onSubmit={handleSearch}>

            {/* Destination */}
            <div className="lp-sf lp-sf-dest" style={{ position: 'relative' }}>
              <MapPin size={18} className="lp-sf-icon" />
              <div className="lp-sf-body">
                <span className="lp-sf-label">Destination</span>
                <input
                  className="lp-sf-input"
                  placeholder="City, hotel or area"
                  value={searchCity}
                  onChange={e => { setSearchCity(e.target.value); setShowCitySuggestions(true) }}
                  onFocus={() => setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                  autoComplete="off"
                />
              </div>
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="lp-dropdown">
                  {citySuggestions.map(c => (
                    <div key={c} className="lp-dropdown-item" onMouseDown={() => { setSearchCity(c); setShowCitySuggestions(false) }}>
                      <MapPin size={13} style={{ marginRight: 6, flexShrink: 0, color: 'var(--tb-green)' }} />{c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="lp-sf lp-sf-dates" ref={datePanelRef} style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => { setShowDatePanel(p => !p); setShowGuestPanel(false) }}>
              <CalendarDays size={18} className="lp-sf-icon" />
              <div className="lp-sf-body">
                <span className="lp-sf-label">Check-in — Check-out</span>
                <span className="lp-sf-val">{checkin && checkout ? `${fmtDate(checkin)} – ${fmtDate(checkout)}` : 'Select dates'}</span>
              </div>
              <ChevronDown size={14} className="lp-sf-chevron" />
              {showDatePanel && (
                <div className="lp-dropdown lp-date-panel" onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[['Check-in', checkin, v => { setCheckin(v); if (v >= checkout) setCheckout(new Date(new Date(v).getTime()+86400000).toISOString().split('T')[0]) }, today, null],
                      ['Check-out', checkout, setCheckout, checkin || today, null]].map(([lbl, val, setter, min]) => (
                      <div key={lbl} style={{ flex: 1 }}>
                        <div className="lp-dp-label">{lbl}</div>
                        <input type="date" className="lp-dp-input" value={val} min={min} onChange={e => setter(e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div className="lp-dp-nights">{nights} night{nights > 1 ? 's' : ''}</div>
                  <button type="button" className="lp-dp-done" onClick={() => setShowDatePanel(false)}>Done</button>
                </div>
              )}
            </div>

            {/* Guests */}
            <div className="lp-sf lp-sf-guests" ref={guestPanelRef} style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => { setShowGuestPanel(p => !p); setShowDatePanel(false) }}>
              <UsersRound size={18} className="lp-sf-icon" />
              <div className="lp-sf-body">
                <span className="lp-sf-label">Rooms & Guests</span>
                <span className="lp-sf-val">{guestLbl}</span>
              </div>
              <ChevronDown size={14} className="lp-sf-chevron" />
              {showGuestPanel && (
                <div className="lp-dropdown lp-guest-panel" onClick={e => e.stopPropagation()}>
                  {[['Rooms', rooms, setRooms, 1, 10], ['Adults', adults, setAdults, 1, 10], ['Children', children, setChildren, 0, 6]].map(([lbl, val, setter, min, max]) => (
                    <div key={lbl} className="lp-gp-row">
                      <div>
                        <div className="lp-gp-name">{lbl}</div>
                        {lbl === 'Children' && <div className="lp-gp-sub">Ages 0–12</div>}
                      </div>
                      <div className="lp-gp-counter">
                        <button type="button" className="lp-gp-btn" onClick={() => setter(v => Math.max(min, v-1))} disabled={val <= min}>−</button>
                        <span>{val}</span>
                        <button type="button" className="lp-gp-btn" onClick={() => setter(v => Math.min(max, v+1))} disabled={val >= max}>+</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="lp-dp-done" onClick={() => setShowGuestPanel(false)}>Done</button>
                </div>
              )}
            </div>

            <button type="submit" className="lp-search-btn"><Search size={20} /><span>Search</span></button>
          </form>
        </div>
      </section>

      {/* ── CITY PILLS ── */}
      {allCities.length > 0 && (
        <div className="lp-cities-wrap">
          <div className="lp-cities">
            {allCities.slice(0, 8).map(c => (
              <button key={c} className="lp-city-pill" onClick={() => navigate(`/hotels?city=${encodeURIComponent(c)}`)}>
                <MapPin size={12} />{c}
              </button>
            ))}
            <button className="lp-city-pill lp-city-pill--all" onClick={() => navigate('/hotels')}>All Cities <ArrowRight size={12}/></button>
          </div>
        </div>
      )}

      {/* ── TRUST STRIP ── */}
      <div className="lp-trust-strip">
        <div className="container lp-trust-inner">
          {[
            [<Shield size={18}/>, 'Verified Hotels', 'Every property quality-checked'],
            [<ThumbsUp size={18}/>, 'Best Price Guarantee', 'Find lower? We match it'],
            [<Clock size={18}/>, 'Instant Confirmation', 'Booking confirmed in seconds'],
            [<Phone size={18}/>, '24/7 Support', 'Always here to help'],
          ].map(([icon, title, sub]) => (
            <div key={title} className="lp-trust-item">
              <span className="lp-trust-icon">{icon}</span>
              <div><div className="lp-trust-title">{title}</div><div className="lp-trust-sub">{sub}</div></div>
            </div>
          ))}
        </div>
      </div>



      {/* ── FEATURED HOTELS ── */}
      {hotels.length > 0 && (
        <section className="container lp-section">
          <div className="lp-section-head">
            <div>
              <h2 className="lp-section-title">Featured Hotels</h2>
              <p className="lp-section-sub">Handpicked quality stays</p>
            </div>
            <button className="lp-view-all" onClick={() => navigate('/hotels')}>View All <ArrowRight size={14}/></button>
          </div>
          <div className="lp-hotel-grid" style={{ position: 'relative' }}>
            {hotels.slice(0, 8).map(hotel => (
              <div key={hotel.id} className="lp-hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                <div className="lp-hotel-img-wrap">
                  <img className="lp-hotel-img"
                    src={hotel.cover_image || hotel.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                    alt={hotel.name} />
                  {hotel.star_rating && (
                    <div className="lp-hotel-stars">
                      {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                    </div>
                  )}
                </div>
                <div className="lp-hotel-body">
                  <div className="lp-hotel-name">{hotel.name}</div>
                  <div className="lp-hotel-loc"><MapPin size={11}/>{hotel.city}{hotel.state ? `, ${hotel.state}` : ''}</div>
                  <div className="lp-hotel-amenities">
                    {(hotel.amenities || []).slice(0, 3).map(a => (
                      <span key={a} className="lp-hotel-amenity">{AMENITY_ICONS[a] || null}{a}</span>
                    ))}
                  </div>
                  <div className="lp-hotel-footer">
                    <div className="lp-hotel-price">
                      {hotel.price_from ? <>{formatPrice(hotel.price_from)}<small>/night</small></> : <span style={{fontSize:13,color:'#94A3B8'}}>Price on request</span>}
                    </div>
                    <span className="lp-hotel-cta">Book Now</span>
                  </div>
                </div>
              </div>
            ))}
            {hotels.length > 8 && (
              <div className="lp-hotel-card lp-hotel-more" onClick={() => navigate('/hotels')}>
                <div className="lp-hotel-more-inner">
                  <span className="lp-hotel-more-count">+{hotels.length - 8}</span>
                  <span className="lp-hotel-more-label">More Hotels</span>
                  <ArrowRight size={18}/>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TOP DESTINATIONS ── */}
      <section className="lp-dest-section">
          <div className="container">
            <div className="lp-section-head">
              <div>
                <h2 className="lp-section-title">Top Destinations</h2>
                <p className="lp-section-sub">Explore hotels in popular cities</p>
              </div>
              <button className="lp-view-all" onClick={() => navigate('/hotels')}>View All <ArrowRight size={14}/></button>
            </div>
            <div className="lp-dest-grid-new">
              {destinations.slice(0, 5).map((d, i) => (
                <div
                  key={d.id}
                  className={`lp-dest-card-new${i === 0 ? ' lp-dest-card-new--featured' : ''}`}
                  onClick={() => navigate(`/hotels?city=${encodeURIComponent(d.name)}`)}
                >
                  <img src={d.image_url} alt={d.name} />
                  <div className="lp-dest-card-overlay">
                    <div className="lp-dest-card-name">{d.name}</div>
                    <div className="lp-dest-card-count"><MapPin size={11}/>{d.hotel_count}+ Hotels</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* ── OFFERS ZONE ── */}
      <section className="lp-oz-section">
          <div className="container">
            <div className="lp-section-head">
              <div>
                <h2 className="lp-section-title">Offers Zone</h2>
                <p className="lp-section-sub">Exclusive deals just for you</p>
              </div>
              <button className="lp-view-all" onClick={() => navigate('/offers')}>All Offers <ArrowRight size={14}/></button>
            </div>
            <div className="lp-oz-grid">
              {/* Featured big offer */}
              <div className="lp-oz-featured" onClick={() => navigate('/offers')}>
                <img src={offers[0]?.image_url} alt={offers[0]?.title} />
                <div className="lp-oz-overlay">
                  {offers[0]?.code && <span className="lp-oz-badge">{offers[0].code}</span>}
                  <div className="lp-oz-title">{offers[0]?.title}</div>
                  <div className="lp-oz-desc">{offers[0]?.description}</div>
                  <button className="lp-oz-cta">Grab Deal <ArrowRight size={14}/></button>
                </div>
              </div>
              {/* Side offers */}
              <div className="lp-oz-side">
                {offers.slice(1, 4).map(o => (
                  <div key={o.id} className="lp-oz-card" onClick={() => navigate('/offers')}>
                    <div className="lp-oz-card-img">
                      <img src={o.image_url} alt={o.title} />
                    </div>
                    <div className="lp-oz-card-body">
                      {o.code && <span className="lp-oz-card-badge">{o.code}</span>}
                      <div className="lp-oz-card-title">{o.title}</div>
                      <div className="lp-oz-card-desc">{o.description}</div>
                    </div>
                    <ArrowRight size={16} className="lp-oz-card-arrow" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* ── WHY BOOK WITH US ── */}
      <section className="container lp-section">
        <div className="lp-section-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <h2 className="lp-section-title">{cmsContent.feature_section_title}</h2>
          <p className="lp-section-sub">Simple, reliable, rewarding</p>
        </div>
        <div className="lp-features">
          {(cmsContent.features || []).map((f, i) => (
            <div key={i} className="lp-feature">
              {f.image
                ? <div className="lp-feature-icon"><img src={f.image} alt={f.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /></div>
                : <div className="lp-feature-icon">{DEFAULT_FEATURE_ICONS[i]}</div>
              }
              {f.show_text !== false && (
                <>
                  <div className="lp-feature-title">{f.title}</div>
                  <div className="lp-feature-desc">{f.desc}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="lp-stats-band">
        <div className="container lp-stats-inner">
          {[
            [cmsContent.stats_hotels, 'Hotels Listed'],
            [cmsContent.stats_customers, 'Happy Guests'],
            [cmsContent.stats_cities, 'Cities Covered'],
            ['4.5★', 'Average Rating'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="lp-stat">
              <div className="lp-stat-val">{val}</div>
              <div className="lp-stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>



    </div>
  )
}
