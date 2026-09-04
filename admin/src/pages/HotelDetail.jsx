import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { hotelsApi, uploadImage } from '../lib/api'
import { formatDate, formatPrice } from '../lib/format'
import { ArrowLeft, Pencil, Save, X, Plus, Trash2, ImagePlus, ArrowLeftIcon, ArrowRightIcon, Check, DoorOpen, DoorClosed } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_BADGE = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-error', suspended: 'badge-neutral' }
const EMPTY_ROOM   = { room_number: '', room_type: '', price_per_night: '', capacity: 2, amenities: '', images: [] }
const fmt = (n) => n ? formatPrice(n) : '—'

export default function HotelDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const toast    = useToast()

  const [hotel, setHotel]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [rooms, setRooms]               = useState([])
  const [tab, setTab]                   = useState('info') // info | photos | rooms | whitelabel

  // info edit
  const [editInfo, setEditInfo]         = useState(false)
  const [infoForm, setInfoForm]         = useState({})
  const [savingInfo, setSavingInfo]     = useState(false)

  // white-label
  const [wlForm, setWlForm]             = useState({})
  const [savingWl, setSavingWl]         = useState(false)

  // photos
  const [images, setImages]             = useState([])
  const [savingImgs, setSavingImgs]     = useState(false)

  // rooms
  const [roomForm, setRoomForm]         = useState(EMPTY_ROOM)
  const [editingRoom, setEditingRoom]   = useState(null)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [savingRoom, setSavingRoom]     = useState(false)
  const [delRoom, setDelRoom]           = useState(null)
  const [uploadingRoomImg, setUploadingRoomImg] = useState(false)

  // status
  const [acting, setActing]             = useState(false)
  const [confirmApprove, setConfirmApprove] = useState(false)
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [rejectMode, setRejectMode]     = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    Promise.all([
      hotelsApi.getById(id),
      hotelsApi.getRooms(id),
    ]).then(([hotelRes, roomsRes]) => {
      setHotel(hotelRes)
      setImages(hotelRes.images || [])
      setRooms(roomsRes || [])
      setWlForm({
        brand_name: hotelRes.brand_name || hotelRes.name || '',
        brand_tagline: hotelRes.brand_tagline || '',
        logo_text: hotelRes.logo_text || (hotelRes.name || '').slice(0, 2).toUpperCase(),
        logo_url: hotelRes.logo_url || '',
        theme: hotelRes.theme || 'emerald',
        landing_page_enabled: hotelRes.landing_page_enabled || false,
        cover_image: hotelRes.cover_image || (hotelRes.images || [])[0] || '',
        support_email: hotelRes.contact_email || '',
        support_phone: hotelRes.contact_phone || '',
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const saveWhiteLabel = async (e) => {
    e.preventDefault()
    setSavingWl(true)
    try {
      await hotelsApi.update(id, { ...wlForm })
      setHotel(h => ({ ...h, ...wlForm }))
      toast.success('White Label Saved', 'Landing page branding updated.')
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingWl(false) }
  }

  const saveImages = async (imgs) => {
    setSavingImgs(true)
    try {
      const updated = await hotelsApi.update(id, {
        name: hotel.name, description: hotel.description,
        city: hotel.city, address: hotel.address,
        amenities: hotel.amenities || [], images: imgs,
      })
      setHotel(updated); setImages(updated.images || [])
      toast.success('Photos saved', 'Hotel photos updated.')
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingImgs(false) }
  }

  const removeImage = (i) => {
    const imgs = images.filter((_, idx) => idx !== i)
    setImages(imgs); saveImages(imgs)
  }

  const moveImage = (i, dir) => {
    const imgs = [...images]
    const j = i + dir
    if (j < 0 || j >= imgs.length) return
    ;[imgs[i], imgs[j]] = [imgs[j], imgs[i]]
    setImages(imgs); saveImages(imgs)
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault(); setSavingInfo(true)
    try {
      const updated = await hotelsApi.update(id, {
        ...infoForm,
        amenities: typeof infoForm.amenities === 'string'
          ? infoForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
          : infoForm.amenities,
        images,
        star_rating: Number(infoForm.star_rating) || 3,
        pets_allowed: infoForm.pets_allowed === true || infoForm.pets_allowed === 'true',
        smoking_allowed: infoForm.smoking_allowed === true || infoForm.smoking_allowed === 'true',
        breakfast_included: infoForm.breakfast_included === true || infoForm.breakfast_included === 'true',
        latitude: infoForm.latitude ? Number(infoForm.latitude) : null,
        longitude: infoForm.longitude ? Number(infoForm.longitude) : null,
      })
      setHotel(updated); setEditInfo(false)
      toast.success('Saved', 'Hotel info updated.')
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingInfo(false) }
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault(); setSavingRoom(true)
    const payload = {
      ...roomForm,
      price_per_night: Number(roomForm.price_per_night),
      capacity: Number(roomForm.capacity),
      amenities: typeof roomForm.amenities === 'string'
        ? roomForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
        : roomForm.amenities,
      images: roomForm.images || [],
    }
    try {
      if (editingRoom) {
        const updated = await hotelsApi.updateRoom(editingRoom.id, payload)
        setRooms(rs => rs.map(r => r.id === updated.id ? updated : r))
        toast.success('Updated', `Room ${updated.room_number} updated.`)
      } else {
        const created = await hotelsApi.addRoom(id, payload)
        setRooms(rs => [...rs, created])
        toast.success('Added', `Room ${created.room_number} added.`)
      }
      setShowRoomForm(false); setEditingRoom(null); setRoomForm(EMPTY_ROOM)
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingRoom(false) }
  }

  const handleDeleteRoom = async (room) => {
    try {
      await hotelsApi.deleteRoom(room.id)
      setRooms(rs => rs.filter(r => r.id !== room.id))
      toast.success('Deleted', `Room ${room.room_number} deleted.`)
    } catch (err) { toast.error('Error', err.message) }
    finally { setDelRoom(null) }
  }

  const startEditRoom = (room) => {
    setEditingRoom(room)
    setRoomForm({ room_number: room.room_number || '', room_type: room.room_type || '', price_per_night: room.price_per_night || '', capacity: room.capacity || 2, amenities: (room.amenities || []).join(', '), images: room.images || [], is_available: room.is_available ?? true })
    setShowRoomForm(true)
  }

  const updateStatus = async (newStatus) => {
    setActing(true)
    try {
      await hotelsApi.updateStatus(id, newStatus)
      setHotel(h => ({ ...h, status: newStatus }))
      const labels = { approved: 'Approved', rejected: 'Rejected', pending: 'Re-listed for review' }
      toast[newStatus === 'rejected' ? 'error' : 'success'](labels[newStatus], `Hotel status updated.`)
    } catch (err) { toast.error('Error', err.message) }
    finally { setActing(false); setConfirmApprove(false); setRejectMode(false); setRejectReason('') }
  }

  const handleToggleOpen = async () => {
    setActing(true)
    try {
      const res = await hotelsApi.toggleOpen(id)
      setHotel(h => ({ ...h, is_open: res.is_open }))
      toast[res.is_open ? 'success' : 'warning'](
        res.is_open ? 'Hotel Opened' : 'Hotel Closed',
        `Hotel is now ${res.is_open ? 'open and accepting bookings' : 'closed for new bookings'}.`
      )
    } catch (err) { toast.error('Error', err.message) }
    finally { setActing(false); setConfirmToggleOpen(false) }
  }

  const handleDelete = async () => {
    setActing(true)
    try {
      await hotelsApi.deleteHotel(id)
      toast.success('Deleted', `${hotel.name} has been permanently deleted.`)
      navigate('/hotels')
    } catch (err) { toast.error('Error', err.message) }
    finally { setActing(false); setConfirmDelete(false) }
  }

  if (loading) return <div className="loading-center"><span className="spinner" /></div>
  if (!hotel)  return <div className="page-header"><div className="page-title">Hotel not found</div></div>

  const minPrice = rooms.length ? Math.min(...rooms.map(r => Number(r.price_per_night) || 0)) : null

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div className="page-title">{hotel.name}</div>
            <div className="page-subtitle">{hotel.city}{hotel.address ? ` · ${hotel.address}` : ''}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`badge ${STATUS_BADGE[hotel.status] || 'badge-neutral'}`}>{hotel.status}</span>
          {hotel.status === 'approved' && (
            <span className={`badge ${hotel.is_open !== false ? 'badge-success' : 'badge-error'}`}>
              {hotel.is_open !== false ? 'Open' : 'Closed'}
            </span>
          )}
          {/* pending: Approve + Reject */}
          {hotel.status === 'pending' && <>
            <button className="btn btn-success btn-sm" onClick={() => setConfirmApprove(true)}><Check size={13} /> Approve</button>
            <button className="btn btn-danger btn-sm" onClick={() => setRejectMode(true)}><X size={13} /> Reject</button>
          </>}
          {/* rejected: Re-list only */}
          {hotel.status === 'rejected' && (
            <button className="btn btn-secondary btn-sm" onClick={() => setConfirmApprove('relist')}>↩ Re-list</button>
          )}
          {/* approved: Close/Open + Delete */}
          {hotel.status === 'approved' && <>
            <button
              className={`btn btn-sm ${hotel.is_open !== false ? 'btn-warning' : 'btn-success'}`}
              onClick={() => setConfirmToggleOpen(true)}
            >
              {hotel.is_open !== false ? <><DoorClosed size={13}/> Close Hotel</> : <><DoorOpen size={13}/> Open Hotel</>}
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={13}/> Delete
            </button>
          </>}
        </div>
      </div>

      {/* Cover image */}
      {images[0] && (
        <div style={{ borderRadius: 12, overflow: 'hidden', height: 220, marginBottom: 24 }}>
          <img src={images[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }} />
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          ['Price From', minPrice ? fmt(minPrice) + '/night' : '—'],
          ['Rooms',      rooms.length],
          ['Owner',      hotel.owner_name || '—'],
          ['Registered', formatDate(hotel.created_at)],
        ].map(([l, v]) => (
          <div key={l} className="card" style={{ flex: '1 1 140px', padding: '14px 18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="hotel-tabs" style={{ marginBottom: 20 }}>
        {[['info','Info'],['photos','Photos'],['rooms','Rooms'],['whitelabel','White Label']].map(([key, label]) => (
          <button key={key} className={`hotel-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
            {label}{key === 'photos' ? ` (${images.length})` : key === 'rooms' ? ` (${rooms.length})` : ''}
          </button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {tab === 'info' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <strong>Hotel Information</strong>
            {!editInfo &&
              <button className="btn btn-secondary btn-sm" onClick={() => { setEditInfo(true); setInfoForm({
                name: hotel.name, city: hotel.city, state: hotel.state || '', address: hotel.address || '',
                description: hotel.description || '', amenities: (hotel.amenities || []).join(', '),
                star_rating: hotel.star_rating || 3,
                check_in_time: hotel.check_in_time || '12:00 PM',
                check_out_time: hotel.check_out_time || '11:00 AM',
                cancellation_policy: hotel.cancellation_policy || '',
                pets_allowed: hotel.pets_allowed || false,
                smoking_allowed: hotel.smoking_allowed || false,
                breakfast_included: hotel.breakfast_included || false,
                latitude: hotel.latitude || '',
                longitude: hotel.longitude || '',
              }) }}>
                <Pencil size={13} /> Edit
              </button>
            }
          </div>
          {editInfo ? (
            <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="label">Hotel Name</label>
                  <input className="input" required value={infoForm.name || ''} onChange={e => setInfoForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Star Rating</label>
                  <select className="input" value={infoForm.star_rating || 3} onChange={e => setInfoForm(p => ({ ...p, star_rating: e.target.value }))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">City</label>
                  <input className="input" required value={infoForm.city || ''} onChange={e => setInfoForm(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">State</label>
                  <input className="input" value={infoForm.state || ''} onChange={e => setInfoForm(p => ({ ...p, state: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Address</label>
                  <input className="input" value={infoForm.address || ''} onChange={e => setInfoForm(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Check-in Time</label>
                  <input className="input" placeholder="e.g. 12:00 PM" value={infoForm.check_in_time || ''} onChange={e => setInfoForm(p => ({ ...p, check_in_time: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Check-out Time</label>
                  <input className="input" placeholder="e.g. 11:00 AM" value={infoForm.check_out_time || ''} onChange={e => setInfoForm(p => ({ ...p, check_out_time: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Pets Allowed</label>
                  <select className="input" value={String(infoForm.pets_allowed)} onChange={e => setInfoForm(p => ({ ...p, pets_allowed: e.target.value === 'true' }))}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Smoking Allowed</label>
                  <select className="input" value={String(infoForm.smoking_allowed)} onChange={e => setInfoForm(p => ({ ...p, smoking_allowed: e.target.value === 'true' }))}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Breakfast Included</label>
                  <select className="input" value={String(infoForm.breakfast_included)} onChange={e => setInfoForm(p => ({ ...p, breakfast_included: e.target.value === 'true' }))}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Amenities <small style={{ color: 'var(--text-muted)' }}>(comma separated)</small></label>
                  <input className="input" value={infoForm.amenities || ''} onChange={e => setInfoForm(p => ({ ...p, amenities: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Latitude</label>
                  <input className="input" type="number" step="any" placeholder="e.g. 28.6139" value={infoForm.latitude || ''} onChange={e => setInfoForm(p => ({ ...p, latitude: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Longitude</label>
                  <input className="input" type="number" step="any" placeholder="e.g. 77.2090" value={infoForm.longitude || ''} onChange={e => setInfoForm(p => ({ ...p, longitude: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={infoForm.description || ''} onChange={e => setInfoForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Cancellation Policy</label>
                <textarea className="input" rows={2} value={infoForm.cancellation_policy || ''} onChange={e => setInfoForm(p => ({ ...p, cancellation_policy: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditInfo(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={savingInfo}>
                  {savingInfo ? <span className="spinner" /> : <><Save size={13} /> Save Changes</>}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {[
                ['Star Rating',    hotel.star_rating ? `${hotel.star_rating} ★` : '—'],
                ['City',           hotel.city || '—'],
                ['State',          hotel.state || '—'],
                ['Address',        hotel.address || '—'],
                ['Check-in Time',  hotel.check_in_time || '—'],
                ['Check-out Time', hotel.check_out_time || '—'],
                ['Breakfast',      hotel.breakfast_included ? 'Included' : 'Not included'],
                ['Pets Allowed',   hotel.pets_allowed ? 'Yes' : 'No'],
                ['Smoking',        hotel.smoking_allowed ? 'Allowed (designated areas)' : 'Not allowed'],
                ['Cancellation',   hotel.cancellation_policy || '—'],
                ['Amenities',      (hotel.amenities || []).join(', ') || '—'],
                ['Description',    hotel.description || '—'],
                ['Coordinates',    hotel.latitude && hotel.longitude ? `${hotel.latitude}, ${hotel.longitude}` : '—'],
                ['Owner',          `${hotel.owner_name || '—'} (${hotel.owner_email || '—'})`],
                ['Registered',     formatDate(hotel.created_at)],
              ].map(([l, v]) => (
                <div key={l} className="detail-row">
                  <div className="detail-label">{l}</div>
                  <div className="detail-value">{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PHOTOS TAB ── */}
      {tab === 'photos' && (
        <div className="card" style={{ padding: 24 }}>
          <strong style={{ display: 'block', marginBottom: 16 }}>Photos ({images.length})</strong>
          {images.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>No photos yet. Add one below.</p>
            : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                {images.map((url, i) => (
                  <div key={url} style={{ position: 'relative', width: 160 }}>
                    <img src={url} alt={`photo-${i}`}
                      style={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', display: 'block' }}
                      onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }} />
                    {i === 0 && <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>Cover</span>}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 6 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '3px 7px' }} disabled={i === 0 || savingImgs} onClick={() => moveImage(i, -1)}><ArrowLeftIcon size={12} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '3px 7px' }} disabled={i === images.length - 1 || savingImgs} onClick={() => moveImage(i, 1)}><ArrowRightIcon size={12} /></button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '3px 7px' }} disabled={savingImgs} onClick={() => removeImage(i)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: savingImgs ? 'not-allowed' : 'pointer' }}>
            <input type="file" accept="image/*" style={{ display: 'none' }} disabled={savingImgs}
              onChange={async (e) => {
                const file = e.target.files[0]; if (!file) return
                const preview = URL.createObjectURL(file)
                setImages(prev => [...prev, preview])
                setSavingImgs(true)
                try {
                  const serverUrl = await uploadImage(file)
                  URL.revokeObjectURL(preview)
                  setImages(prev => {
                    const updated = prev.map(u => u === preview ? serverUrl : u)
                    hotelsApi.update(id, {
                      name: hotel.name, description: hotel.description,
                      city: hotel.city, address: hotel.address,
                      amenities: hotel.amenities || [],
                      images: updated,
                    })
                    return updated
                  })
                  toast.success('Photo added', 'Hotel photo uploaded.')
                } catch (err) {
                  setImages(prev => prev.filter(u => u !== preview))
                  URL.revokeObjectURL(preview)
                  toast.error('Upload failed', err.message)
                }
                finally { setSavingImgs(false); e.target.value = '' }
              }} />
            <span className="btn btn-primary btn-sm">
              {savingImgs ? <span className="spinner" /> : <><ImagePlus size={14} /> Add Photo</>}
            </span>
          </label>
        </div>
      )}

      {/* ── ROOMS TAB ── */}
      {tab === 'rooms' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <strong>Rooms ({rooms.length})</strong>
            <button className="btn btn-primary btn-sm" onClick={() => { setShowRoomForm(true); setEditingRoom(null); setRoomForm(EMPTY_ROOM) }}>
              <Plus size={13} /> Add Room
            </button>
          </div>

          {showRoomForm && (
            <div className="modal-overlay" onClick={() => { setShowRoomForm(false); setEditingRoom(null) }}>
              <div className="modal" style={{ maxWidth: 520, width: '100%' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingRoom ? `Edit Room ${editingRoom.room_number}` : 'Add Room'}</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setShowRoomForm(false); setEditingRoom(null) }}><X size={15} /></button>
                </div>
                <form onSubmit={handleSaveRoom}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[['room_number','Room No.'],['room_type','Type (e.g. Deluxe)']].map(([f, l]) => (
                        <div key={f} className="form-group">
                          <label className="label">{l}</label>
                          <input className="input" required value={roomForm[f]} onChange={e => setRoomForm(r => ({ ...r, [f]: e.target.value }))} />
                        </div>
                      ))}
                      <div className="form-group">
                        <label className="label">Price / Night (₹)</label>
                        <input className="input" type="number" min="0" required value={roomForm.price_per_night} onChange={e => setRoomForm(r => ({ ...r, price_per_night: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="label">Capacity</label>
                        <input className="input" type="number" min="1" value={roomForm.capacity} onChange={e => setRoomForm(r => ({ ...r, capacity: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label">Amenities <small style={{ color: 'var(--text-muted)' }}>(comma separated)</small></label>
                      <input className="input" placeholder="AC, TV, Mini Bar" value={roomForm.amenities} onChange={e => setRoomForm(r => ({ ...r, amenities: e.target.value }))} />
                    </div>
                    {editingRoom && (
                      <div className="form-group">
                        <label className="label">Available</label>
                        <select className="input" value={String(roomForm.is_available)} onChange={e => setRoomForm(r => ({ ...r, is_available: e.target.value === 'true' }))}>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    )}
                    <div className="form-group">
                      <label className="label">Room Photos</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        {(roomForm.images || []).map((url, i) => (
                          <div key={url} style={{ position: 'relative' }}>
                            <img src={url} alt={`room-img-${i}`}
                              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
                              onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }} />
                            <button type="button"
                              onClick={() => setRoomForm(r => ({ ...r, images: r.images.filter((_, idx) => idx !== i) }))}
                              style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 11, lineHeight: '18px', textAlign: 'center', padding: 0 }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: uploadingRoomImg ? 'not-allowed' : 'pointer' }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingRoomImg}
                          onChange={async (e) => {
                            const file = e.target.files[0]; if (!file) return
                            const preview = URL.createObjectURL(file)
                            setRoomForm(r => ({ ...r, images: [...(r.images || []), preview] }))
                            setUploadingRoomImg(true)
                            try {
                              const url = await uploadImage(file)
                              setRoomForm(r => ({ ...r, images: r.images.map(u => u === preview ? url : u) }))
                              URL.revokeObjectURL(preview)
                            } catch (err) {
                              setRoomForm(r => ({ ...r, images: r.images.filter(u => u !== preview) }))
                              URL.revokeObjectURL(preview)
                              toast.error('Upload failed', err.message)
                            }
                            finally { setUploadingRoomImg(false); e.target.value = '' }
                          }} />
                        <span className="btn btn-secondary btn-sm">
                          {uploadingRoomImg ? <span className="spinner" /> : <><ImagePlus size={13} /> Add Photo</>}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowRoomForm(false); setEditingRoom(null) }}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={savingRoom || uploadingRoomImg}>
                      {savingRoom ? <span className="spinner" /> : editingRoom ? 'Update Room' : 'Save Room'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {rooms.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No rooms yet.</p>
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {rooms.map(r => (
                  <div key={r.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {(r.images && r.images.length > 0) && (
                      <img src={r.images[0]} alt={r.room_number}
                        style={{ width: '100%', height: 120, objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none' }} />
                    )}
                    <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>Room {r.room_number}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>{r.room_type}</div>
                      </div>
                      <span className={`badge ${r.is_available ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>{r.is_available ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{fmt(r.price_per_night)}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/night</span></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>Capacity: {r.capacity} · {(r.amenities || []).slice(0, 3).join(', ') || 'No amenities'}</div>
                    {r.images && r.images.length > 1 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{r.images.length} photos</div>}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => startEditRoom(r)}><Pencil size={12} /> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDelRoom(r)}><Trash2 size={12} /></button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* ── WHITE LABEL TAB ── */}
      {tab === 'whitelabel' && (
        <div className="card" style={{ padding: 24 }}>
          <strong style={{ display: 'block', marginBottom: 4 }}>Landing Page & White Label</strong>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Configure the hotel's public landing page branding. Once saved, the hotel partner's landing page will reflect these settings.
          </p>
          <form onSubmit={saveWhiteLabel} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="label">Enable Landing Page</label>
                <select className="input" value={String(wlForm.landing_page_enabled)}
                  onChange={e => setWlForm(p => ({ ...p, landing_page_enabled: e.target.value === 'true' }))}>
                  <option value="false">Disabled</option>
                  <option value="true">Enabled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Theme</label>
                <select className="input" value={wlForm.theme || 'emerald'}
                  onChange={e => setWlForm(p => ({ ...p, theme: e.target.value }))}>
                  <option value="emerald">Emerald (Green)</option>
                  <option value="ocean">Ocean (Blue)</option>
                  <option value="rose">Rose (Pink)</option>
                  <option value="amber">Amber (Gold)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Brand Name</label>
                <input className="input" value={wlForm.brand_name || ''}
                  onChange={e => setWlForm(p => ({ ...p, brand_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Brand Tagline</label>
                <input className="input" placeholder="e.g. Luxury Redefined" value={wlForm.brand_tagline || ''}
                  onChange={e => setWlForm(p => ({ ...p, brand_tagline: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Logo Text (2–3 letters)</label>
                <input className="input" maxLength={3} value={wlForm.logo_text || ''}
                  onChange={e => setWlForm(p => ({ ...p, logo_text: e.target.value.toUpperCase() }))} />
              </div>
              <div className="form-group">
                <label className="label">Logo URL (optional)</label>
                <input className="input" placeholder="https://..." value={wlForm.logo_url || ''}
                  onChange={e => setWlForm(p => ({ ...p, logo_url: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Cover Image URL</label>
                <input className="input" placeholder="https://..." value={wlForm.cover_image || ''}
                  onChange={e => setWlForm(p => ({ ...p, cover_image: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Support Email</label>
                <input className="input" type="email" value={wlForm.support_email || ''}
                  onChange={e => setWlForm(p => ({ ...p, support_email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Support Phone</label>
                <input className="input" value={wlForm.support_phone || ''}
                  onChange={e => setWlForm(p => ({ ...p, support_phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={savingWl}>
                {savingWl ? <span className="spinner" /> : 'Save White Label Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reject modal */}
      {rejectMode && (
        <div className="modal-overlay" onClick={() => setRejectMode(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Reject Hotel</h3><button className="btn btn-ghost btn-sm" onClick={() => setRejectMode(false)}>✕</button></div>
            <div className="modal-body">
              <textarea className="input" rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setRejectMode(false)}>Cancel</button>
              <button className="btn btn-danger btn-sm" disabled={acting} onClick={() => updateStatus('rejected')}>
                {acting ? <span className="spinner" /> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmApprove}
        onClose={() => setConfirmApprove(false)}
        onConfirm={() => updateStatus(confirmApprove === 'relist' ? 'pending' : 'approved')}
        loading={acting}
        variant="info"
        title={confirmApprove === 'relist' ? 'Re-list Hotel?' : 'Approve Hotel?'}
        message={confirmApprove === 'relist'
          ? `${hotel.name} will be moved back to Pending so the owner can resubmit for review.`
          : `${hotel.name} will be published and visible to customers.`
        }
        confirmLabel={confirmApprove === 'relist' ? 'Yes, Re-list' : 'Yes, Approve'}
      />

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={acting}
        variant="danger"
        title="Delete Hotel?"
        message={`${hotel.name} and all its rooms will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Permanently"
      />

      <ConfirmModal
        open={confirmToggleOpen}
        onClose={() => setConfirmToggleOpen(false)}
        onConfirm={handleToggleOpen}
        loading={acting}
        variant={hotel.is_open !== false ? 'warning' : 'info'}
        title={hotel.is_open !== false ? 'Close Hotel?' : 'Open Hotel?'}
        message={hotel.is_open !== false
          ? `${hotel.name} will stop accepting new bookings. Existing bookings are unaffected.`
          : `${hotel.name} will be visible and open for new bookings.`
        }
        confirmLabel={hotel.is_open !== false ? 'Close Hotel' : 'Open Hotel'}
      />

      <ConfirmModal
        open={!!delRoom}
        onClose={() => setDelRoom(null)}
        onConfirm={() => handleDeleteRoom(delRoom)}
        variant="danger"
        title="Delete Room?"
        message={`Room ${delRoom?.room_number} will be permanently deleted.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
