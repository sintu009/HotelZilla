import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { Star, MapPin, SlidersHorizontal, CalendarDays, UsersRound } from 'lucide-react'
import useSearchStore from '../lib/useSearchStore'
import hotelsApi from '../api/hotels'

const ALL_AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'AC', 'Beach Access', 'Room Service']

export default function HotelListing() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cityParam = searchParams.get('city') || ''
  const checkin = searchParams.get('checkin') || ''
  const checkout = searchParams.get('checkout') || ''
  const rooms = searchParams.get('rooms') || '1'
  const adults = searchParams.get('adults') || '1'
  const children = searchParams.get('children') || '0'
  const [cityInput, setCityInput] = useState(cityParam)
  const [city, setCity] = useState(cityParam)
  const [allHotels, setAllHotels] = useState([])
  const [loading, setLoading] = useState(true)

  // Debounce city input — only fires API call 400ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setCity(cityInput), 400)
    return () => clearTimeout(t)
  }, [cityInput])

  const { sortBy, priceRange, selectedAmenities, minStars, showFilters, setSortBy, setPriceRange, setMinStars, toggleShowFilters, toggleAmenity, clearFilters } = useSearchStore()

  useEffect(() => {
    setLoading(true)
    hotelsApi.search({ city: city || undefined, limit: 50 })
      .then(res => setAllHotels(res.data || []))
      .catch(() => setAllHotels([]))
      .finally(() => setLoading(false))
  }, [city])

  const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const nights = checkin && checkout ? Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000)) : null
  const guestLabel = `${rooms} Room${+rooms > 1 ? 's' : ''}, ${adults} Adult${+adults > 1 ? 's' : ''}${+children > 0 ? `, ${children} Child${+children > 1 ? 'ren' : ''}` : ''}`

  let filtered = allHotels
  if (selectedAmenities.length > 0) filtered = filtered.filter(h => selectedAmenities.every(a => (h.amenities || []).includes(a)))
  if (minStars > 0) filtered = filtered.filter(h => (h.star_rating || 0) >= minStars)
  filtered = filtered.filter(h => {
    const p = h.price_from || h.price_per_night || 0
    return p >= priceRange[0] && p <= priceRange[1]
  })
  if (sortBy === 'price_low') filtered = [...filtered].sort((a, b) => (a.price_from || 0) - (b.price_from || 0))
  if (sortBy === 'price_high') filtered = [...filtered].sort((a, b) => (b.price_from || 0) - (a.price_from || 0))
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => (b.avg_rating || b.star_rating || 0) - (a.avg_rating || a.star_rating || 0))

  const FilterContent = () => (
    <>
      <div className="filter-group">
        <h4>Price Range</h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</div>
        <input type="range" min="0" max="50000" step="500" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} style={{ width: '100%', accentColor: 'var(--primary)' }} />
      </div>
      <div className="filter-group">
        <h4>Star Rating</h4>
        {[5, 4, 3, 0].map(s => (
          <label key={s} className="filter-option">
            <input type="radio" name="stars" checked={minStars === s} onChange={() => setMinStars(s)} />
            {s === 0 ? 'All ratings' : `${s} stars & up`}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <h4>Amenities</h4>
        {ALL_AMENITIES.map(a => (
          <label key={a} className="filter-option">
            <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} />
            {a}
          </label>
        ))}
      </div>
    </>
  )

  return (
    <div className="container">
      <div style={{ paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <input className="input" placeholder="Search by city..." value={cityInput} onChange={e => setCityInput(e.target.value)} style={{ maxWidth: 280 }} />
        {checkin && checkout && (
          <span className="search-param-badge">
            <CalendarDays size={13} /> {formatDate(checkin)} – {formatDate(checkout)}{nights ? ` · ${nights} night${nights > 1 ? 's' : ''}` : ''}
          </span>
        )}
        <span className="search-param-badge"><UsersRound size={13} /> {guestLabel}</span>
      </div>
      <div className="listing-layout">
        <div className="filter-sidebar" style={{ display: showFilters ? 'block' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem' }}>Filters</h3>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
          </div>
          <FilterContent />
        </div>

        <div>
          <div className="listing-header">
            <div className="listing-results">{loading ? 'Loading...' : `${filtered.length} hotels found${city ? ` in ${city}` : ''}`}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={toggleShowFilters} style={{ display: showFilters ? 'none' : undefined }}>
                <SlidersHorizontal size={14} /> Filters
              </button>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><span className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No hotels found</h3>
              <p>Try adjusting your filters or search for a different city.</p>
            </div>
          ) : (
            <div className="hotel-grid">
              {filtered.map(hotel => (
                <div key={hotel.id} className="card hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                  <img className="hotel-card-img" loading="lazy" src={hotel.cover_image || hotel.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt={hotel.name} />
                  <div className="hotel-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      {[...Array(hotel.star_rating || 3)].map((_, i) => <Star key={i} size={12} className="star" fill="currentColor" />)}
                    </div>
                    <div className="hotel-card-name">{hotel.name}</div>
                    <div className="hotel-card-location"><MapPin size={12} style={{ display: 'inline', marginRight: 2 }} />{hotel.city}{hotel.state ? `, ${hotel.state}` : ''}</div>
                    <div className="hotel-card-amenities">
                      {(hotel.amenities || []).slice(0, 3).map(a => <span key={a} className="hotel-card-amenity">{a}</span>)}
                    </div>
                    <div className="hotel-card-footer">
                      <div className="hotel-card-price">{formatPrice(hotel.price_from || hotel.price_per_night || 0)} <small>/night</small></div>
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
