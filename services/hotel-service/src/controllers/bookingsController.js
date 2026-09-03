const db = require("../config/db");

exports.getHotelBookings = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT b.*, u.name AS customer_name, u.phone AS customer_phone, h.name AS hotel_name, r.room_number
       FROM bookings b
       JOIN hotels h ON b.hotel_id=h.id
       JOIN users u ON b.user_id=u.id
       JOIN rooms r ON b.room_id=r.id
       WHERE h.owner_id=$1
       ORDER BY b.created_at DESC LIMIT $2 OFFSET $3`,
      [req.owner.id, limit, offset]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.updateBookingStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE bookings SET status=$1
       WHERE id=$2 AND hotel_id IN (SELECT id FROM hotels WHERE owner_id=$3)
       RETURNING *`,
      [status, id, req.owner.id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Booking not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
