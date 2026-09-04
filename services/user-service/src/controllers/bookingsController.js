const db = require("../config/db");

exports.createBooking = async (req, res, next) => {
  const { hotel_id, room_id, checkin_date, checkout_date, guests, coupon_code } = req.body;
  const user_id = req.user.id;
  try {
    const room = await db.query("SELECT * FROM rooms WHERE id=$1 AND is_available=true", [room_id]);
    if (!room.rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Room not found or unavailable" });

    const nights = Math.ceil(
      (new Date(checkout_date) - new Date(checkin_date)) / (1000 * 60 * 60 * 24)
    );
    if (nights < 1) return res.status(400).json({ status: "error", code: "INVALID_DATES", message: "Invalid date range" });

    let amount = parseFloat(room.rows[0].price_per_night) * nights;

    if (coupon_code) {
      const coupon = await db.query(
        "SELECT * FROM coupons WHERE code=$1 AND expires_at > NOW() AND uses < max_uses",
        [coupon_code]
      );
      if (coupon.rows[0]) {
        const c = coupon.rows[0];
        amount = c.discount_type === "percent"
          ? amount - (amount * c.discount_value) / 100
          : amount - parseFloat(c.discount_value);
        amount = Math.max(0, amount);
        await db.query("UPDATE coupons SET uses = uses + 1 WHERE id=$1", [c.id]);
      }
    }

    // Fetch owner_id so booking appears in the hotel partner dashboard
    const hotelRes = await db.query("SELECT owner_id FROM hotels WHERE id=$1", [hotel_id]);
    const owner_id = hotelRes.rows[0]?.owner_id || null;
    const booking_reference = 'BK' + Date.now().toString(36).toUpperCase();

    const { rows } = await db.query(
      `INSERT INTO bookings
        (user_id, hotel_id, room_id, owner_id, checkin_date, checkout_date, guests, amount,
         source, booking_reference, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'main_site',$9,'confirmed') RETURNING *`,
      [user_id, hotel_id, room_id, owner_id, checkin_date, checkout_date, guests, amount, booking_reference]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.getMyBookings = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT b.*, h.name AS hotel_name, h.city, r.room_number
       FROM bookings b
       JOIN hotels h ON b.hotel_id=h.id
       JOIN rooms r ON b.room_id=r.id
       WHERE b.user_id=$1 ORDER BY b.created_at DESC LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "UPDATE bookings SET status='cancelled' WHERE id=$1 AND user_id=$2 AND status='pending' RETURNING *",
      [id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Booking not found or cannot be cancelled" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
