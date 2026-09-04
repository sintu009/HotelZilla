import { useNavigate } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'

export default function LandingFooter({ config }) {
  const navigate = useNavigate()
  const qs = window.location.search
  const name = config?.brand_name || config?.name || 'Hotel'
  const logo = config?.logo_text || name[0] || 'H'

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'var(--brand-gradient)' }}>
              {logo}
            </span>
            <span className="font-bold text-lg">{name}</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            {config?.footer_tagline || 'Experience luxury and comfort at its finest.'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Quick Links</h4>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => navigate(`/${qs}`)} className="text-gray-400 text-sm hover:text-white transition-colors text-left">Home</button>
            <button onClick={() => navigate(`/rooms${qs}`)} className="text-gray-400 text-sm hover:text-white transition-colors text-left">Rooms & Suites</button>
            <button onClick={() => navigate(`/book${qs}`)} className="text-gray-400 text-sm hover:text-white transition-colors text-left">Book Now</button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Contact</h4>
          <div className="flex flex-col gap-3">
            {config?.support_email && (
              <a href={`mailto:${config.support_email}`} className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                <Mail size={14} /> {config.support_email}
              </a>
            )}
            {config?.support_phone && (
              <a href={`tel:${config.support_phone}`} className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                <Phone size={14} /> {config.support_phone}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-5 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </footer>
  )
}
