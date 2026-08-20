import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const navigationGroups = [
  { title: 'Services', links: [
    { label: 'Email Marketing', path: '/hotels' },
    { label: 'Campaigns', path: '/hotels' },
    { label: 'Branding', path: '/hotels' },
    { label: 'Offline', path: '/hotels' },
  ]},
  { title: 'About', links: [
    { label: 'Our Story', path: '/hotels' },
    { label: 'Benefits', path: '/hotels' },
    { label: 'Team', path: '/dashboard' },
    { label: 'Careers', path: '/dashboard' },
  ]},
  { title: 'Help', links: [
    { label: 'FAQs', path: '/hotels' },
    { label: 'Contact Us', path: '/hotels' },
  ]},
]

const legalLinks = [
  { label: 'Terms & Conditions', path: '/hotels' },
  { label: 'Privacy Policy', path: '/hotels' },
]

export default function FooterNavigationSection() {
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

  return (
    <footer className="w-full bg-[#1c1c1c] px-6 pt-20 shadow-[inset_0px_4px_4px_#00000040] sm:px-12 lg:px-[8%]">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex min-h-[100px] flex-col justify-between border-b-2 border-white/10 pb-12 lg:flex-row lg:items-center">
          <button onClick={() => navigate('/')} className="flex items-end gap-0.5 text-[#f6f6f6] drop-shadow-[0px_4px_4px_#00000040]">
            <span className="font-display text-3xl font-normal tracking-[0.1px] lg:text-[40px]">Bookme.</span>
            <span className="font-display text-lg font-normal tracking-[0.1px] lg:text-xl">com</span>
          </button>
          <div className="mt-6 flex items-center justify-between gap-6 lg:mt-0">
            <p className="font-display text-lg font-normal tracking-[-0.3px] text-white lg:text-xl">Ready to get started?</p>
            <button onClick={() => navigate('/hotels')} className="h-14 rounded-lg bg-[#c49c74] px-8 font-display text-lg font-medium tracking-[-0.23px] text-[#252525] hover:bg-[#d0aa84] lg:text-xl">Get started</button>
          </div>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:justify-between lg:gap-16">
          <section>
            <h2 className="font-display text-lg font-normal tracking-[-0.3px] text-white lg:text-xl">Subscribe to our<br />newsletter</h2>
            <form onSubmit={handleSubscribe} className="mt-10 flex h-14 border-b-2 border-white/10" >
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 flex-1 border-0 bg-transparent p-0 font-display text-sm font-normal tracking-[-0.2px] text-white outline-none placeholder:text-white/50 lg:text-base" />
              <button className="h-14 w-14 shrink-0 border-0 bg-[#c49c74] p-0 text-[#252525] hover:bg-[#d0aa84]">
                <ArrowRight className="mx-auto h-5 w-5" />
              </button>
            </form>
            {subscribed && <p className="mt-3 font-display text-sm text-[#c49c74]">Thanks for subscribing!</p>}
          </section>

          {navigationGroups.map((group) => (
            <nav key={group.title}>
              <h2 className="font-display text-sm font-normal tracking-[-0.23px] text-[#c49c74] lg:text-base">{group.title}</h2>
              <ul className="mt-5 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => navigate(link.path)} className="font-display text-sm font-normal tracking-[-0.2px] text-white hover:text-white/80 lg:text-base">{link.label}</button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex min-h-[34px] flex-col gap-8 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <nav>
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className="font-display text-sm font-normal tracking-[-0.2px] text-white hover:text-white/80 lg:text-base">{link.label}</button>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-display text-sm text-white/50">© 2026 Bookme.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
