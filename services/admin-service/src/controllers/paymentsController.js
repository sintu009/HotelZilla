const db = require("../config/db");

exports.getAllPayments = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT p.*, u.name AS customer_name, b.id AS booking_ref
       FROM payments p
       JOIN bookings b ON p.booking_id=b.id
       JOIN users u ON b.user_id=u.id
       ORDER BY p.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: [{ count }] } = await db.query("SELECT COUNT(*) FROM payments");
    res.json({ data: rows, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.processRefund = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "UPDATE payments SET status='refunded' WHERE id=$1 AND status='completed' RETURNING *",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Payment not found or already refunded" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
