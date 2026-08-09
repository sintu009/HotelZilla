import { Link } from 'react-router-dom'
import { WHITE_LABEL } from '../lib/whiteLabel'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function PublicFooter() {
  const brand = WHITE_LABEL
  return (
    <footer className="public-footer">
      <div className="public-container">
        <div className="public-footer-grid">
          <div>
            <div className="public-footer-brand">
              <span className="public-logo-icon">{brand.logo_text || brand.brand_name?.[0] || 'H'}</span>
              {brand.brand_name}
            </div>
            <p className="public-footer-desc">{brand.brand_tagline} — Your trusted partner for finding and booking the perfect hotel stays.</p>
          </div>
          <div className="public-footer-col">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/hotels">All Hotels</Link>
            <Link to="/dashboard">Partner Dashboard</Link>
          </div>
          <div className="public-footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Cancellation Policy</a>
            <a href="#">Refund Policy</a>
          </div>
          <div className="public-footer-col">
            <h4>Contact</h4>
            <a href={`mailto:${brand.support_email}`}><Mail size={14} /> {brand.support_email}</a>
            <a href={`tel:${brand.support_phone}`}><Phone size={14} /> {brand.support_phone}</a>
            <a href="#"><MapPin size={14} /> India</a>
          </div>
        </div>
        <div className="public-footer-bottom">© 2026 {brand.brand_name}. All rights reserved.</div>
      </div>
    </footer>
  )
}
