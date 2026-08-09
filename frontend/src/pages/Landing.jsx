import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { Star, MapPin, Coffee, Save as Waves, ArrowRight, Search, CalendarDays, UsersRound, Gift } from 'lucide-react'

const MOCK_HOTELS = [
  { id: '1', name: 'The Grand Palace', city: 'Mumbai', state: 'Maharashtra', star_rating: 5, price_from: 8500, amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant'], cover_image: 'https://images.treebohotels.com/images/Masthead-Jul-Web-Masthead.jpg' },
  { id: '2', name: 'Sea Breeze Resort', city: 'Goa', state: 'Goa', star_rating: 4, price_from: 5200, amenities: ['Free WiFi', 'Beach Access', 'Bar'], cover_image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg' },
  { id: '3', name: 'Mountain View Inn', city: 'Manali', state: 'Himachal Pradesh', star_rating: 3, price_from: 2800, amenities: ['Free WiFi', 'Parking', 'Restaurant'], cover_image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg' },
  { id: '4', name: 'Royal Heritage Hotel', city: 'Jaipur', state: 'Rajasthan', star_rating: 5, price_from: 9200, amenities: ['Free WiFi', 'Spa', 'Gym'], cover_image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg' },
  { id: '5', name: 'Backwaters Retreat', city: 'Kochi', state: 'Kerala', star_rating: 4, price_from: 4500, amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant'], cover_image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg' },
  { id: '6', name: 'City Centre Suites', city: 'Bangalore', state: 'Karnataka', star_rating: 4, price_from: 3800, amenities: ['Free WiFi', 'Gym', 'Parking'], cover_image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' },
]

const MOCK_DESTINATIONS = [
  { id: 1, name: 'Mumbai', hotel_count: 120, image_url: 'https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg' },
  { id: 2, name: 'Goa', hotel_count: 85, image_url: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg' },
  { id: 3, name: 'Jaipur', hotel_count: 64, image_url: 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg' },
  { id: 4, name: 'Delhi', hotel_count: 200, image_url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg' },
]

const MOCK_OFFERS = [
  { id: 1, title: '20% Off Weekend Stays', description: 'Book any hotel for the weekend and save 20%', code: 'WEEKEND20', image_url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg' },
  { id: 2, title: 'Early Bird Deal', description: 'Book 30 days in advance and get flat ₹1000 off', code: 'EARLY1000', image_url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [searchCity, setSearchCity] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/hotels${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`)
  }

  const cityNames = MOCK_DESTINATIONS.map(d => d.name)

  return (
    <div className="landing-page">
      {/* Campaign hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url(https://images.treebohotels.com/images/Masthead-Jul-Web-Masthead.jpg)' }} />
        <div className="hero-content">
          {/* <h1>Find Your Perfect Stay</h1>
          <p>Discover and book from thousands of hotels worldwide</p> */}
          <form className="search-bar" onSubmit={handleSearch} style={{ marginTop: 8 }}>
            <div className="search-field search-location">
              <span className="search-icon"><MapPin size={22} /></span>
              <div>
                <label className="label">Destination</label>
                <input placeholder="Search by city, hotel, or location" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
              </div>
            </div>
            <div className="search-field search-dates">
              <span className="search-icon"><CalendarDays size={22} /></span>
              <div>
                <label className="label">Check-in and Check-out</label>
                <div className="search-value">Select your dates</div>
              </div>
            </div>
            <div className="search-field search-guests">
              <span className="search-icon"><UsersRound size={22} /></span>
              <div>
                <label className="label">Rooms & Guests</label>
                <div className="search-value">1 Room, 1 Adult</div>
              </div>
            </div>
            <button type="submit" className="search-submit" aria-label="Search hotels"><Search size={24} /></button>
          </form>
        </div>
      </section>

      <div className="city-pills container">
        {cityNames.map(city => <button key={city} onClick={() => navigate(`/hotels?city=${encodeURIComponent(city)}`)}>{city}</button>)}
        <button className="city-pill-active" onClick={() => navigate('/hotels')}>All Cities</button>
      </div>

      <section className="container member-banner">
        <div className="member-banner-copy"><Gift size={32} /><div><strong>Unlock Member Benefits!</strong><span>5% off on all bookings</span></div></div>
        <div className="member-banner-perks">Save More&nbsp; | &nbsp;Stay Rewards&nbsp; | &nbsp;+16 More Perks</div>
        <button onClick={() => navigate('/login')}>SIGN IN</button>
      </section>

      {/* Featured Hotels */}
      <section className="container section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 className="section-title">Featured Hotels</h2>
            <p className="section-subtitle">Handpicked stays for you</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/hotels')}>View All <ArrowRight size={14} /></button>
        </div>
        <div className="hotel-grid">
          {MOCK_HOTELS.map(hotel => (
            <div key={hotel.id} className="card hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
              <img className="hotel-card-img" src={hotel.cover_image} alt={hotel.name} />
              <div className="hotel-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={12} className="star" fill="currentColor" />)}
                </div>
                <div className="hotel-card-name">{hotel.name}</div>
                <div className="hotel-card-location"><MapPin size={12} style={{ display: 'inline', marginRight: 2 }} />{hotel.city}, {hotel.state}</div>
                <div className="hotel-card-amenities">
                  {hotel.amenities.slice(0, 3).map(a => <span key={a} className="hotel-card-amenity">{a}</span>)}
                </div>
                <div className="hotel-card-footer">
                  <div className="hotel-card-price">{formatPrice(hotel.price_from)} <small>/night</small></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="container section">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-subtitle">Explore top cities and their best stays</p>
        <div className="dest-grid">
          {MOCK_DESTINATIONS.map(d => (
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

      {/* Offers */}
      <section className="container section">
        <h2 className="section-title">Exclusive Offers</h2>
        <p className="section-subtitle">Save big on your next stay</p>
        <div className="offer-grid">
          {MOCK_OFFERS.map(o => (
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

      {/* Why Book With Us */}
      <section className="container section">
        <h2 className="section-title">Why Book With Us</h2>
        <p className="section-subtitle">We make hotel booking simple and rewarding</p>
        <div className="feature-grid">
          <div className="feature-card"><div className="feature-icon"><Star size={24} /></div><div className="feature-title">Best Price Guarantee</div><div className="feature-desc">Find a lower price and we'll match it</div></div>
          <div className="feature-card"><div className="feature-icon"><MapPin size={24} /></div><div className="feature-title">Top Locations</div><div className="feature-desc">Hotels in the best destinations</div></div>
          <div className="feature-card"><div className="feature-icon"><Waves size={24} /></div><div className="feature-title">Premium Amenities</div><div className="feature-desc">Curated stays with great facilities</div></div>
          <div className="feature-card"><div className="feature-icon"><Coffee size={24} /></div><div className="feature-title">24/7 Support</div><div className="feature-desc">We're here whenever you need us</div></div>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <div className="stats-row">
          <div className="stat-item"><div className="stat-value">50,000+</div><div className="stat-label">Hotels</div></div>
          <div className="stat-item"><div className="stat-value">10M+</div><div className="stat-label">Happy Customers</div></div>
          <div className="stat-item"><div className="stat-value">1,500+</div><div className="stat-label">Cities</div></div>
        </div>
      </section>
    </div>
  )
}
