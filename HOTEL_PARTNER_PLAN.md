# Hotel Partner — White-Label Landing Page & Booking Sync Plan

## Overview

Each registered hotel partner gets:
1. **Their own public landing page** (white-labelled, clean fresh design) where guests can browse and book.
2. **Their own partner admin panel** (`/dashboard/*`) to manage bookings, rooms, earnings.
3. **All bookings** made via the hotel's landing page appear in **both** the partner's admin panel **and** the main HotelZilla super-admin portal.

---

## Part 1 — Clean & Rebuild the Public Frontend (hotel-partner)

### What to Remove / Replace
- Delete all files inside `hotel-partner/src/pages/public/sections/`
- Delete `PublicLanding.jsx`, `PublicHotelListing.jsx`, `PublicHotelDetail.jsx`, `PublicBooking.jsx`
- Delete `hotel-partner/src/components/PublicHeader.jsx` and `PublicFooter.jsx`
- Remove old `App.css` / `index.css` styles tied to the old design

### New Clean Design — Files to Create

```
hotel-partner/src/
├── pages/public/
│   ├── HotelLanding.jsx          ← per-hotel landing page (hero, rooms, gallery, CTA)
│   ├── HotelRooms.jsx            ← room listing for this hotel
│   ├── BookingPage.jsx           ← booking form (dates, guests, room selection)
│   └── BookingConfirmation.jsx   ← success page after booking
├── components/
│   ├── LandingHeader.jsx         ← minimal header with hotel logo + brand name
│   └── LandingFooter.jsx         ← minimal footer with contact + links
```

### Design Principles (Fresh Look)
- **Tailwind CSS** only — no custom CSS classes from old design
- Full-width hero with hotel cover image, hotel name, tagline, and a "Book Now" CTA button
- Sticky minimal header: hotel logo left, "Book Now" button right
- Room cards: image, room type, price/night, amenities chips, "Select" button
- Booking form: date picker, guest count, room selector, total price preview, confirm button
- Color scheme driven by `WHITE_LABEL.theme` from `lib/whiteLabel.js` (already wired to CSS vars)
- Mobile-first responsive layout

### Route Changes in `App.jsx`

```jsx
// Replace old public routes with:
<Route path="/"           element={<HotelLanding />} />
<Route path="/rooms"      element={<HotelRooms />} />
<Route path="/book"       element={<BookingPage />} />
<Route path="/book/done"  element={<BookingConfirmation />} />
```

---

## Part 2 — Per-Hotel Identity (White-Label Config from DB)

### Problem
Currently `WHITE_LABEL` in `lib/whiteLabel.js` is **hardcoded mock data**. It needs to be loaded dynamically per hotel.

### Solution — Load Config from API on App Start

**Backend** — add one public endpoint in `hotel-service`:
```
GET /public/hotel-config/:partner_id
```
Returns: `{ brand_name, brand_tagline, logo_url, theme, support_email, support_phone, cover_image }`  
No auth required — this is public data.

**Frontend** — in `App.jsx`, fetch config on mount:
```js
// On app load, read partner_id from env or subdomain
const PARTNER_ID = import.meta.env.VITE_PARTNER_ID  // set per deployment

useEffect(() => {
  fetch(`/api/public/hotel-config/${PARTNER_ID}`)
    .then(r => r.json())
    .then(config => {
      applyWhiteLabel(config)
      setConfig(config)
    })
}, [])
```

**Each hotel's deployment** sets `VITE_PARTNER_ID` in their `.env`:
```
VITE_PARTNER_ID=hotel_123
```

---

## Part 3 — Booking Flow (Landing Page → DB → Both Admin Panels)

### How a Booking is Created from the Hotel Landing Page

```
Guest fills BookingPage form
        ↓
POST /api/bookings  (via gateway → user-service or hotel-service)
Body: { hotel_id, room_id, checkin_date, checkout_date, guests, customer_name, customer_phone, customer_email }
        ↓
Booking saved to `bookings` table in Supabase/Postgres
with hotel_id, owner_id, status = 'pending'
        ↓
Response: { booking_id, booking_reference, amount }
        ↓
Redirect to /book/done?ref=BOOKING_REF
```

### Key DB Fields Required on `bookings` table
| Column | Purpose |
|---|---|
| `hotel_id` | Links booking to specific hotel |
| `owner_id` | Links booking to hotel partner (for partner panel filter) |
| `source` | `'landing_page'` or `'main_site'` — for analytics |
| `status` | `pending / confirmed / checked_in / checked_out / cancelled` |

---

## Part 4 — Partner Admin Panel Shows Landing Page Bookings

### Current State
`hotel-partner/src/pages/Bookings.jsx` calls `bookingsApi.list()` which hits:
```
GET /api/bookings  (hotel-service, auth required)
```
The hotel-service already filters by `owner_id` from the JWT token.

### What This Means
- Bookings made via the landing page (with correct `hotel_id` + `owner_id`) will **automatically appear** in the partner's Bookings panel — no extra work needed on the frontend.
- The partner can Confirm / Check-in / Check-out / Cancel from their dashboard.

### One Change Needed — `source` badge in Bookings table
In `Bookings.jsx`, add a "Source" column to show where the booking came from:
```jsx
<td>
  <span className={`badge ${b.source === 'landing_page' ? 'badge-info' : 'badge-neutral'}`}>
    {b.source === 'landing_page' ? 'Landing Page' : 'Main Site'}
  </span>
</td>
```

---

## Part 5 — Main Super-Admin Portal Shows All Bookings

### Current State
`admin/src/pages/Bookings.jsx` calls `bookingsApi.list()` → `admin-service` → fetches **all bookings** across all hotels (no owner filter).

### What This Means
- Landing page bookings will **automatically appear** in the super-admin portal too — because they share the same `bookings` table.
- No backend changes needed.

### Optional Enhancement — Filter by Source in Admin Portal
Add a "Source" filter dropdown in `admin/src/pages/Bookings.jsx`:
```jsx
<select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
  <option value="">All Sources</option>
  <option value="landing_page">Landing Page</option>
  <option value="main_site">Main Site</option>
</select>
```

---

## Part 6 — Registered Hotel Details in Admin Portal

### Where Hotel Registration Happens
- Hotel partners register via `Main_frontend/src/pages/RegisterHotel.jsx`
- Data saved to `hotels` table with `owner_id`, `status = 'pending'`

### Admin Portal — Hotel Detail View
`admin/src/pages/HotelDetail.jsx` already exists. Enhance it to show:
- Hotel registration info (name, address, city, contact)
- Owner details (name, email, phone)
- Approval status with Approve / Reject buttons
- List of rooms
- Booking stats for this hotel (total bookings, revenue, avg rating)
- Landing page status (enabled/disabled toggle)

### New API endpoint needed in `admin-service`:
```
GET /admin/hotels/:id/full-detail
```
Returns hotel + owner + rooms + booking summary in one response.

---

## Part 7 — Deployment Model (One App, Many Hotels)

### Option A — Single Deployment, Path-Based (Simpler)
```
hotelzilla.com/hotel/grand-palace/        ← landing page
hotelzilla.com/hotel/grand-palace/book    ← booking
hotelzilla.com/hotel/grand-palace/dashboard ← partner panel
```
- `VITE_PARTNER_ID` not needed — read `:hotelSlug` from URL params
- One Vite build, all hotels share it

### Option B — Per-Hotel Subdomain (White-Label, Recommended)
```
grandpalace.hotelzilla.com/     ← landing page
grandpalace.hotelzilla.com/book ← booking
grandpalace.hotelzilla.com/dashboard ← partner panel
```
- Each hotel sets `VITE_PARTNER_ID` in their deployment env
- Wildcard DNS `*.hotelzilla.com` → same server
- Server reads subdomain → serves same React app with different `PARTNER_ID`

---

## Implementation Order

| Step | Task | Files |
|---|---|---|
| 1 | Delete old public pages & sections | `pages/public/*`, `components/PublicHeader.jsx`, `PublicFooter.jsx` |
| 2 | Create `LandingHeader.jsx` + `LandingFooter.jsx` | `components/` |
| 3 | Create `HotelLanding.jsx` (hero + rooms preview) | `pages/public/` |
| 4 | Create `BookingPage.jsx` (form + price calc) | `pages/public/` |
| 5 | Create `BookingConfirmation.jsx` | `pages/public/` |
| 6 | Update `App.jsx` routes | `App.jsx` |
| 7 | Add `GET /public/hotel-config/:id` endpoint | `hotel-service/src/routes/` |
| 8 | Wire dynamic white-label config fetch in `App.jsx` | `App.jsx` |
| 9 | Add `source` column to bookings table + API | `db/init.sql`, `hotel-service` |
| 10 | Add `source` badge in partner `Bookings.jsx` | `hotel-partner/src/pages/Bookings.jsx` |
| 11 | Add source filter in admin `Bookings.jsx` | `admin/src/pages/Bookings.jsx` |
| 12 | Enhance `admin/src/pages/HotelDetail.jsx` | `admin/src/pages/HotelDetail.jsx` |

---

## Summary

```
Guest visits hotel landing page
        ↓
Sees hotel-branded page (logo, theme, rooms)
        ↓
Books a room → POST /api/bookings (hotel_id + owner_id saved)
        ↓
Booking appears in:
  ✅ Partner Admin Panel  (/dashboard/bookings) — filtered by owner_id
  ✅ Super Admin Portal   (admin/bookings)       — all bookings visible
        ↓
Partner can Confirm / Check-in / Check-out from their panel
Super Admin can see all hotels, all bookings, approve/reject hotels
```
