import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const destinations = [
  { name: 'Dubai', image: 'https://images.pexels.com/photos/37031491/pexels-photo-37031491.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-1 row-start-1 h-[152px] w-full' },
  { name: 'Tbilisi', image: 'https://images.pexels.com/photos/28542403/pexels-photo-28542403.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-1 row-start-2 h-[152px] w-full' },
  { name: 'Istanbul', image: 'https://images.pexels.com/photos/36807236/pexels-photo-36807236.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-1 row-start-3 h-[171px] w-full' },
  { name: 'Paris', image: 'https://images.pexels.com/photos/32719062/pexels-photo-32719062.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-2 row-span-2 row-start-1 h-[319px] w-full' },
  { name: 'Taiwan', image: 'https://images.pexels.com/photos/30487318/pexels-photo-30487318.jpeg?auto=compress&cs=tinysrgb&w=400', className: 'col-start-2 row-start-3 h-[171px] w-full' },
]

export default function NewsletterAndTrendingSection() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const handleDestinationClick = (name) => {
    navigate(`/hotels?city=${name}`)
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#252525] px-6 pb-20 pt-32 sm:px-12 lg:px-[8%]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-[1fr_1px_1fr] lg:gap-12">
        {/* Newsletter */}
        <section className="lg:pr-8">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-[0.10px] text-[#f6f6f6] lg:text-[40px]">Stay in the know</h2>
          <p className="mt-6 font-display text-xl font-normal leading-relaxed tracking-[0.10px] text-[#cccccc] lg:text-2xl">
            Sign up to get marketing emails from Bookme.com, including promotions, rewards, travel experiences, and information about Bookme.com and Booking.com Transport Limited's products and services.
          </p>
          <form onSubmit={handleSubscribe} className="mt-10 flex max-w-full flex-col gap-3 sm:flex-row sm:items-center">
            <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-[64px] flex-1 rounded-xl border-0 bg-[#f6f6f6] px-5 font-display text-base text-[#252525] outline-none placeholder:text-[#777]" />
            <button type="submit" className="h-[64px] w-full rounded-xl bg-[#c49c74] px-8 font-display text-lg font-medium tracking-[0.10px] text-[#252525] shadow-[inset_2px_0px_4px_#00000040] hover:bg-[#d0aa84] sm:w-[180px]">
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          {subscribed && (
            <p className="mt-3 font-display text-base text-[#c49c74]">Thanks for subscribing!</p>
          )}
          <p className="mt-3 font-display text-base font-normal tracking-[0.10px]">
            <span className="text-[#c9beb3]">You can opt out anytime. See our </span>
            <a className="text-[#c49c74] underline" href="#">privacy statement.</a>
          </p>
        </section>

        {/* Divider */}
        <div className="hidden w-px self-stretch bg-[#202226] lg:block" />

        {/* Trending destinations */}
        <section className="lg:pl-8">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-[0.10px] text-[#f6f6f6] lg:text-[40px]">Trending destinations</h2>
          <p className="mt-6 font-display text-lg font-medium tracking-[0.10px] text-[#cccccc]">Most popular choices for travelers from Iran</p>
          <div className="mt-12 grid grid-cols-2 grid-rows-[152px_152px_171px] gap-x-5 gap-y-4">
            {destinations.map((d) => (
              <button key={d.name} onClick={() => handleDestinationClick(d.name)} className={`group relative block overflow-hidden rounded-2xl p-0 text-left hover:bg-transparent ${d.className}`}>
                <img className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" alt={d.name} src={d.image} />
                <span className="absolute inset-0 flex items-center justify-center bg-[#252525]/25 font-display text-2xl font-bold tracking-[0.10px] text-[#f6f6f6] lg:text-3xl">{d.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
