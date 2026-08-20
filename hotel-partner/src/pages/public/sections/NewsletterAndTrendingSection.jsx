import { useState } from 'react'

const destinations = [
  { name: 'Dubai', image: 'https://images.pexels.com/photos/37031491/pexels-photo-37031491.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-1 row-start-1 h-[152px] w-[242px]' },
  { name: 'Tbilisi', image: 'https://images.pexels.com/photos/28542403/pexels-photo-28542403.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-1 row-start-2 h-[152px] w-[242px]' },
  { name: 'Istanbul', image: 'https://images.pexels.com/photos/36807236/pexels-photo-36807236.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-1 row-start-3 h-[171px] w-[222px]' },
  { name: 'Paris', image: 'https://images.pexels.com/photos/32719062/pexels-photo-32719062.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-2 row-span-2 row-start-1 h-[318px] w-[200px]' },
  { name: 'Taiwan', image: 'https://images.pexels.com/photos/30487318/pexels-photo-30487318.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-2 row-start-3 h-[171px] w-[231px]' },
]

export default function NewsletterAndTrendingSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative w-full min-h-[958px] overflow-hidden bg-[#252525] px-6 pb-20 pt-[198px] sm:px-12 lg:px-[10.5%]">
      <div className="mx-auto grid max-w-[1530px] grid-cols-1 gap-16 lg:grid-cols-[667px_1px_462px] lg:justify-between lg:gap-0">
        {/* Newsletter */}
        <section className="pt-[75px] lg:pr-8">
          <h2 className="font-display text-[40px] font-bold leading-none tracking-[0.10px] text-[#f6f6f6]">Stay in the know</h2>
          <p className="mt-6 max-w-[667px] font-display text-3xl font-normal tracking-[0.10px] text-[#cccccc]">
            Sign up to get marketing emails from Bookme.com, including promotions, rewards, travel experiences, and information about Bookme.com and Booking.com Transport Limited's products and services.
          </p>
          <form className="mt-10 flex max-w-[719px] flex-col gap-3 sm:flex-row sm:items-center" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-[70px] flex-1 rounded-xl border-0 bg-[#f6f6f6] px-5 font-display text-base text-[#252525] outline-none placeholder:text-[#777]" />
            <button type="submit" className="h-[70px] w-full rounded-xl bg-[#c49c74] px-8 font-display text-xl font-medium leading-[18.6px] tracking-[0.10px] text-[#252525] shadow-[inset_2px_0px_4px_#00000040] hover:bg-[#d0aa84] sm:w-[191px]">Subscribe</button>
          </form>
          <p className="mt-2 max-w-[667px] font-display text-lg font-normal tracking-[0.10px]">
            <span className="tracking-[0.02px] text-[#c9beb3]">You can opt out anytime. See our </span>
            <a className="tracking-[0.02px] text-[#c49c74] underline" href="#">privacy statement.</a>
          </p>
        </section>

        {/* Divider */}
        <div className="hidden min-h-[643px] w-px bg-[#202226] shadow-[inset_-2px_-2px_2px_#4e5153,inset_0px_4px_4px_#000000bf] lg:block" />

        {/* Trending destinations */}
        <section>
          <h2 className="font-display text-[40px] font-bold leading-none tracking-[0.10px] text-[#f6f6f6]">Trending destinations</h2>
          <p className="mt-7 font-display text-lg font-medium tracking-[0.10px] text-[#cccccc]">Most popular choices for travelers from Iran</p>
          <div className="mt-[73px] grid grid-cols-[242px_231px] grid-rows-[152px_152px_171px] gap-x-5 gap-y-[15px]">
            {destinations.map((d) => (
              <button key={d.name} className={`group relative block overflow-hidden rounded-[18px] p-0 text-left hover:bg-transparent ${d.className}`}>
                <img className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" alt={d.name} src={d.image} />
                <span className="absolute inset-0 flex items-center justify-center bg-[#252525]/25 font-display text-[35px] font-bold tracking-[0.10px] text-[#f6f6f6]">{d.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
