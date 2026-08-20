import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const navigationGroups = [
  { title: 'Services', links: ['Email Marketing', 'Campaigns', 'Branding', 'Offline'] },
  { title: 'About', links: ['Our Story', 'Benefits', 'Team', 'Careers'] },
  { title: 'Help', links: ['FAQs', 'Contact Us'] },
]

const legalLinks = ['Terms & Conditions', 'Privacy Policy']

export default function FooterNavigationSection() {
  const [email, setEmail] = useState('')

  return (
    <footer className="w-full min-h-[845px] bg-[#1c1c1c] px-6 pt-[76px] shadow-[inset_0px_4px_4px_#00000040] sm:px-10 lg:px-0">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex min-h-[125px] flex-col justify-between border-b-[3px] border-white/10 pb-[46px] lg:flex-row lg:items-start">
          <div className="mt-[17px] flex h-12 w-[207px] items-start text-[#f6f6f6] shadow-[0px_4px_4px_#00000040]">
            <span className="h-12 w-[163px] text-center font-display text-[40px] font-normal tracking-[0.1px]">Bookme.</span>
            <span className="mt-[19px] w-10 text-center font-display text-xl font-normal tracking-[0.1px]">com</span>
          </div>
          <div className="flex h-[76px] w-full max-w-[562px] items-center justify-between gap-6 lg:ml-auto">
            <p className="font-display text-[22px] font-normal tracking-[-0.3px] text-white">Ready to get started?</p>
            <button className="h-[76px] w-[230px] shrink-0 rounded-lg bg-[#c49c74] px-0 font-display text-xl font-medium tracking-[-0.23px] text-[#252525] hover:bg-[#c49c74]/90">Get started</button>
          </div>
        </header>

        <div className="mt-[75px] grid gap-12 lg:grid-cols-[minmax(0,386px)_142px_87px_102px] lg:justify-between lg:gap-0">
          <section className="h-auto lg:h-[277px]">
            <h2 className="pt-9 font-display text-[22px] font-normal tracking-[-0.3px] text-white">Subscribe to our<br />newsletter</h2>
            <form className="mt-[47px] flex h-[77px] border-b-[3px] border-white/10" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-[76px] flex-1 rounded-none border-0 bg-transparent px-0 font-display text-[15px] font-normal tracking-[-0.2px] text-white outline-none placeholder:text-white/50" />
              <button className="h-[76px] w-[67px] shrink-0 rounded-none bg-[#c49c74] p-0 text-[#252525] hover:bg-[#c49c74]/90">
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </section>

          {navigationGroups.map((group) => (
            <nav key={group.title} className="pt-12 lg:h-[277px]">
              <h2 className="font-display text-[17px] font-normal tracking-[-0.23px] text-[#c49c74]">{group.title}</h2>
              <ul className="mt-5 space-y-5">
                {group.links.map((link) => (
                  <li key={link}>
                    <button className="font-display text-[15px] font-normal tracking-[-0.2px] text-white hover:text-white">{link}</button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-[106px] flex min-h-[34px] flex-col gap-8 pb-10 sm:flex-row sm:items-center sm:justify-between lg:pb-0">
          <nav>
            <ul className="flex flex-wrap items-center gap-x-[52px] gap-y-3">
              {legalLinks.map((link) => (
                <li key={link}>
                  <button className="font-display text-[15px] font-normal tracking-[-0.2px] text-white hover:text-white">{link}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
