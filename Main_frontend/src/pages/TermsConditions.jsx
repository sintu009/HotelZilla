const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using HotelZilla, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.',
  },
  {
    title: '2. Use of the Platform',
    body: 'HotelZilla provides a hotel discovery and booking service. You agree to use the platform only for lawful purposes and not to misuse, disrupt, or attempt to gain unauthorized access to any part of the service.',
  },
  {
    title: '3. Account Responsibility',
    body: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Notify us immediately at support@hotelzilla.com if you suspect unauthorized use.',
  },
  {
    title: '4. Bookings & Payments',
    body: 'All bookings made through HotelZilla are subject to the individual hotel\'s availability and policies. Prices are shown in INR and include applicable taxes unless stated otherwise. Payment is processed securely at the time of booking.',
  },
  {
    title: '5. Cancellations & Refunds',
    body: 'Cancellation and refund eligibility depends on the hotel\'s policy selected at the time of booking. Please review our Cancellation Policy and Refund Policy pages for full details.',
  },
  {
    title: '6. Hotel Listings',
    body: 'Hotels listed on HotelZilla are independently owned and operated. We do not guarantee the accuracy of hotel descriptions, images, or amenities. We encourage users to verify details directly with the hotel.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on HotelZilla — including logos, text, images, and software — is the property of HotelZilla or its licensors. You may not reproduce or distribute any content without prior written permission.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'HotelZilla is not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including issues with hotel stays, booking errors, or third-party services.',
  },
  {
    title: '9. Changes to Terms',
    body: 'We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms. The "Last updated" date at the top reflects the most recent revision.',
  },
  {
    title: '10. Governing Law',
    body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.',
  },
]

export default function TermsConditions() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 16px' }}>
      <h1>Terms &amp; Conditions</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 36 }}>Last updated: June 2025</p>
      <p style={{ marginBottom: 32 }}>Please read these Terms and Conditions carefully before using HotelZilla. These terms govern your access to and use of our website and services.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {SECTIONS.map(({ title, body }) => (
          <section key={title}>
            <h3 style={{ marginBottom: 8 }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{body}</p>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Questions about these Terms? Contact us at <a href="mailto:legal@hotelzilla.com">legal@hotelzilla.com</a>.
      </div>
    </div>
  )
}
