const db = require("../config/db");

exports.getAllBookings = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT b.*, u.name AS customer_name, h.name AS hotel_name
       FROM bookings b
       JOIN users u ON b.user_id=u.id
       JOIN hotels h ON b.hotel_id=h.id
       ORDER BY b.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: [{ count }] } = await db.query("SELECT COUNT(*) FROM bookings");
    res.json({ data: rows, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.updateBookingStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await db.query(
      "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Booking not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
