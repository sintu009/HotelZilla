import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../lib/useAuthStore'
import { Hotel, Check, ArrowLeft } from 'lucide-react'

const ALL_AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'AC', 'Beach Access', 'Room Service', 'Concierge', 'Business Center', 'Airport Shuttle', 'Yoga', 'Heating']

export default function RegisterHotel() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [form, setForm] = useState({
    name: '', description: '', address: '', city: '', state: '', country: 'India', pincode: '',
    star_rating: 3, contact_phone: '', contawct_email: '', total_rooms: 0, price_from: 0, cover_image: '', images: '',
  })
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setError('')
    setLoading(true)
    setTimeout(() => { setSuccess(true); setLoading(false) }, 800)
  }

  if (success) {
    return (
      <div className="container" style={{ paddingTop: 48, paddingBottom: 48, maxWidth: 600, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={32} color="#15803d" />
        </div>
        <h2>Registration Submitted!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your hotel registration has been submitted for admin approval. You'll be notified once it's reviewed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container empty-state" style={{ paddingTop: 48 }}>
        <h3>Sign in required</h3>
        <p>Please sign in as a hotel owner to register your hotel.</p>
        <div style={{ marginTop: 16 }}><button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button></div>
      </div>
    )
  }

  return (
    <div className="container reg-page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ marginBottom: 16 }}><ArrowLeft size={14} /> Back</button>
      <div className="reg-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Hotel size={24} color="var(--primary)" />
          <h2>Register Your Hotel</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>Submit your hotel for approval. Once approved by our admin team, it will appear on StayFinder.</p>
        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="reg-grid">
            <div className="form-group"><label className="label">Hotel Name *</label><input className="input" value={form.name} onChange={e => update('name', e.target.value)} required /></div>
            <div className="form-group"><label className="label">Star Rating</label><select className="input" value={form.star_rating} onChange={e => update('star_rating', +e.target.value)}><option value={1}>1 Star</option><option value={2}>2 Stars</option><option value={3}>3 Stars</option><option value={4}>4 Stars</option><option value={5}>5 Stars</option></select></div>
          </div>
          <div className="form-group"><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your hotel..." /></div>
          <div className="form-group"><label className="label">Address</label><input className="input" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Street address" /></div>
          <div className="reg-grid">
            <div className="form-group"><label className="label">City *</label><input className="input" value={form.city} onChange={e => update('city', e.target.value)} required /></div>
            <div className="form-group"><label className="label">State</label><input className="input" value={form.state} onChange={e => update('state', e.target.value)} /></div>
          </div>
          <div className="reg-grid">
            <div className="form-group"><label className="label">Country</label><input className="input" value={form.country} onChange={e => update('country', e.target.value)} /></div>
            <div className="form-group"><label className="label">Pincode</label><input className="input" value={form.pincode} onChange={e => update('pincode', e.target.value)} /></div>
          </div>
          <div className="reg-grid">
            <div className="form-group"><label className="label">Contact Phone</label><input className="input" value={form.contact_phone} onChange={e => update('contact_phone', e.target.value)} /></div>
            <div className="form-group"><label className="label">Contact Email</label><input className="input" type="email" value={form.contact_email} onChange={e => update('contact_email', e.target.value)} /></div>
          </div>
          <div className="reg-grid">
            <div className="form-group"><label className="label">Total Rooms</label><input className="input" type="number" value={form.total_rooms} onChange={e => update('total_rooms', +e.target.value)} /></div>
            <div className="form-group"><label className="label">Starting Price (per night)</label><input className="input" type="number" value={form.price_from} onChange={e => update('price_from', +e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="label">Cover Image URL</label><input className="input" value={form.cover_image} onChange={e => update('cover_image', e.target.value)} placeholder="https://..." /></div>
          <div className="form-group"><label className="label">Additional Image URLs (comma-separated)</label><input className="input" value={form.images} onChange={e => update('images', e.target.value)} placeholder="https://..., https://..." /></div>
          <div className="form-group">
            <label className="label">Amenities</label>
            <div className="amenity-checkbox-grid">
              {ALL_AMENITIES.map(a => (
                <label key={a} className="amenity-option"><input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />{a}</label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  )
}
