import { BedDouble, Maximize2, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react'

const hotelCards = [
  { name: 'Villa, Kemah Tinggi', price: '$ 990', bedrooms: '2 bedrooms', image: 'https://images.pexels.com/photos/16849866/pexels-photo-16849866.jpeg?auto=compress&cs=tinysrgb&w=600', partial: true },
  { name: 'Villa, Kemah Tinggi', price: '$ 990', bedrooms: '2 bedrooms', image: 'https://images.pexels.com/photos/6127358/pexels-photo-6127358.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Villa, Kuta Premiere', price: '$ 920', bedrooms: '5 bedrooms', image: 'https://images.pexels.com/photos/15780455/pexels-photo-15780455.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Villa, Kuta Premiere', price: '$ 920', bedrooms: '5 bedrooms', image: 'https://images.pexels.com/photos/33230041/pexels-photo-33230041.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Villa, Kemah Tinggi', price: '$ 990', bedrooms: '2 bedrooms', image: 'https://images.pexels.com/photos/37951904/pexels-photo-37951904.jpeg?auto=compress&cs=tinysrgb&w=600', partial: true },
]

const benefits = [
  { title: 'See it all', description: 'From local hotels to global brands, discover millions of rooms all around the world.' },
  { title: 'Compare right here', description: "No need to search anywhere else. The biggest names in travel are right here." },
  { title: 'Get exclusive rates', description: "We've special deals with the world's leading hotels and we share these savings with you." },
]

function Rating() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#ffffff4c] px-2 pb-[5px] pt-1 backdrop-blur-[20px]">
      <Star className="h-3.5 w-3.5 fill-white text-white" />
      <span className="font-sans text-sm font-medium leading-none text-white">4,93</span>
    </div>
  )
}

function SlideIndicators() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded bg-[#f9f9fb]" />
      {[1, 2, 3].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-[3px] bg-[#f9f9fbb2] backdrop-blur-[5.5px]" />)}
    </div>
  )
}

export default function NearbyHotelsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f0efef] pt-[42px]">
      {/* Top nav bar */}
      <div className="mx-auto -mt-[90px] block h-[49px] w-full max-w-[1057px] rounded-[36px] bg-[#f6f6f6]/95 shadow-[0px_12px_26px_#0000001a,0px_47px_47px_#00000017,0px_105px_63px_#0000000d]" />

      {/* Pagination dots */}
      <nav className="mx-auto -mt-[12px] flex w-fit items-center gap-[6.6px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <button key={i} className={`h-2.5 rounded-[13px] transition-opacity hover:opacity-75 ${i === 2 ? 'w-[38.51px] bg-[#1c1c1c]' : 'w-[19.25px] bg-[#cccccc]'}`} />
        ))}
      </nav>

      <div className="mx-auto max-w-[1920px] px-4 pb-[126px] pt-[132px] sm:px-8 lg:px-[5.5%]">
        <h2 className="bg-[linear-gradient(90deg,rgba(37,37,37,1)_0%,rgba(106,106,106,1)_100%)] bg-clip-text text-center font-display text-[40px] font-bold leading-[37.3px] tracking-[0.1px] text-transparent">
          Hotels in your area
        </h2>

        <div className="relative mt-[82px]">
          <button className="absolute left-0 top-[42%] z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white">
            <ChevronLeft className="h-5 w-5 text-[#1c1c1c]" />
          </button>

          <div className="mx-auto flex max-w-[1635px] items-start justify-center gap-11 overflow-visible">
            {hotelCards.map((hotel, index) => (
              <article key={index} className={`shrink-0 ${hotel.partial ? 'hidden w-[160px] pt-[14px] opacity-70 blur-[1px] xl:block' : 'w-[300px]'}`}>
                <div className="p-0">
                  <div className={`group relative overflow-hidden ${hotel.partial ? 'h-[264px] rounded-3xl' : 'h-[336px] rounded-3xl shadow-[0px_4px_4px_#00000040]'}`}>
                    <img className="h-full w-full object-cover" alt={hotel.name} src={hotel.image} />
                    <div className="absolute left-5 top-5"><Rating /></div>
                    <button className="absolute right-5 top-5 p-0 hover:bg-transparent">
                      <Heart className="h-6 w-6 text-white" />
                    </button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2"><SlideIndicators /></div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <h3 className="font-sans text-lg font-bold leading-6 text-[#252525]">{hotel.name}</h3>
                    <div className="text-right">
                      <p className="font-sans text-lg font-extrabold leading-6 text-[#c49c74]">{hotel.price}</p>
                      <p className="font-sans text-[10px] font-medium leading-3 text-[#a1a7b0]">per month</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-5 text-[#c9beb3]">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-[22px] w-[22px]" />
                      <span className="font-sans text-sm font-medium leading-5">{hotel.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-[18px] w-[18px]" />
                      <span className="font-sans text-sm font-medium leading-5">214m2</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button className="absolute right-0 top-[42%] z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white">
            <ChevronRight className="h-5 w-5 text-[#1c1c1c]" />
          </button>
        </div>
      </div>

      {/* Benefits band */}
      <section className="bg-[#1c1c1c] px-6 py-[144px] sm:px-12 lg:px-[10%]">
        <div className="mx-auto grid max-w-[1528px] gap-16 md:grid-cols-3 md:gap-20">
          {benefits.map((b) => (
            <article key={b.title} className="text-center">
              <h3 className="font-display text-3xl font-bold leading-6 text-[#f6f6f6]">{b.title}</h3>
              <p className="mt-10 font-display text-xl leading-6 text-[#cccccc]">{b.description}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
