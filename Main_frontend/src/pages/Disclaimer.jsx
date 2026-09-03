const SECTIONS = [
  {
    title: 'General Information',
    body: 'The information provided on HotelZilla is for general informational purposes only. While we strive to keep hotel listings, prices, and availability accurate, we make no warranties — express or implied — about the completeness, accuracy, or reliability of any information on this platform.',
  },
  {
    title: 'Hotel Listings & Pricing',
    body: 'Hotel descriptions, images, amenities, and prices are provided by hotel owners and may change without notice. HotelZilla does not independently verify all listing details. We recommend confirming specific details directly with the hotel before booking.',
  },
  {
    title: 'Booking Outcomes',
    body: 'HotelZilla acts as an intermediary between travelers and hotels. We are not responsible for the quality of stay, service failures, property conditions, or any disputes between guests and hotels. Any issues during your stay should be raised directly with the hotel.',
  },
  {
    title: 'Third-Party Links',
    body: 'Our platform may contain links to third-party websites (e.g., payment gateways, map services). We have no control over the content or practices of these sites and accept no responsibility for them. Visiting third-party links is at your own risk.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, HotelZilla and its team shall not be liable for any direct, indirect, incidental, or consequential loss or damage arising from your use of this platform, including but not limited to booking errors, travel disruptions, or reliance on inaccurate listing information.',
  },
  {
    title: 'No Professional Advice',
    body: 'Nothing on HotelZilla constitutes legal, financial, or travel safety advice. For travel advisories, please consult official government sources.',
  },
]

export default function Disclaimer() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 16px' }}>
      <h1>Disclaimer</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 36 }}>Last updated: June 2025</p>
      <p style={{ marginBottom: 32 }}>By using HotelZilla, you acknowledge and agree to the following disclaimers.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {SECTIONS.map(({ title, body }) => (
          <section key={title} style={{ borderLeft: '3px solid var(--border)', paddingLeft: 16 }}>
            <h3 style={{ marginBottom: 8 }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{body}</p>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        For questions, contact <a href="mailto:legal@hotelzilla.com">legal@hotelzilla.com</a>.
      </div>
    </div>
  )
}
