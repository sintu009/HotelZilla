const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'Account information: name, email address, and password when you register.',
      'Booking information: hotel preferences, check-in/check-out dates, and payment details (processed securely via our payment provider).',
      'Usage data: pages visited, search queries, and device/browser information collected via cookies and analytics tools.',
      'Communications: messages you send to our support team.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'To process and manage your hotel bookings.',
      'To send booking confirmations, updates, and support responses.',
      'To improve our platform through analytics and user feedback.',
      'To send promotional offers and newsletters (you can opt out at any time).',
      'To comply with legal obligations.',
    ],
  },
  {
    title: '3. Sharing Your Information',
    body: [
      'With hotels: we share your booking details with the hotel you book.',
      'With payment processors: to securely handle transactions.',
      'With analytics providers: anonymized usage data to improve our service.',
      'We do not sell your personal data to third parties.',
    ],
  },
  {
    title: '4. Cookies',
    body: [
      'We use cookies to keep you logged in, remember your preferences, and analyze site traffic.',
      'You can disable cookies in your browser settings, but some features may not work correctly.',
    ],
  },
  {
    title: '5. Data Security',
    body: [
      'We use industry-standard encryption (HTTPS/TLS) to protect data in transit.',
      'Passwords are hashed and never stored in plain text.',
      'Access to personal data is restricted to authorized personnel only.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'Access: request a copy of the personal data we hold about you.',
      'Correction: ask us to correct inaccurate data.',
      'Deletion: request deletion of your account and associated data.',
      'Opt-out: unsubscribe from marketing emails at any time.',
      'To exercise these rights, email privacy@hotelzilla.com.',
    ],
  },
  {
    title: '7. Data Retention',
    body: [
      'We retain your data for as long as your account is active or as needed to provide services.',
      'Booking records may be retained for up to 5 years for legal and accounting purposes.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    body: [
      'We may update this Privacy Policy periodically. We\'ll notify you of significant changes via email or a notice on our website.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 16px' }}>
      <h1>Privacy Policy</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 36 }}>Last updated: June 2025</p>
      <p style={{ marginBottom: 32 }}>HotelZilla ("we", "our", "us") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {SECTIONS.map(({ title, body }) => (
          <section key={title}>
            <h3 style={{ marginBottom: 10 }}>{title}</h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {body.map(item => (
                <li key={item} style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Privacy questions? Contact us at <a href="mailto:privacy@hotelzilla.com">privacy@hotelzilla.com</a>.
      </div>
    </div>
  )
}
