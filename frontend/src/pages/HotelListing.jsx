import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import { Star, MapPin, SlidersHorizontal } from 'lucide-react'

const ALL_AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'AC', 'Beach Access', 'Room Service']

export default function HotelListing() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cityParam = searchParams.get('city') || ''
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState(cityParam)
  const [sortBy, setSortBy] = useState('recommended')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [minStars, setMinStars] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setCity(cityParam)
  }, [cityParam])

  useEffect(() => {
    let query = supabase.from('hotels').select('*').eq('status', 'approved')
    if (city) query = query.ilike('city', `%${city}%`)
    query = query.order('created_at', { ascending: false })
    query.then(({ data, error }) => {
      if (error) { console.error(error); setLoading(false); return }
      setHotels(data || [])
      setLoading(false)
    })
  }, [city])

  let filtered = [...hotels]
  if (selectedAmenities.length > 0) {
    filtered = filtered.filter(h => selectedAmenities.every(a => (h.amenities || []).includes(a)))
  }
  if (minStars > 0) {
    filtered = filtered.filter(h => h.star_rating >= minStars)
  }
  filtered = filtered.filter(h => h.price_from >= priceRange[0] && h.price_from <= priceRange[1])

  if (sortBy === 'price_low') filtered.sort((a, b) => a.price_from - b.price_from)
  if (sortBy === 'price_high') filtered.sort((a, b) => b.price_from - a.price_from)
  if (sortBy === 'rating') filtered.sort((a, b) => b.star_rating - a.star_rating)

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  const FilterContent = () => (
    <>
      <div className="filter-group">
        <h4>Price Range</h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </div>
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
      <div style={{ paddingTop: 24 }}>
        <input className="input" placeholder="Search by city..." value={city} onChange={e => setCity(e.target.value)} style={{ maxWidth: 400 }} />
      </div>
      <div className="listing-layout">
        <div className="filter-sidebar" style={{ display: showFilters ? 'block' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem' }}>Filters</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedAmenities([]); setMinStars(0); setPriceRange([0, 50000]) }}>Clear</button>
          </div>
          <FilterContent />
        </div>

        <div>
          <div className="listing-header">
            <div>
              <div className="listing-results">{filtered.length} hotels found{city ? ` in ${city}` : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)} style={{ display: showFilters ? 'none' : undefined }}>
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
            <div className="hotel-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No hotels found</h3>
              <p>Try adjusting your filters or search for a different city.</p>
            </div>
          ) : (
            <div className="hotel-grid">
              {filtered.map(hotel => (
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
        </div>
      </div>
    </div>
  )
}
