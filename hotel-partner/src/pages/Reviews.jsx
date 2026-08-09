import { useState } from 'react'
import { REVIEWS, HOTELS } from '../lib/mockData'
import { formatDate } from '../lib/format'
import { Star, Reply } from 'lucide-react'

export default function Reviews() {
  const [filter, setFilter] = useState('')
  const [hotelFilter, setHotelFilter] = useState('')

  const filtered = REVIEWS
    .filter(r => !filter || (filter === 'pending' ? !r.is_approved : r.is_approved))
    .filter(r => !hotelFilter || r.hotel_id === hotelFilter)

  const avgRating = REVIEWS.length > 0 ? (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1) : '—'

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Reviews</div><div className="page-subtitle">{REVIEWS.length} reviews across your properties</div></div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{avgRating} <Star size={20} color="#fbbf24" fill="currentColor" /></div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card"><div className="stat-value">{REVIEWS.filter(r => r.is_approved).length}</div><div className="stat-label">Published</div></div>
        <div className="stat-card"><div className="stat-value">{REVIEWS.filter(r => !r.is_approved).length}</div><div className="stat-label">Pending Approval</div></div>
      </div>

      <div className="filter-bar">
        <select className="input" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Reviews</option>
          <option value="approved">Published</option>
          <option value="pending">Pending</option>
        </select>
        <select className="input" style={{ width: 200 }} value={hotelFilter} onChange={e => setHotelFilter(e.target.value)}>
          <option value="">All Hotels</option>
          {HOTELS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.length === 0
          ? <div className="empty-state"><h3>No reviews found</h3></div>
          : filtered.map(r => (
            <div key={r.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.reviewer}</div>
                  <div style={{ display: 'flex', gap: 1, marginTop: 2 }}>
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} color="#fbbf24" fill="currentColor" />)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.hotel_name}</span>
                  <span className={`badge ${r.is_approved ? 'badge-success' : 'badge-warning'}`}>{r.is_approved ? 'Published' : 'Pending'}</span>
                </div>
              </div>
              {r.title && <h4 style={{ marginBottom: 4 }}>{r.title}</h4>}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{r.comment}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</span>
                <button className="btn btn-secondary btn-sm"><Reply size={14} /> Reply</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
