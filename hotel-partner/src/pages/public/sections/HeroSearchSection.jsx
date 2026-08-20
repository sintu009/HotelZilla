import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CalendarDays, UsersRound, Download, ChevronDown, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'List your property', path: '/dashboard' },
  { label: 'Support', path: '/hotels' },
  { label: 'Trips', path: '/hotels' },
  { label: 'Sign in', path: '/dashboard' },
]

export default function HeroSearchSection() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('Stavanger, Norway')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2 Guests')
  const [showGuests, setShowGuests] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set('city', destination)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    navigate(`/hotels?${params.toString()}`)
  }

  const guestOptions = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5+ Guests']

  return (
    <section className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.pexels.com/photos/9119725/pexels-photo-9119725.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(58,58,58,0.65)_0%,rgba(0,0,0,0.65)_100%)]" />

      {/* Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-8 lg:px-12 lg:py-10">
        <a href="/" className="flex items-end gap-0.5 text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <span className="font-display text-3xl font-normal leading-none tracking-[0.1px] lg:text-[40px] lg:leading-[48px]">Bookme.</span>
          <span className="font-display text-lg font-normal leading-none tracking-[0.1px] lg:text-xl lg:leading-6">com</span>
        </a>
        <nav className="hidden items-center rounded-full bg-[#f6f6f6]/95 px-10 py-4 shadow-[0px_12px_26px_#0000001a,0px_47px_47px_#00000017,0px_105px_63px_#0000000d] lg:flex">
          <ul className="flex items-center gap-12">
            {navItems.map((item) => (
              <li key={item.label}>
                <button onClick={() => navigate(item.path)} className="font-display text-lg font-medium leading-6 tracking-[0.1px] text-[#1c1c1c] transition-opacity hover:opacity-70">{item.label}</button>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={() => navigate('/hotels')} className="hidden h-[52px] items-center gap-2.5 rounded-full border-2 border-[#f6f6f6] bg-transparent px-6 font-display text-lg font-medium tracking-[0.1px] text-[#f6f6f6] shadow-[0px_4px_4px_#00000040] hover:bg-white/10 lg:flex lg:text-xl">
          Get the app
          <Download className="h-7 w-7" />
        </button>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f6f6f6] text-[#f6f6f6] lg:hidden">
          {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="relative z-20 mx-4 mb-4 rounded-2xl bg-[#f6f6f6]/95 p-6 lg:hidden">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <button onClick={() => { navigate(item.path); setMobileMenu(false) }} className="font-display text-lg font-medium text-[#1c1c1c]">{item.label}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] flex-1 px-6 lg:px-12">
        <h1 className="mt-8 max-w-[760px] bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(204,204,204,1)_77%)] bg-clip-text font-display text-5xl font-medium leading-[0.95] tracking-[0.1px] text-transparent [text-shadow:0px_4px_5px_#0000004c] sm:text-6xl lg:mt-16 lg:text-[96px]">
          Explore your place<br />to stay
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mt-10 flex w-full max-w-[1378px] flex-col gap-4 rounded-[30px] bg-[#1c1c1c9c] px-6 py-8 backdrop-blur-[2px] lg:flex-row lg:items-center lg:gap-5 lg:px-12 lg:py-10">
          <label className="flex h-[64px] min-w-0 flex-1 items-center rounded-xl bg-nero px-5 shadow-[inset_-2px_4px_4px_#00000040,inset_2px_0px_4px_#00000040] lg:max-w-[433px]">
            <Search className="mr-4 h-7 w-7 shrink-0 text-[#cccccc]" />
            <input className="h-auto w-full border-0 bg-transparent p-0 font-display text-lg tracking-[0.1px] text-[#cccccc] outline-none placeholder:text-[#cccccc] lg:text-xl" value={destination} onChange={(e) => setDestination(e.target.value)} aria-label="Destination" />
          </label>
          <div className="flex h-[64px] min-w-0 flex-1 items-center rounded-xl bg-nero px-5 shadow-[inset_-2px_4px_4px_#00000040,inset_2px_0px_4px_#00000040] lg:max-w-[350px]">
            <CalendarDays className="mr-4 h-7 w-7 shrink-0 text-[#cccccc]" />
            <input type="date" className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-lg tracking-[0.1px] text-[#cccccc] outline-none placeholder:text-[#cccccc] lg:text-xl" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} aria-label="Check in" />
            <span className="mx-3 h-16 w-px shrink-0 bg-white/20" />
            <input type="date" className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-lg tracking-[0.1px] text-[#cccccc] outline-none placeholder:text-[#cccccc] lg:text-xl" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} aria-label="Checkout" />
          </div>
          <div className="relative flex h-[64px] min-w-0 flex-1 items-center rounded-xl bg-nero px-5 shadow-[inset_-2px_4px_4px_#00000040,inset_2px_0px_4px_#00000040] lg:max-w-[233px]">
            <UsersRound className="mr-4 h-6 w-8 shrink-0 text-[#cccccc]" />
            <button type="button" onClick={() => setShowGuests(!showGuests)} className="flex h-auto flex-1 items-center justify-between border-0 bg-transparent p-0 font-display text-lg tracking-[0.1px] text-[#cccccc] lg:text-xl">
              <span>{guests}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
            </button>
            {showGuests && (
              <div className="absolute bottom-full left-0 right-0 z-30 mb-2 overflow-hidden rounded-xl bg-[#252525] shadow-lg">
                {guestOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => { setGuests(opt); setShowGuests(false) }} className={`block w-full px-5 py-3 text-left font-display text-base text-[#cccccc] hover:bg-white/10 ${guests === opt ? 'bg-white/5' : ''}`}>{opt}</button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="h-[64px] w-full rounded-xl bg-[#c49c74] font-display text-lg font-medium tracking-[0.1px] text-[#252525] shadow-[inset_-2px_4px_4px_#000000a8,inset_2px_0px_4px_#00000040] hover:bg-[#d0aa84] lg:w-[180px] lg:text-xl">Checkout</button>
        </form>

        {/* Side text */}
        <aside className="ml-auto mt-12 flex max-w-[576px] gap-6 lg:mt-20">
          <div className="mt-2 h-32 w-px shrink-0 bg-white/30" />
          <div>
            <p className="font-display text-2xl font-bold leading-[1.3] tracking-[0.1px] text-white [text-shadow:0px_4px_4px_#00000040] lg:text-3xl">
              We provide a variety of the best lodging accommodations for those of you who need it.
            </p>
            <p className="mt-4 font-display text-base font-medium tracking-[0.1px] text-white [text-shadow:0px_4px_4px_#00000040] lg:text-lg">
              Don't worry about the quality of the service.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
