import { Hotel, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hotel size={20} />
              </span>
              StayFinder
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 280, marginTop: 8 }}>
              Your trusted partner for finding and booking the perfect hotel stays worldwide.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Cancellation</a>
            <a href="#">Refund Policy</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> support@stayfinder.com</a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> +91 1800 123 4567</a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> Bangalore, India</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 StayFinder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
