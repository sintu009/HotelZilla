import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function LandingHeader({ config }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const qs = window.location.search
  const name = config?.brand_name || config?.name || 'Hotel'
  const logo = config?.logo_text || name[0] || 'H'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate(`/${qs}`)} className="flex items-center gap-2.5">
          {config?.logo_url ? (
            <img src={config.logo_url} alt={name} className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--brand-gradient)' }}>
              {logo}
            </span>
          )}
          <span className="font-bold text-gray-900 text-lg leading-none">{name}</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate(`/${qs}`)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Home</button>
          <button onClick={() => navigate(`/rooms${qs}`)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Rooms</button>
          {config?.support_email && <a href={`mailto:${config.support_email}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</a>}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/book${qs}`)}
            className="hidden md:inline-flex items-center px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--brand-gradient)' }}>
            Book Now
          </button>
          <button onClick={() => navigate('/login')} className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 transition-all bg-white">
            Partner Login
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          <button onClick={() => { navigate(`/${qs}`); setOpen(false) }} className="text-sm font-medium text-gray-700 text-left">Home</button>
          <button onClick={() => { navigate(`/rooms${qs}`); setOpen(false) }} className="text-sm font-medium text-gray-700 text-left">Rooms</button>
          <button onClick={() => { navigate('/login'); setOpen(false) }} className="text-sm font-medium text-gray-700 text-left">Partner Login</button>
          <button onClick={() => { navigate(`/book${qs}`); setOpen(false) }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--brand-gradient)' }}>
            Book Now
          </button>
        </div>
      )}
    </header>
  )
}
