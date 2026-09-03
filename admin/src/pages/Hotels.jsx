import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { hotelsApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { formatDate } from '../lib/format'
import { Search, Eye, Check, X, Plus, Pencil, Trash2, ImagePlus, ArrowLeft, ArrowRight, Save, DoorOpen, DoorClosed } from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_BADGE = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-error', suspended: 'badge-neutral' }
const OPEN_BADGE   = { true: 'badge-success', false: 'badge-error' }
const EMPTY_HOTEL  = { name: '', city: '', address: '', description: '', amenities: '', images: '', status: 'approved' }
const EMPTY_ROOM   = { room_number: '', room_type: '', price_per_night: '', capacity: 2, amenities: '' }
const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—'

export default function Hotels() {
  const { status } = useParams()
  const navigate   = useNavigate()
  const toast      = useToast()

  const [search, setSearch]                 = useState('')
  const [selected, setSelected]             = useState(null)
  const [rooms, setRooms]                   = useState([])
  const [roomsLoading, setRoomsLoading]     = useState(false)
  const [rejectMode, setRejectMode]         = useState(null)
  const [rejectReason, setRejectReason]     = useState('')
  const [confirmApprove, setConfirmApprove] = useState(null)
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(null)
  const [confirmDelete, setConfirmDelete]         = useState(null)
  const [acting, setActing]                 = useState(false)
  const [showAdd, setShowAdd]               = useState(false)
  const [hotelForm, setHotelForm]           = useState(EMPTY_HOTEL)
  const [adding, setAdding]                 = useState(false)
  const [roomForm, setRoomForm]             = useState(EMPTY_ROOM)
  const [editingRoom, setEditingRoom]       = useState(null)
  const [savingRoom, setSavingRoom]         = useState(false)
  const [confirmDeleteRoom, setConfirmDeleteRoom] = useState(null)
  const [showRoomForm, setShowRoomForm]     = useState(false)
  const [editInfo, setEditInfo]             = useState(false)
  const [infoForm, setInfoForm]             = useState({})
  const [savingInfo, setSavingInfo]         = useState(false)
  const [newImageUrl, setNewImageUrl]       = useState('')
  const [hotelImages, setHotelImages]       = useState([])
  const [savingImages, setSavingImages]     = useState(false)

  const { data, loading, error, refetch } = useFetch(() => hotelsApi.list(1, 100))
  const allRows = data?.data ?? []

  const rows = allRows
    .filter(h => !status || h.status === status)
    .filter(h =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.city?.toLowerCase().includes(search.toLowerCase())
    )

  const openHotel = async (h) => {
    setSelected(h)
    setHotelImages(h.images || [])
    setRoomsLoading(true)
    setShowRoomForm(false)
    setEditingRoom(null)
    setRoomForm(EMPTY_ROOM)
    setEditInfo(false)
    setNewImageUrl('')
    try {
      const d = await hotelsApi.getRooms(h.id)
      setRooms(d)
    } catch { setRooms([]) }
    finally { setRoomsLoading(false) }
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    setSavingInfo(true)
    try {
      const updated = await hotelsApi.update(selected.id, {
        ...infoForm,
        amenities: typeof infoForm.amenities === 'string'
          ? infoForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
          : infoForm.amenities,
        images: hotelImages,
      })
      setSelected(updated)
      setHotelImages(updated.images || [])
      setEditInfo(false)
      toast.success('Saved', 'Hotel info updated.')
      refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingInfo(false) }
  }

  const saveImages = async (imgs) => {
    setSavingImages(true)
    try {
      const updated = await hotelsApi.update(selected.id, {
        name: selected.name, description: selected.description,
        city: selected.city, address: selected.address,
        amenities: selected.amenities || [], images: imgs,
      })
      setSelected(updated)
      setHotelImages(updated.images || [])
      toast.success('Photos saved', 'Hotel photos updated.')
      refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingImages(false) }
  }

  const addImage = () => {
    const url = newImageUrl.trim()
    if (!url) return
    const imgs = [...hotelImages, url]
    setHotelImages(imgs)
    setNewImageUrl('')
    saveImages(imgs)
  }

  const removeImage = (i) => {
    const imgs = hotelImages.filter((_, idx) => idx !== i)
    setHotelImages(imgs)
    saveImages(imgs)
  }

  const moveImage = (i, dir) => {
    const imgs = [...hotelImages]
    const j = i + dir
    if (j < 0 || j >= imgs.length) return
    ;[imgs[i], imgs[j]] = [imgs[j], imgs[i]]
    setHotelImages(imgs)
    saveImages(imgs)
  }

  const updateStatus = async (h, newStatus) => {
    setActing(true)
    try {
      await hotelsApi.updateStatus(h.id, newStatus)
      const labels = { approved: 'Hotel Approved', rejected: 'Hotel Rejected', pending: 'Hotel Re-listed' }
      const variants = { approved: 'success', rejected: 'error', pending: 'info' }
      toast[variants[newStatus] || 'success'](labels[newStatus] || newStatus, `${h.name} status updated.`)
      refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally {
      setActing(false); setConfirmApprove(null)
      setRejectMode(null); setSelected(null); setRejectReason('')
    }
  }

  const handleToggleOpen = async (h) => {
    setActing(true)
    try {
      const res = await hotelsApi.toggleOpen(h.id)
      toast[res.is_open ? 'success' : 'warning'](
        res.is_open ? 'Hotel Opened' : 'Hotel Closed',
        `${h.name} is now ${res.is_open ? 'open and accepting bookings' : 'closed for new bookings'}.`
      )
      refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setActing(false); setConfirmToggleOpen(null) }
  }

  const handleDeleteHotel = async (h) => {
    setActing(true)
    try {
      await hotelsApi.deleteHotel(h.id)
      toast.success('Deleted', `${h.name} has been permanently deleted.`)
      refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setActing(false); setConfirmDelete(null) }
  }

  const handleAddHotel = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await hotelsApi.create({
        ...hotelForm,
        amenities: hotelForm.amenities.split(',').map(s => s.trim()).filter(Boolean),
        images:    hotelForm.images.split(',').map(s => s.trim()).filter(Boolean),
      })
      toast.success('Hotel Added', `${hotelForm.name} added successfully.`)
      setShowAdd(false); setHotelForm(EMPTY_HOTEL); refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setAdding(false) }
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    setSavingRoom(true)
    const payload = {
      ...roomForm,
      price_per_night: Number(roomForm.price_per_night),
      capacity:        Number(roomForm.capacity),
      amenities: typeof roomForm.amenities === 'string'
        ? roomForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
        : roomForm.amenities,
    }
    try {
      if (editingRoom) {
        const updated = await hotelsApi.updateRoom(editingRoom.id, payload)
        setRooms(rs => rs.map(r => r.id === updated.id ? updated : r))
        toast.success('Room Updated', `Room ${updated.room_number} updated.`)
      } else {
        const created = await hotelsApi.addRoom(selected.id, payload)
        setRooms(rs => [...rs, created])
        toast.success('Room Added', `Room ${created.room_number} added.`)
      }
      setShowRoomForm(false); setEditingRoom(null); setRoomForm(EMPTY_ROOM); refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setSavingRoom(false) }
  }

  const handleDeleteRoom = async (room) => {
    try {
      await hotelsApi.deleteRoom(room.id)
      setRooms(rs => rs.filter(r => r.id !== room.id))
      toast.success('Deleted', `Room ${room.room_number} deleted.`)
      refetch()
    } catch (err) { toast.error('Error', err.message) }
    finally { setConfirmDeleteRoom(null) }
  }

  const startEditRoom = (room) => {
    setEditingRoom(room)
    setRoomForm({
      room_number:     room.room_number || '',
      room_type:       room.room_type || '',
      price_per_night: room.price_per_night || '',
      capacity:        room.capacity || 2,
      amenities:       (room.amenities || []).join(', '),
      is_available:    room.is_available ?? true,
    })
    setShowRoomForm(true)
  }

  const tabs = [
    { label: 'All Hotels', value: undefined, path: '/hotels' },
    { label: 'Pending',    value: 'pending',  path: '/hotels/pending' },
    { label: 'Approved',   value: 'approved', path: '/hotels/approved' },
    { label: 'Rejected',   value: 'rejected', path: '/hotels/rejected' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hotels</div>
          <div className="page-subtitle">{rows.length} hotels</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add Hotel
        </button>
      </div>

      <div className="hotel-tabs">
        {tabs.map(t => (
          <button key={t.path} className={`hotel-tab${status === t.value ? ' active' : ''}`} onClick={() => navigate(t.path)}>
            {t.label}
            <span className="hotel-tab-count">{allRows.filter(h => t.value ? h.status === t.value : true).length}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Hotel</th><th>City</th><th>Owner</th><th>Price From</th><th>Status</th><th>Open</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : error
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotels found</td></tr>
                    : rows.map(h => (
                      <tr key={h.id}>
                        <td style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate(`/hotels/detail/${h.id}`)}>{h.name}</td>
                        <td>{h.city || '—'}</td>
                        <td>{h.owner_name || '—'}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{fmt(h.price_from)}</td>
                        <td><span className={`badge ${STATUS_BADGE[h.status] || 'badge-neutral'}`}>{h.status}</span></td>
                        <td>
                          {h.status === 'approved'
                            ? <span className={`badge ${h.is_open !== false ? 'badge-success' : 'badge-error'}`}>
                                {h.is_open !== false ? 'Open' : 'Closed'}
                              </span>
                            : <span className="badge badge-neutral">—</span>
                          }
                        </td>
                        <td>{formatDate(h.created_at)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/hotels/detail/${h.id}`)}><Eye size={14} /></button>
                            {/* pending: Approve + Reject */}
                            {h.status === 'pending' && <>
                              <button className="btn btn-success btn-sm" onClick={() => setConfirmApprove(h)}><Check size={12} /> Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => { setRejectMode(h); setRejectReason('') }}><X size={12} /> Reject</button>
                            </>}
                            {/* rejected: Re-list only */}
                            {h.status === 'rejected' && (
                              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmApprove({ ...h, _relist: true })}>
                                ↩ Re-list
                              </button>
                            )}
                            {/* approved: Close/Open + Delete */}
                            {h.status === 'approved' && <>
                              <button
                                className={`btn btn-sm ${h.is_open !== false ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => setConfirmToggleOpen(h)}
                              >
                                {h.is_open !== false ? <><DoorClosed size={12} /> Close</> : <><DoorOpen size={12} /> Open</>}
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(h)}><Trash2 size={12} /></button>
                            </> }
                          </div>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 660, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">

              {/* ── INFO SECTION ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <strong style={{ fontSize: '0.9rem' }}>Hotel Info</strong>
                {!editInfo
                  ? <button className="btn btn-ghost btn-sm" onClick={() => { setEditInfo(true); setInfoForm({ name: selected.name, city: selected.city, address: selected.address || '', description: selected.description || '', amenities: (selected.amenities || []).join(', ') }) }}><Pencil size={13} /> Edit</button>
                  : null
                }
              </div>

              {editInfo ? (
                <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {[['name','Hotel Name',true],['city','City',true],['address','Address',false],['description','Description',false]].map(([f,l,req]) => (
                    <div key={f} className="form-group">
                      <label className="label">{l}</label>
                      <input className="input" required={req} value={infoForm[f] || ''} onChange={e => setInfoForm(p => ({ ...p, [f]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="label">Amenities <small style={{ color: 'var(--text-muted)' }}>(comma separated)</small></label>
                    <input className="input" value={infoForm.amenities || ''} onChange={e => setInfoForm(p => ({ ...p, amenities: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditInfo(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={savingInfo}>
                      {savingInfo ? <span className="spinner" /> : <><Save size={13} /> Save Info</>}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {[
                    ['Status',    <span className={`badge ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>],
                    ['Owner',     `${selected.owner_name || '—'} (${selected.owner_email || '—'})`],
                    ['City',      selected.city || '—'],
                    ['Address',   selected.address || '—'],
                    ['Amenities', (selected.amenities || []).join(', ') || '—'],
                    ['Registered',formatDate(selected.created_at)],
                  ].map(([l, v]) => (
                    <div key={l} className="detail-row"><div className="detail-label">{l}</div><div className="detail-value">{v}</div></div>
                  ))}
                </>
              )}

              {/* ── PHOTOS SECTION ── */}
              <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <strong style={{ fontSize: '0.9rem' }}>Photos ({hotelImages.length})</strong>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {hotelImages.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: 110, flexShrink: 0 }}>
                      <img src={url} alt={`photo-${i}`} style={{ width: 110, height: 75, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                        onError={e => { e.target.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' }} />
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '2px 5px' }} onClick={() => moveImage(i, -1)} disabled={i === 0 || savingImages}><ArrowLeft size={11} /></button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '2px 5px' }} onClick={() => moveImage(i, 1)} disabled={i === hotelImages.length - 1 || savingImages}><ArrowRight size={11} /></button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '2px 5px' }} onClick={() => removeImage(i)} disabled={savingImages}><Trash2 size={11} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input className="input" placeholder="Paste image URL and click Add" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} style={{ flex: 1 }} />
                  <button className="btn btn-primary btn-sm" onClick={addImage} disabled={!newImageUrl.trim() || savingImages}>
                    {savingImages ? <span className="spinner" /> : <><ImagePlus size={13} /> Add</>}
                  </button>
                </div>
              </div>

              {/* ── ROOMS SECTION ── */}
              <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <strong style={{ fontSize: '0.9rem' }}>Rooms ({rooms.length})</strong>
                  <button className="btn btn-primary btn-sm" onClick={() => { setShowRoomForm(true); setEditingRoom(null); setRoomForm(EMPTY_ROOM) }}>
                    <Plus size={13} /> Add Room
                  </button>
                </div>

                {showRoomForm && (
                  <form onSubmit={handleSaveRoom} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowRoomForm(false); setEditingRoom(null) }}>Cancel</button>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={savingRoom}>
                        {savingRoom ? <span className="spinner" /> : editingRoom ? 'Update Room' : 'Save Room'}
                      </button>
                    </div>
                  </form>
                )}

                {roomsLoading
                  ? <div style={{ textAlign: 'center' }}><span className="spinner" /></div>
                  : rooms.length === 0
                    ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No rooms yet. Add one above.</p>
                    : (
                      <table className="table" style={{ fontSize: '0.85rem' }}>
                        <thead><tr><th>Room No.</th><th>Type</th><th>Price/Night</th><th>Capacity</th><th>Available</th><th></th></tr></thead>
                        <tbody>
                          {rooms.map(r => (
                            <tr key={r.id}>
                              <td>{r.room_number}</td>
                              <td>{r.room_type}</td>
                              <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{fmt(r.price_per_night)}</td>
                              <td>{r.capacity}</td>
                              <td><span className={`badge ${r.is_available ? 'badge-success' : 'badge-neutral'}`}>{r.is_available ? 'Yes' : 'No'}</span></td>
                              <td>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button className="btn btn-ghost btn-sm" onClick={() => startEditRoom(r)}><Pencil size={13} /></button>
                                  <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteRoom(r)}><Trash2 size={13} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                }
              </div>
            </div>

            {selected.status === 'pending' && (
              <div className="modal-footer">
                <button className="btn btn-danger btn-sm" onClick={() => { setRejectMode(selected); setSelected(null) }}>Reject</button>
                <button className="btn btn-success btn-sm" onClick={() => { setConfirmApprove(selected); setSelected(null) }}>Approve</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Hotel Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Hotel</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <form onSubmit={handleAddHotel}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['name','Hotel Name',true],['city','City',true],['address','Address',false],['description','Description',false]].map(([field, label, required]) => (
                  <div key={field} className="form-group">
                    <label className="label">{label}</label>
                    <input className="input" required={required} value={hotelForm[field]} onChange={e => setHotelForm(f => ({ ...f, [field]: e.target.value }))} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="label">Amenities <small style={{ color: 'var(--text-muted)' }}>(comma separated)</small></label>
                  <input className="input" placeholder="WiFi, Pool, Gym" value={hotelForm.amenities} onChange={e => setHotelForm(f => ({ ...f, amenities: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Image URLs <small style={{ color: 'var(--text-muted)' }}>(comma separated)</small></label>
                  <input className="input" placeholder="https://..." value={hotelForm.images} onChange={e => setHotelForm(f => ({ ...f, images: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select className="input" value={hotelForm.status} onChange={e => setHotelForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="approved">Approved (visible on site)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={adding}>
                  {adding ? <span className="spinner" /> : 'Add Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectMode && (
        <div className="modal-overlay" onClick={() => setRejectMode(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Reject Hotel</h3><button className="btn btn-ghost btn-sm" onClick={() => setRejectMode(null)}>✕</button></div>
            <div className="modal-body">
              <p style={{ marginBottom: 12, fontSize: '0.85rem' }}>Reason for rejecting <strong>{rejectMode.name}</strong>:</p>
              <textarea className="input" rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Insufficient documentation..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setRejectMode(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" disabled={acting} onClick={() => updateStatus(rejectMode, 'rejected')}>
                {acting ? <span className="spinner" /> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmApprove}
        onClose={() => setConfirmApprove(null)}
        onConfirm={() => updateStatus(confirmApprove, confirmApprove?._relist ? 'pending' : 'approved')}
        loading={acting}
        variant="info"
        title={confirmApprove?._relist ? 'Re-list Hotel?' : 'Approve Hotel?'}
        message={confirmApprove?._relist
          ? `${confirmApprove?.name} will be moved back to Pending so the owner can resubmit for review.`
          : `${confirmApprove?.name} will be published and visible to customers.`
        }
        confirmLabel={confirmApprove?._relist ? 'Yes, Re-list' : 'Yes, Approve'}
      />

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDeleteHotel(confirmDelete)}
        loading={acting}
        variant="danger"
        title="Delete Hotel?"
        message={`${confirmDelete?.name} and all its rooms will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Permanently"
      />

      <ConfirmModal
        open={!!confirmToggleOpen}
        onClose={() => setConfirmToggleOpen(null)}
        onConfirm={() => handleToggleOpen(confirmToggleOpen)}
        loading={acting}
        variant={confirmToggleOpen?.is_open !== false ? 'warning' : 'info'}
        title={confirmToggleOpen?.is_open !== false ? 'Close Hotel?' : 'Open Hotel?'}
        message={confirmToggleOpen?.is_open !== false
          ? `${confirmToggleOpen?.name} will stop accepting new bookings. Existing bookings are unaffected.`
          : `${confirmToggleOpen?.name} will be visible and open for new bookings.`
        }
        confirmLabel={confirmToggleOpen?.is_open !== false ? 'Close Hotel' : 'Open Hotel'}
      />

      <ConfirmModal
        open={!!confirmDeleteRoom}
        onClose={() => setConfirmDeleteRoom(null)}
        onConfirm={() => handleDeleteRoom(confirmDeleteRoom)}
        variant="danger"
        title="Delete Room?"
        message={`Room ${confirmDeleteRoom?.room_number} will be permanently deleted.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
