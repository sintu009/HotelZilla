const db = require("../config/db");

exports.getEarnings = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT
         DATE_TRUNC('month', p.created_at) AS month,
         SUM(p.amount) AS gross,
         ROUND(SUM(p.amount * 0.9), 2) AS net
       FROM payments p
       JOIN bookings b ON p.booking_id=b.id
       JOIN hotels h ON b.hotel_id=h.id
       WHERE h.owner_id=$1 AND p.status='completed'
       GROUP BY month ORDER BY month DESC`,
      [req.owner.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};
