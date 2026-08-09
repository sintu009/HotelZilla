import { useState } from 'react'
import { REVIEWS } from '../lib/mockData'
import { formatDate } from '../lib/format'
import { Check, X, Star } from 'lucide-react'

export default function Reviews() {
  const [rows, setRows] = useState(REVIEWS)
  const [filter, setFilter] = useState('')

  const filtered = filter === 'pending' ? rows.filter(r => !r.is_approved)
    : filter === 'approved' ? rows.filter(r => r.is_approved)
    : rows

  const toggle = (r) =>
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, is_approved: !x.is_approved } : x))

  const remove = (r) =>
    setRows(prev => prev.filter(x => x.id !== r.id))

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Reviews</div><div className="page-subtitle">{rows.length} total reviews</div></div></div>

      <div className="filter-bar">
        <select className="input" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Reviews</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Hotel</th><th>Reviewer</th><th>Rating</th><th>Comment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reviews found</td></tr>
                : filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.hotel_name}</td>
                    <td>{r.reviewer}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="star" fill="currentColor" />)}
                      </div>
                    </td>
                    <td style={{ maxWidth: 250, fontSize: '0.8rem' }}>
                      {r.title && <strong>{r.title}: </strong>}{r.comment}
                    </td>
                    <td><span className={`badge ${r.is_approved ? 'badge-success' : 'badge-warning'}`}>{r.is_approved ? 'Approved' : 'Pending'}</span></td>
                    <td>{formatDate(r.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" title={r.is_approved ? 'Unapprove' : 'Approve'} onClick={() => toggle(r)}>
                          {r.is_approved ? <X size={14} /> : <Check size={14} />}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(r)}><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
