import { useNavigate } from 'react-router-dom'
import { HOTELS, ROOMS, REVIEWS } from '../../lib/mockData'
import { formatPrice } from '../../lib/format'
import { WHITE_LABEL } from '../../lib/whiteLabel'
import { Star, MapPin, Search, CalendarDays, UsersRound, Gift, ArrowRight, Wifi, Car, Coffee, Dumbbell, Save as Waves, Check } from 'lucide-react'

const amenityIcons = { 'Free WiFi': Wifi, 'Parking': Car, 'Restaurant': Coffee, 'Gym': Dumbbell, 'Swimming Pool': Waves, 'AC': Check, 'Spa': Waves, 'Beach Access': Waves, 'Room Service': Coffee, 'Bar': Coffee }

export default function PublicLanding() {
  const navigate = useNavigate()
  const brand = WHITE_LABEL
  const approvedHotels = HOTELS.filter(h => h.status === 'approved')
  const cityNames = [...new Set(approvedHotels.map(h => h.city))]
  const topReviews = REVIEWS.filter(r => r.is_approved).slice(0, 3)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/hotels')
  }

  return (
    <div className="public-page">
      <section className="public-hero">
        <div className="public-hero-bg" style={{ backgroundImage: 'url(https://images.treebohotels.com/images/Masthead-Jul-Web-Masthead.jpg)' }} />
        <div className="public-hero-content">
          <form className="public-search-bar" onSubmit={handleSearch}>
            <div className="public-search-field">
              <span className="public-search-icon"><MapPin size={22} /></span>
              <div>
                <label>Location</label>
                <input placeholder="Where are you travelling?" />
              </div>
            </div>
            <div className="public-search-field">
              <span className="public-search-icon"><CalendarDays size={22} /></span>
              <div>
                <label>Check-in and Check-out</label>
                <div className="public-search-value">Select your dates</div>
              </div>
            </div>
            <div className="public-search-field">
              <span className="public-search-icon"><UsersRound size={22} /></span>
              <div>
                <label>Rooms & Guests</label>
                <div className="public-search-value">1 Room, 1 Adult</div>
              </div>
            </div>
            <button type="submit" className="public-search-submit" aria-label="Search hotels"><Search size={24} /></button>
          </form>
        </div>
      </section>

      <div className="public-city-pills public-container">
        {cityNames.map(city => (
          <button key={city} onClick={() => navigate(`/hotels?city=${encodeURIComponent(city)}`)}>{city}</button>
        ))}
        <button className="active" onClick={() => navigate('/hotels')}>All Hotels</button>
      </div>

      <section className="public-container public-member-banner">
        <div className="public-member-copy">
          <Gift size={32} />
          <div>
            <strong>Unlock Member Benefits!</strong>
            <span>5% off on all bookings</span>
          </div>
        </div>
        <div className="public-member-perks">Save More | Stay Rewards | +16 More Perks</div>
        <button onClick={() => navigate('/hotels')}>BOOK NOW</button>
      </section>

      <section className="public-container public-section">
        <div className="public-section-head">
          <div>
            <h2>Featured Hotels</h2>
            <p>Handpicked stays from {brand.brand_name}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/hotels')}>View All <ArrowRight size={14} /></button>
        </div>
        <div className="public-hotel-grid">
          {approvedHotels.map(hotel => (
            <div key={hotel.id} className="public-hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
              <img src={hotel.cover_image} alt={hotel.name} />
              <div className="public-hotel-body">
                <div className="public-hotel-stars">
                  {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <div className="public-hotel-name">{hotel.name}</div>
                <div className="public-hotel-location"><MapPin size={12} /> {hotel.city}, {hotel.state}</div>
                <div className="public-hotel-amenities">
                  {hotel.amenities.slice(0, 3).map(a => <span key={a}>{a}</span>)}
                </div>
                <div className="public-hotel-footer">
                  <div className="public-hotel-price">{formatPrice(hotel.price_from)} <small>/night</small></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="public-container public-section">
        <h2 className="public-section-title">Why Book With Us</h2>
        <p className="public-section-subtitle">We make hotel booking simple and rewarding</p>
        <div className="public-feature-grid">
          <div className="public-feature-card">
            <div className="public-feature-icon"><Star size={24} /></div>
            <div className="public-feature-title">Best Price Guarantee</div>
            <div className="public-feature-desc">Find a lower price and we'll match it</div>
          </div>
          <div className="public-feature-card">
            <div className="public-feature-icon"><MapPin size={24} /></div>
            <div className="public-feature-title">Top Locations</div>
            <div className="public-feature-desc">Hotels in the best destinations</div>
          </div>
          <div className="public-feature-card">
            <div className="public-feature-icon"><Waves size={24} /></div>
            <div className="public-feature-title">Premium Amenities</div>
            <div className="public-feature-desc">Curated stays with great facilities</div>
          </div>
          <div className="public-feature-card">
            <div className="public-feature-icon"><Coffee size={24} /></div>
            <div className="public-feature-title">24/7 Support</div>
            <div className="public-feature-desc">We're here whenever you need us</div>
          </div>
        </div>
      </section>

      {topReviews.length > 0 && (
        <section className="public-container public-section">
          <h2 className="public-section-title">Guest Reviews</h2>
          <p className="public-section-subtitle">What our guests say about us</p>
          <div className="public-review-grid">
            {topReviews.map(r => (
              <div key={r.id} className="public-review-card">
                <div className="public-review-stars">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <div className="public-review-title">{r.title}</div>
                <p className="public-review-text">{r.comment}</p>
                <div className="public-review-author">— {r.reviewer}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="public-container">
        <div className="public-stats-row">
          <div className="public-stat"><div className="public-stat-value">{approvedHotels.length}+</div><div className="public-stat-label">Hotels</div></div>
          <div className="public-stat"><div className="public-stat-value">{cityNames.length}+</div><div className="public-stat-label">Cities</div></div>
          <div className="public-stat"><div className="public-stat-value">{ROOMS.length}+</div><div className="public-stat-label">Room Types</div></div>
          <div className="public-stat"><div className="public-stat-value">{REVIEWS.length}+</div><div className="public-stat-label">Reviews</div></div>
        </div>
      </section>
    </div>
  )
}
