import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { HOTELS } from '../../lib/mockData'
import { formatPrice } from '../../lib/format'
import { Star, MapPin, SlidersHorizontal } from 'lucide-react'

const ALL_AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'AC', 'Beach Access', 'Room Service']

export default function PublicHotelListing() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cityParam = searchParams.get('city') || ''
  const [city, setCity] = useState(cityParam)
  const [sortBy, setSortBy] = useState('recommended')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [minStars, setMinStars] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const hotels = HOTELS.filter(h => h.status === 'approved')

  let filtered = hotels.filter(h => !city || h.city.toLowerCase().includes(city.toLowerCase()))
  if (selectedAmenities.length > 0) filtered = filtered.filter(h => selectedAmenities.every(a => h.amenities.includes(a)))
  if (minStars > 0) filtered = filtered.filter(h => h.star_rating >= minStars)
  filtered = filtered.filter(h => h.price_from >= priceRange[0] && h.price_from <= priceRange[1])
  if (sortBy === 'price_low') filtered.sort((a, b) => a.price_from - b.price_from)
  if (sortBy === 'price_high') filtered.sort((a, b) => b.price_from - a.price_from)
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating)

  const toggleAmenity = (a) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  return (
    <div className="public-container public-listing">
      <div className="public-listing-search">
        <input className="input" placeholder="Search by city..." value={city} onChange={e => setCity(e.target.value)} style={{ maxWidth: 400 }} />
      </div>
      <div className="public-listing-layout">
        <div className="public-filter-sidebar" style={{ display: showFilters ? 'block' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem' }}>Filters</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedAmenities([]); setMinStars(0); setPriceRange([0, 50000]) }}>Clear</button>
          </div>
          <div className="public-filter-group">
            <h4>Price Range</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</div>
            <input type="range" min="0" max="50000" step="500" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
          <div className="public-filter-group">
            <h4>Star Rating</h4>
            {[5, 4, 3, 0].map(s => (
              <label key={s} className="public-filter-option">
                <input type="radio" name="stars" checked={minStars === s} onChange={() => setMinStars(s)} />
                {s === 0 ? 'All ratings' : `${s} stars & up`}
              </label>
            ))}
          </div>
          <div className="public-filter-group">
            <h4>Amenities</h4>
            {ALL_AMENITIES.map(a => (
              <label key={a} className="public-filter-option">
                <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="public-listing-header">
            <div className="public-listing-results">{filtered.length} hotels found{city ? ` in ${city}` : ''}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)} style={{ display: showFilters ? 'none' : undefined }}>
                <SlidersHorizontal size={14} /> Filters
              </button>
              <select className="input" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No hotels found</h3>
              <p>Try adjusting your filters or search for a different city.</p>
            </div>
          ) : (
            <div className="public-hotel-grid">
              {filtered.map(hotel => (
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
          )}
        </div>
      </div>
    </div>
  )
}
