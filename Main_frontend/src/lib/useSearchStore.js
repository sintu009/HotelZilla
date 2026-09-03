import { create } from 'zustand'

const useSearchStore = create((set) => ({
  sortBy: 'recommended',
  priceRange: [0, 50000],
  selectedAmenities: [],
  minStars: 0,
  showFilters: false,

  setSortBy: (sortBy) => set({ sortBy }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setMinStars: (minStars) => set({ minStars }),
  toggleShowFilters: () => set((s) => ({ showFilters: !s.showFilters })),
  toggleAmenity: (amenity) =>
    set((s) => ({
      selectedAmenities: s.selectedAmenities.includes(amenity)
        ? s.selectedAmenities.filter((a) => a !== amenity)
        : [...s.selectedAmenities, amenity],
    })),
  clearFilters: () => set({ selectedAmenities: [], minStars: 0, priceRange: [0, 50000] }),
}))

export default useSearchStore
