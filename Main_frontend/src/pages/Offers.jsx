import { useState, useEffect } from 'react'
import client from '../api/client'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    client.get('/api/cms/offers')
      .then(res => setOffers(res.data || res || []))
      .catch(() => {})

    client.get('/api/coupons')
      .then(res => setCoupons(res.data || res || []))
      .catch(() => {})
  }, [])

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2 className="section-title">Offers & Coupons</h2>
      <p className="section-subtitle">Save on your next booking with these exclusive deals</p>

      {offers.length > 0 && (
        <>
          <h3 style={{ marginBottom: 16, marginTop: 16 }}>Promotional Offers</h3>
          <div className="offer-grid" style={{ marginBottom: 40 }}>
            {offers.map(o => (
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
        </>
      )}

      {coupons.length > 0 && (
        <>
          <h3 style={{ marginBottom: 16 }}>Available Coupons</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {coupons.map(c => (
              <div key={c.id} className="card" style={{ padding: 20, border: '2px dashed var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>{c.code}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.description}</div>
                  </div>
                  <span className="badge badge-info">
                    {c.discount_type === 'percent' || c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: 8 }}>
                  {c.min_amount > 0 && <div>Min order: ₹{c.min_amount}</div>}
                  {c.expires_at && <div>Valid until: {new Date(c.expires_at).toLocaleDateString('en-IN')}</div>}
                  {c.max_uses > 0 && <div>{c.max_uses - (c.uses || 0)} uses remaining</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {offers.length === 0 && coupons.length === 0 && (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <p>No offers available right now. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
