import { Hotel } from 'lucide-react'

export default function About() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Hotel size={28} color="var(--primary)" />
        <h1 style={{ margin: 0 }}>About HotelZilla</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 32 }}>
        Your trusted partner for finding and booking the perfect hotel stays worldwide.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2>Who We Are</h2>
        <p>HotelZilla is a hotel discovery and booking platform founded in 2024, headquartered in Bangalore, India. We connect travelers with thousands of hotels across the country, making it easy to find the right stay at the right price.</p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Our Mission</h2>
        <p>We believe every trip deserves a great place to stay. Our mission is to make hotel booking simple, transparent, and trustworthy — for both travelers and hotel owners.</p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>For Hotel Owners</h2>
        <p>We offer hotel owners a free, easy registration process. Once approved by our team, your property is listed and visible to millions of travelers. We handle the discovery — you handle the hospitality.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Reach us at <a href="mailto:support@hotelzilla.com">support@hotelzilla.com</a> or call <strong>+91 1800 123 4567</strong>.</p>
      </section>
    </div>
  )
}
