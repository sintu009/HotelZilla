export default function RefundPolicy() {
  return (
    <div className="container" style={{ maxWidth: 720, padding: '48px 16px' }}>
      <h1>Refund Policy</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Last updated: June 2025</p>

      <section style={{ marginBottom: 28 }}>
        <h2>Eligible Refunds</h2>
        <p>Refunds are issued when:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>You cancel within the hotel's free cancellation window.</li>
          <li>The hotel cancels your booking.</li>
          <li>There is a verified error in the booking (e.g., duplicate charge).</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Refund Timeline</h2>
        <p>Approved refunds are processed within <strong>5–7 business days</strong>. The amount is credited back to your original payment method (credit/debit card, UPI, net banking).</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Non-Refundable Cases</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>Bookings marked as non-refundable at checkout.</li>
          <li>Cancellations made after the free cancellation deadline.</li>
          <li>No-shows.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Partial Refunds</h2>
        <p>For early check-outs, refunds depend on the hotel's individual policy. Contact the hotel directly or reach out to our support team.</p>
      </section>

      <section>
        <h2>Raise a Refund Request</h2>
        <p>Email us at <a href="mailto:support@hotelzilla.com">support@hotelzilla.com</a> with your booking ID and reason. We'll respond within 1 business day.</p>
      </section>
    </div>
  )
}
