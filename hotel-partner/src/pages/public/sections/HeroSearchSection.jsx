import { useState } from 'react'
import { Search, CalendarDays, UsersRound, Download, ChevronDown } from 'lucide-react'

const navItems = ['List your property', 'Support', 'Trips', 'Sign in']

export default function HeroSearchSection() {
  const [destination, setDestination] = useState('Stavanger, Norway')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  return (
    <section className="relative isolate min-h-[1111px] w-full overflow-hidden bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.pexels.com/photos/9119725/pexels-photo-9119725.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(58,58,58,0.65)_0%,rgba(0,0,0,0.65)_100%)]" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1728px] items-start justify-between px-6 pt-12 lg:px-0">
        <a href="#" className="flex h-12 items-start text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <span className="font-display text-[40px] font-normal leading-[48px] tracking-[0.1px]">Bookme.</span>
          <span className="mt-[19px] font-display text-xl font-normal leading-6 tracking-[0.1px]">com</span>
        </a>
        <nav className="hidden h-[108px] w-[1009px] -translate-y-[45px] items-center justify-center rounded-[36px] bg-[#f6f6f6]/95 pt-[51px] shadow-[0px_12px_26px_#0000001a,0px_47px_47px_#00000017,0px_105px_63px_#0000000d] lg:flex">
          <ul className="flex items-center gap-[85px]">
            {navItems.map((item) => (
              <li key={item}>
                <a className="font-display text-xl font-medium leading-6 tracking-[0.1px] text-[#1c1c1c] transition-opacity hover:opacity-70" href="#">{item}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="flex h-[57px] items-center gap-2.5 rounded-[36px] border-2 border-[#f6f6f6] bg-transparent px-[19px] font-display text-2xl font-medium tracking-[0.1px] text-[#f6f6f6] shadow-[0px_4px_4px_#00000040] hover:bg-white/10">
          Get the app
          <Download className="h-7 w-7" />
        </button>
      </header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-[1728px] px-6 lg:px-0">
        <h1 className="mt-[137px] max-w-[760px] bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(204,204,204,1)_77%)] bg-clip-text font-display text-6xl font-medium leading-[0.93] tracking-[0.1px] text-transparent [text-shadow:0px_4px_5px_#0000004c] sm:text-7xl lg:text-[112px]">
          Explore your place<br />to stay
        </h1>

        {/* Search form */}
        <form className="mt-[58px] flex w-full max-w-[1378px] flex-col gap-4 rounded-[30px] bg-[#1c1c1c9c] px-6 py-9 backdrop-blur-[2px] lg:flex-row lg:items-center lg:gap-[22px] lg:px-[55px]">
          <label className="flex h-[70px] min-w-0 flex-1 items-center rounded-xl bg-nero px-5 shadow-[inset_-2px_4px_4px_#00000040,inset_2px_0px_4px_#00000040] lg:max-w-[433px]">
            <Search className="mr-[18px] h-8 w-8 shrink-0 text-[#cccccc]" />
            <input className="h-auto w-full border-0 bg-transparent p-0 font-display text-xl tracking-[0.1px] text-[#cccccc] outline-none placeholder:text-[#cccccc]" value={destination} onChange={(e) => setDestination(e.target.value)} aria-label="Destination" />
          </label>
          <div className="flex h-[70px] min-w-0 flex-1 items-center rounded-xl bg-nero px-5 shadow-[inset_-2px_4px_4px_#00000040,inset_2px_0px_4px_#00000040] lg:max-w-[350px]">
            <CalendarDays className="mr-5 h-[30px] w-[33px] shrink-0 text-[#cccccc]" />
            <input type="date" className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-xl tracking-[0.1px] text-[#cccccc] outline-none placeholder:text-[#cccccc]" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} aria-label="Check in" />
            <span className="mx-4 h-[70px] w-px shrink-0 bg-white/20" />
            <input type="date" className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-xl tracking-[0.1px] text-[#cccccc] outline-none placeholder:text-[#cccccc]" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} aria-label="Checkout" />
          </div>
          <div className="flex h-[70px] min-w-0 flex-1 items-center rounded-xl bg-nero px-5 shadow-[inset_-2px_4px_4px_#00000040,inset_2px_0px_4px_#00000040] lg:max-w-[233px]">
            <UsersRound className="mr-5 h-[25px] w-[37px] shrink-0 text-[#cccccc]" />
            <div className="flex h-auto flex-1 items-center justify-between border-0 bg-transparent p-0 font-display text-xl tracking-[0.1px] text-[#cccccc]">
              <span>Guests</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
          <button type="submit" className="h-[70px] w-full rounded-xl bg-[#c49c74] font-display text-xl font-medium tracking-[0.1px] text-[#252525] shadow-[inset_-2px_4px_4px_#000000a8,inset_2px_0px_4px_#00000040] hover:bg-[#c49c74]/90 lg:w-[189px]">Checkout</button>
        </form>

        {/* Side text */}
        <aside className="ml-auto mt-[114px] flex max-w-[576px] gap-[26px]">
          <div className="mt-[9px] h-[125px] w-px shrink-0 bg-white/30" />
          <div>
            <p className="font-display text-3xl font-bold leading-[1.3] tracking-[0.1px] text-white [text-shadow:0px_4px_4px_#00000040] lg:text-4xl">
              We provide a variety of the best lodging accommodations for those of you who need it.
            </p>
            <p className="mt-[18px] font-display text-lg font-medium tracking-[0.1px] text-white [text-shadow:0px_4px_4px_#00000040]">
              Don't worry about the quality of the service.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
