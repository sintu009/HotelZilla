const router = require("express").Router();
const db = require("../config/db");

// POST /api/public/bookings — create a booking from a hotel landing page (no auth)
router.post("/bookings", async (req, res, next) => {
  const { hotel_id, room_id, checkin_date, checkout_date, guests, customer_name, customer_email, customer_phone, source } = req.body;

  if (!hotel_id || !room_id || !checkin_date || !checkout_date || !customer_name || !customer_email || !customer_phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { rows: roomRows } = await db.query(
      `SELECT r.price_per_night, h.owner_id FROM rooms r JOIN hotels h ON r.hotel_id = h.id WHERE r.id = $1 AND r.hotel_id = $2`,
      [room_id, hotel_id]
    );
    if (!roomRows[0]) return res.status(404).json({ message: "Room not found" });

    const { price_per_night, owner_id } = roomRows[0];
    const nights = Math.max(1, Math.ceil((new Date(checkout_date) - new Date(checkin_date)) / 86400000));
    const amount = price_per_night * nights;
    const booking_reference = "BK" + Date.now().toString(36).toUpperCase();

    const { rows } = await db.query(
      `INSERT INTO bookings
        (hotel_id, room_id, owner_id, checkin_date, checkout_date, guests, amount,
         customer_name, customer_email, customer_phone, source, booking_reference, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending')
       RETURNING id, booking_reference, amount, status`,
      [hotel_id, room_id, owner_id, checkin_date, checkout_date, guests || 1, amount,
       customer_name, customer_email, customer_phone, source || "landing_page", booking_reference]
    );

    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/public/hotel-config/:hotel_id — public brand config for landing page
router.get("/hotel-config/:hotel_id", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, brand_name, brand_tagline, logo_text, logo_url, theme,
              cover_image, contact_email AS support_email, contact_phone AS support_phone,
              star_rating, description, amenities, city, address, landing_page_enabled,
              hero_heading, hero_subheading,
              feature1_title, feature1_desc, feature2_title, feature2_desc,
              feature3_title, feature3_desc, feature4_title, feature4_desc,
              cta_heading, cta_subheading, footer_tagline
       FROM hotels
       WHERE id = $1 AND status = 'approved' AND landing_page_enabled = true
       LIMIT 1`,
      [req.params.hotel_id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Hotel not found or landing page not enabled" });
    const h = rows[0];
    res.json({
      ...h,
      brand_name:    h.brand_name    || h.name,
      brand_tagline: h.brand_tagline || "Partner Portal",
      logo_text:     h.logo_text     || (h.name || "").slice(0, 2).toUpperCase(),
      theme:         h.theme         || "emerald",
    });
  } catch (err) { next(err); }
});

// GET /api/public/rooms/:hotel_id — public rooms list for landing page
router.get("/rooms/:hotel_id", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, room_number, room_type, price_per_night, capacity, amenities, images
       FROM rooms WHERE hotel_id = $1 AND is_available = true ORDER BY price_per_night ASC`,
      [req.params.hotel_id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
