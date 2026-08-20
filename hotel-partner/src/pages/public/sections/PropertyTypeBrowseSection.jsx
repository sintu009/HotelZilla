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
    <section className="w-full overflow-hidden bg-[#f0efef] pt-[200px] pb-[30px]">
      <div className="mx-auto w-full max-w-[1518px] px-6">
        <header>
          <h2 className="bg-[linear-gradient(90deg,rgba(37,37,37,1)_0%,rgba(106,106,106,1)_100%)] bg-clip-text text-[42px] font-bold leading-[50.3px] tracking-[0.1px] text-transparent font-display sm:text-[54px]">
            Browse by property type
          </h2>
          <p className="mt-9 max-w-[1002px] text-xl font-medium leading-[37px] tracking-[0.6px] text-[#252525] font-display sm:text-3xl sm:leading-[47px] sm:tracking-[0.9px]">
            you can easily browse and filter your search by property type. This feature allows you to select hotels or alternative options, such as hostels, vacation rentals, or bed and breakfasts, based on your preferences and specific needs for your stay.
          </p>
        </header>
        <p className="mt-[52px] text-right text-[46px] font-bold leading-[88px] tracking-[1.38px] text-[#08080833] blur-[1.5px] [text-shadow:0px_4px_4px_#00000040] font-display sm:text-[75px] sm:tracking-[2.25px]">
          2018-2024
        </p>
      </div>

      <div className="mx-auto mt-[74px] flex w-full max-w-[1684px] items-center gap-7 px-6">
        <button onClick={() => setActiveSlide((s) => s === 0 ? paginationItems.length - 1 : s - 1)} className="h-auto shrink-0 rounded-full p-0 hover:bg-transparent">
          <ChevronLeft className="h-[34px] w-[34px] text-[#1c1c1c]" />
        </button>
        <div className="min-w-0 flex-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid min-w-[1560px] grid-cols-5 gap-[15px]">
            {propertyTypes.map((pt) => {
              const isSelected = selected === pt.name
              return (
                <article key={pt.name} className="w-[300px]">
                  <button onClick={() => setSelected(pt.name)} className="h-auto w-full justify-center rounded-none bg-transparent px-0 pb-[22px] pt-0 text-[28px] font-bold leading-[26.1px] tracking-[0.84px] hover:bg-transparent">
                    <span className={`bg-[linear-gradient(90deg,rgba(37,37,37,1)_0%,rgba(106,106,106,1)_100%)] bg-clip-text text-transparent font-display ${isSelected ? 'opacity-100' : 'opacity-60'}`}>{pt.name}</span>
                  </button>
                  <img className={`w-[300px] object-cover h-[631px] rounded-[15px]`} alt={pt.name} src={pt.image} />
                </article>
              )
            })}
          </div>
        </div>
        <button onClick={() => setActiveSlide((s) => s === paginationItems.length - 1 ? 0 : s + 1)} className="h-auto shrink-0 rounded-full p-0 hover:bg-transparent">
          <ChevronRight className="h-[34px] w-[34px] text-[#1c1c1c]" />
        </button>
      </div>

      <div className="mx-auto mt-[39px] flex h-2.5 w-[142px] items-center gap-[6.6px]">
        {paginationItems.map((item) => {
          const isActive = activeSlide === item
          return (
            <button key={item} onClick={() => setActiveSlide(item)} className={`h-2.5 rounded-[13px] p-0 ${isActive ? 'w-[38.51px] bg-[#1c1c1c]' : 'w-[19.25px] bg-[#cccccc]'}`} />
          )
        })}
      </div>
    </section>
  )
}
