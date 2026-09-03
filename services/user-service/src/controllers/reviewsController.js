const db = require("../config/db");

exports.addReview = async (req, res, next) => {
  const { hotel_id, booking_id, rating, comment } = req.body;
  try {
    // Ensure the booking belongs to this user and is completed
    const booking = await db.query(
      "SELECT id FROM bookings WHERE id=$1 AND user_id=$2 AND status='checked_out'",
      [booking_id, req.user.id]
    );
    if (!booking.rows[0])
      return res.status(403).json({ status: "error", code: "FORBIDDEN", message: "You can only review completed stays" });

    const { rows } = await db.query(
      "INSERT INTO reviews (user_id, hotel_id, booking_id, rating, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [req.user.id, hotel_id, booking_id, rating, comment]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};
