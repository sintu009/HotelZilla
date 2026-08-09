const MOCK_OFFERS = [
  { id: 1, title: '20% Off Weekend Stays', description: 'Book any hotel for the weekend and save 20%', code: 'WEEKEND20', image_url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg' },
  { id: 2, title: 'Early Bird Deal', description: 'Book 30 days in advance and get flat ₹1000 off', code: 'EARLY1000', image_url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg' },
]

const MOCK_COUPONS = [
  { id: 1, code: 'WEEKEND20', description: 'Weekend special discount', discount_type: 'percentage', discount_value: 20, min_order_amount: 3000, max_discount_amount: 2000, valid_until: '2026-12-31', usage_limit: 100, used_count: 12 },
  { id: 2, code: 'EARLY1000', description: 'Early bird flat discount', discount_type: 'flat', discount_value: 1000, min_order_amount: 5000, max_discount_amount: 0, valid_until: '2026-12-31', usage_limit: 50, used_count: 8 },
  { id: 3, code: 'FIRST500', description: 'First booking discount', discount_type: 'flat', discount_value: 500, min_order_amount: 2000, max_discount_amount: 0, valid_until: '2026-06-30', usage_limit: 200, used_count: 45 },
]

export default function Offers() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2 className="section-title">Offers & Coupons</h2>
      <p className="section-subtitle">Save on your next booking with these exclusive deals</p>

      <h3 style={{ marginBottom: 16, marginTop: 16 }}>Promotional Offers</h3>
      <div className="offer-grid" style={{ marginBottom: 40 }}>
        {MOCK_OFFERS.map(o => (
          <div key={o.id} className="offer-card">
            <img src={o.image_url} alt={o.title} />
            <div className="offer-card-overlay">
              <div className="offer-card-title">{o.title}</div>
              <div className="offer-card-desc">{o.description}</div>
              {o.code && <span className="offer-card-code">Code: {o.code}</span>}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 16 }}>Available Coupons</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {MOCK_COUPONS.map(c => (
          <div key={c.id} className="card" style={{ padding: 20, border: '2px dashed var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>{c.code}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.description}</div>
              </div>
              <span className="badge badge-info">{c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: 8 }}>
              {c.min_order_amount > 0 && <div>Min order: ₹{c.min_order_amount}</div>}
              {c.max_discount_amount > 0 && <div>Max discount: ₹{c.max_discount_amount}</div>}
              <div>Valid until: {new Date(c.valid_until).toLocaleDateString('en-IN')}</div>
              {c.usage_limit > 0 && <div>{c.usage_limit - c.used_count} uses remaining</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
