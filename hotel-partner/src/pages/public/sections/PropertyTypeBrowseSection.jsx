import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const propertyTypes = [
  { name: 'Hotels', image: 'https://images.pexels.com/photos/39035671/pexels-photo-39035671.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Apartments', image: 'https://images.pexels.com/photos/34487094/pexels-photo-34487094.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Resorts', image: 'https://images.pexels.com/photos/19756781/pexels-photo-19756781.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Villas', image: 'https://images.pexels.com/photos/32775822/pexels-photo-32775822.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Cottages', image: 'https://images.pexels.com/photos/15394148/pexels-photo-15394148.jpeg?auto=compress&cs=tinysrgb&w=600' },
]

const paginationItems = [0, 1, 2, 3, 4]

export default function PropertyTypeBrowseSection() {
  const [activeSlide, setActiveSlide] = useState(2)
  const [selected, setSelected] = useState('Resorts')

  return (
    <section className="w-full overflow-hidden bg-[#f0efef] pt-32 pb-16">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <header>
          <h2 className="bg-[linear-gradient(90deg,rgba(37,37,37,1)_0%,rgba(106,106,106,1)_100%)] bg-clip-text font-display text-3xl font-bold leading-tight tracking-[0.1px] text-transparent lg:text-[48px]">
            Browse by property type
          </h2>
          <p className="mt-8 max-w-[900px] font-display text-lg font-medium leading-relaxed tracking-[0.1px] text-[#252525] lg:text-2xl">
            you can easily browse and filter your search by property type. This feature allows you to select hotels or alternative options, such as hostels, vacation rentals, or bed and breakfasts, based on your preferences and specific needs for your stay.
          </p>
        </header>
        <p className="mt-8 text-right font-display text-4xl font-bold leading-tight text-[#08080833] blur-[1.5px] [text-shadow:0px_4px_4px_#00000040] lg:text-6xl">
          2018-2024
        </p>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1600px] items-center gap-6 px-6 lg:px-12">
        <button onClick={() => setActiveSlide((s) => s === 0 ? paginationItems.length - 1 : s - 1)} className="h-auto shrink-0 rounded-full p-0 hover:bg-transparent">
          <ChevronLeft className="h-8 w-8 text-[#1c1c1c]" />
        </button>
        <div className="min-w-0 flex-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid min-w-[1400px] grid-cols-5 gap-4">
            {propertyTypes.map((pt) => {
              const isSelected = selected === pt.name
              return (
                <article key={pt.name} className="w-full">
                  <button onClick={() => setSelected(pt.name)} className="h-auto w-full justify-center rounded-none bg-transparent px-0 pb-5 pt-0 font-display text-xl font-bold leading-tight tracking-[0.1px] hover:bg-transparent lg:text-2xl">
                    <span className={`bg-[linear-gradient(90deg,rgba(37,37,37,1)_0%,rgba(106,106,106,1)_100%)] bg-clip-text text-transparent ${isSelected ? 'opacity-100' : 'opacity-60'}`}>{pt.name}</span>
                  </button>
                  <img className="h-[500px] w-full rounded-2xl object-cover lg:h-[580px]" alt={pt.name} src={pt.image} />
                </article>
              )
            })}
          </div>
        </div>
        <button onClick={() => setActiveSlide((s) => s === paginationItems.length - 1 ? 0 : s + 1)} className="h-auto shrink-0 rounded-full p-0 hover:bg-transparent">
          <ChevronRight className="h-8 w-8 text-[#1c1c1c]" />
        </button>
      </div>

      <div className="mx-auto mt-10 flex h-2.5 w-fit items-center gap-1.5">
        {paginationItems.map((item) => {
          const isActive = activeSlide === item
          return (
            <button key={item} onClick={() => setActiveSlide(item)} className={`h-2.5 rounded-full p-0 transition-all ${isActive ? 'w-10 bg-[#1c1c1c]' : 'w-5 bg-[#cccccc]'}`} />
          )
        })}
      </div>
    </section>
  )
}
