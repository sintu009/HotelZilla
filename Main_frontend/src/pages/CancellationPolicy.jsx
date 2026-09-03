export default function CancellationPolicy() {
  return (
    <div className="container" style={{ maxWidth: 720, padding: '48px 16px' }}>
      <h1>Cancellation Policy</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Last updated: June 2025</p>

      <section style={{ marginBottom: 28 }}>
        <h2>Free Cancellation</h2>
        <p>Most hotels on HotelZilla offer free cancellation up to 24–48 hours before check-in. The exact window is shown on the hotel's booking page before you confirm.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Non-Refundable Bookings</h2>
        <p>Some discounted rates are non-refundable. These are clearly marked as <strong>"Non-Refundable"</strong> during checkout. Once confirmed, these bookings cannot be cancelled or modified.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>How to Cancel</h2>
        <ol style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>Sign in to your HotelZilla account.</li>
          <li>Go to <strong>My Bookings</strong>.</li>
          <li>Select the booking you want to cancel.</li>
          <li>Click <strong>Cancel Booking</strong> and confirm.</li>
        </ol>
        <p>You'll receive a cancellation confirmation email within a few minutes.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>No-Show Policy</h2>
        <p>If you don't check in and haven't cancelled, the booking is treated as a no-show. No-shows are generally non-refundable.</p>
      </section>

      <section>
        <h2>Questions?</h2>
        <p>Contact us at <a href="mailto:support@hotelzilla.com">support@hotelzilla.com</a> or call <strong>+91 1800 123 4567</strong>.</p>
      </section>
    </div>
  )
}
