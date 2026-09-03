const OPENINGS = [
  { role: 'Frontend Engineer', team: 'Engineering', location: 'Bangalore (Hybrid)' },
  { role: 'Backend Engineer', team: 'Engineering', location: 'Bangalore (Hybrid)' },
  { role: 'Product Designer', team: 'Design', location: 'Remote' },
  { role: 'Growth Marketer', team: 'Marketing', location: 'Bangalore' },
  { role: 'Customer Support Lead', team: 'Operations', location: 'Remote' },
]

export default function Careers() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 16px' }}>
      <h1>Careers at HotelZilla</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40 }}>
        We're building the future of hotel discovery. Join a small, ambitious team that moves fast and cares deeply about the traveler experience.
      </p>

      <h2 style={{ marginBottom: 16 }}>Open Positions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPENINGS.map(({ role, team, location }) => (
          <div key={role} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{role}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{team} · {location}</div>
            </div>
            <a href="mailto:careers@hotelzilla.com" className="btn btn-primary btn-sm">Apply</a>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 32, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Don't see a fit? Send your resume to <a href="mailto:careers@hotelzilla.com">careers@hotelzilla.com</a>.
      </p>
    </div>
  )
}
