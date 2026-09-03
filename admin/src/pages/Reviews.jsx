import { useState } from 'react'
import { reviewsApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatDate } from '../lib/format'
import { Star, Trash2 } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

export default function Reviews() {
  const toast = useToast()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting]           = useState(false)

  const { data, loading, error, refetch } = useFetch(() => reviewsApi.list(1, 100))
  const rows = data?.data ?? []

  const remove = async (r) => {
    setDeleting(true)
    try {
      await reviewsApi.delete(r.id)
      toast.error('Review Deleted', `Review #${r.id} has been permanently removed.`)
      refetch()
    } catch (err) {
      toast.error('Error', err.message)
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Reviews</div><div className="page-subtitle">{rows.length} total reviews</div></div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Hotel</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reviews found</td></tr>
                    : rows.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.hotel_name}</td>
                        <td>{r.customer_name}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 1, color: '#f59e0b' }}>
                            {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                          </div>
                        </td>
                        <td style={{ maxWidth: 280, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.comment || '—'}</td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(r)}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => remove(confirmDelete)}
        loading={deleting}
        variant="danger"
        title="Delete Review?"
        message={`This review will be permanently deleted.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
