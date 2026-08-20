import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { HOTELS } from '../../lib/mockData'
import { formatPrice } from '../../lib/format'
import { Star, MapPin, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const ALL_AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'AC', 'Beach Access', 'Room Service']

export default function PublicHotelListing() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cityParam = searchParams.get('city') || ''
  const typeParam = searchParams.get('type') || ''
  const [city, setCity] = useState(cityParam)
  const [sortBy, setSortBy] = useState('recommended')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [minStars, setMinStars] = useState(0)
  const [showFilters, setShowFilters] = useState(true)

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
    <div className="min-h-screen bg-[#f0efef]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#1c1c1c] px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-end gap-0.5 text-[#f6f6f6]">
            <span className="font-display text-2xl font-normal tracking-[0.1px] lg:text-3xl">Bookme.</span>
            <span className="font-display text-base font-normal tracking-[0.1px] lg:text-lg">com</span>
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            <button onClick={() => navigate('/')} className="font-display text-base text-white/80 hover:text-white">Home</button>
            <button onClick={() => navigate('/hotels')} className="font-display text-base text-white hover:text-white/80">Hotels</button>
            <button onClick={() => navigate('/dashboard')} className="font-display text-base text-white/80 hover:text-white">Partner</button>
          </nav>
          <button onClick={() => navigate('/dashboard')} className="rounded-full bg-[#c49c74] px-6 py-2 font-display text-base font-medium text-[#252525] hover:bg-[#d0aa84]">Sign in</button>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-12">
        {/* Search bar */}
        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a1a7b0]" />
            <input className="h-12 w-full rounded-xl border-0 bg-white pl-12 pr-4 font-display text-base text-[#252525] outline-none placeholder:text-[#a1a7b0]" placeholder="Search by city..." value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex h-12 items-center gap-2 rounded-xl bg-white px-4 font-display text-base font-medium text-[#252525] hover:bg-white/90">
            <SlidersHorizontal className="h-5 w-5" /> Filters
          </button>
        </div>

        {typeParam && (
          <div className="mb-6 rounded-xl bg-[#c49c74]/10 px-4 py-3 font-display text-base text-[#c49c74]">
            Filtering by: {typeParam} <button onClick={() => navigate('/hotels')} className="ml-2 underline">Clear</button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filter sidebar */}
          {showFilters && (
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#252525]">Filters</h3>
                  <button onClick={() => { setSelectedAmenities([]); setMinStars(0); setPriceRange([0, 50000]) }} className="font-display text-sm text-[#c49c74] hover:underline">Clear</button>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 font-display text-sm font-bold text-[#252525]">Price Range</h4>
                  <div className="mb-2 font-display text-sm text-[#a1a7b0]">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</div>
                  <input type="range" min="0" max="50000" step="500" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} className="w-full accent-[#c49c74]" />
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 font-display text-sm font-bold text-[#252525]">Star Rating</h4>
                  {[5, 4, 3, 0].map(s => (
                    <label key={s} className="flex cursor-pointer items-center gap-2 py-1.5 font-display text-sm text-[#252525]">
                      <input type="radio" name="stars" checked={minStars === s} onChange={() => setMinStars(s)} className="accent-[#c49c74]" />
                      {s === 0 ? 'All ratings' : `${s} stars & up`}
                    </label>
                  ))}
                </div>

                <div>
                  <h4 className="mb-2 font-display text-sm font-bold text-[#252525]">Amenities</h4>
                  {ALL_AMENITIES.map(a => (
                    <label key={a} className="flex cursor-pointer items-center gap-2 py-1.5 font-display text-sm text-[#252525]">
                      <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-[#c49c74]" />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Hotel grid */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-base text-[#252525]">{filtered.length} hotels found{city ? ` in ${city}` : ''}</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-10 rounded-xl border-0 bg-white px-4 font-display text-sm text-[#252525] outline-none">
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center">
                <h3 className="font-display text-xl font-bold text-[#252525]">No hotels found</h3>
                <p className="mt-2 font-display text-base text-[#a1a7b0]">Try adjusting your filters or search for a different city.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map(hotel => (
                  <div key={hotel.id} onClick={() => navigate(`/hotels/${hotel.id}`)} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:scale-[1.02]">
                    <div className="relative h-48 overflow-hidden">
                      <img src={hotel.cover_image} alt={hotel.name} className="h-full w-full object-cover" />
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-md">
                        <span className="font-display text-sm font-bold text-[#252525]">{hotel.rating} ★</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-1 flex items-center gap-1">
                        {[...Array(hotel.star_rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#c49c74] text-[#c49c74]" />)}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#252525]">{hotel.name}</h3>
                      <div className="mt-1 flex items-center gap-1 font-display text-sm text-[#a1a7b0]">
                        <MapPin className="h-3.5 w-3.5" /> {hotel.city}, {hotel.state}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 3).map(a => (
                          <span key={a} className="rounded-full bg-[#f0efef] px-3 py-1 font-display text-xs text-[#252525]">{a}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <span className="font-display text-xl font-extrabold text-[#c49c74]">{formatPrice(hotel.price_from)}</span>
                          <span className="font-display text-sm text-[#a1a7b0]"> /night</span>
                        </div>
                        <button className="rounded-lg bg-[#c49c74] px-4 py-2 font-display text-sm font-medium text-[#252525] hover:bg-[#d0aa84]">View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
