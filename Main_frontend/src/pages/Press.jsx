const PRESS = [
  { date: 'June 2025', outlet: 'TechCrunch India', headline: 'HotelZilla raises seed round to expand hotel discovery across India' },
  { date: 'April 2025', outlet: 'YourStory', headline: 'How HotelZilla is simplifying hotel bookings for Indian travelers' },
  { date: 'February 2025', outlet: 'Economic Times', headline: 'Bangalore startup HotelZilla onboards 500+ hotels in first quarter' },
]

export default function Press() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 16px' }}>
      <h1>Press & Media</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40 }}>
        For press inquiries, contact us at <a href="mailto:press@hotelzilla.com">press@hotelzilla.com</a>.
      </p>

      <h2 style={{ marginBottom: 16 }}>In the News</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PRESS.map(({ date, outlet, headline }) => (
          <div key={headline} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: 16 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{outlet} · {date}</div>
            <div style={{ fontWeight: 500 }}>{headline}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, background: 'var(--surface)', borderRadius: 12, padding: '24px 28px' }}>
        <h3 style={{ marginTop: 0 }}>Press Kit</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>Download our logos, brand guidelines, and company fact sheet.</p>
        <a href="mailto:press@hotelzilla.com" className="btn btn-primary btn-sm">Request Press Kit</a>
      </div>
    </div>
  )
}
