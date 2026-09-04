const db = require("../config/db");

exports.registerHotel = async (req, res, next) => {
  const { name, city, state, address, description, amenities, contact_email, contact_phone,
          star_rating, total_rooms, price_from, cover_image, images } = req.body;
  if (!name || !city)
    return res.status(400).json({ status: 'error', message: 'name and city are required' });
  const owner_id = req.user?.id || null;
  try {
    const { rows } = await db.query(
      `INSERT INTO hotels
        (name, city, state, address, description, amenities, images, status, owner_id,
         star_rating, contact_email, contact_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10,$11)
       RETURNING id, name, city, status, owner_id`,
      [name, city, state || null, address || null, description || null,
       amenities || [], images || [], owner_id,
       star_rating || 3, contact_email || null, contact_phone || null]
    );
    res.status(201).json({ message: 'Registration submitted. Our team will review and contact you shortly.', hotel: rows[0] });
  } catch (err) { next(err); }
};

exports.searchHotels = async (req, res, next) => {
  const { city, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT h.*, AVG(r.rating) AS avg_rating, COUNT(r.id) AS review_count,
              MIN(rm.price_per_night) AS price_from,
              COUNT(*) OVER() AS total_count
       FROM hotels h
       LEFT JOIN reviews r ON r.hotel_id = h.id
       LEFT JOIN rooms rm ON rm.hotel_id = h.id AND rm.is_available = true
       WHERE h.status='approved' AND h.is_open=true AND ($1::text IS NULL OR LOWER(h.city) = LOWER($1))
       GROUP BY h.id
       ORDER BY avg_rating DESC NULLS LAST
       LIMIT $2 OFFSET $3`,
      [city || null, limit, offset]
    );
    res.json({ data: rows, total: parseInt(rows[0]?.total_count || 0), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.getHotelById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [hotel, rooms, reviews] = await Promise.all([
      db.query("SELECT * FROM hotels WHERE id=$1 AND status='approved'", [id]),
      db.query("SELECT * FROM rooms WHERE hotel_id=$1 AND is_available=true", [id]),
      db.query(
        "SELECT r.*, u.name AS customer_name FROM reviews r JOIN users u ON r.user_id=u.id WHERE r.hotel_id=$1 ORDER BY r.created_at DESC LIMIT 20",
        [id]
      ),
    ]);
    if (!hotel.rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Hotel not found" });
    res.json({ hotel: hotel.rows[0], rooms: rooms.rows, reviews: reviews.rows });
  } catch (err) { next(err); }
};
