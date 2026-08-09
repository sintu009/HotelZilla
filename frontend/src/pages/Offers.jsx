import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('offers').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      supabase.from('coupons').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    ]).then(([o, c]) => {
      setOffers(o.data || [])
      setCoupons(c.data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="container loading-center"><div className="spinner" /></div>

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
                <img src={o.image_url || 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg'} alt={o.title} />
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

      <h3 style={{ marginBottom: 16 }}>Available Coupons</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {coupons.map(c => (
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
