const db = require("../config/db");

exports.getAllReviews = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT r.*, u.name AS customer_name, h.name AS hotel_name
       FROM reviews r
       JOIN users u ON r.user_id=u.id
       JOIN hotels h ON r.hotel_id=h.id
       ORDER BY r.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: [{ count }] } = await db.query("SELECT COUNT(*) FROM reviews");
    res.json({ data: rows, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.deleteReview = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query("DELETE FROM reviews WHERE id=$1", [id]);
    if (!rowCount) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) { next(err); }
};
