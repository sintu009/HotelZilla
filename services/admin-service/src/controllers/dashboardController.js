const db = require("../config/db");

exports.getWeeklyBookings = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT TO_CHAR(DATE(created_at), 'Dy') AS day,
             COUNT(*) AS bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at), TO_CHAR(DATE(created_at), 'Dy')
      ORDER BY DATE(created_at)
    `);
    res.json(result.rows.map(r => ({ day: r.day, bookings: parseInt(r.bookings) })));
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [bookings, hotels, customers, revenue] = await Promise.all([
      db.query("SELECT COUNT(*) FROM bookings"),
      db.query("SELECT COUNT(*) FROM hotels"),
      db.query("SELECT COUNT(*) FROM users WHERE role='customer'"),
      db.query("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='completed'"),
    ]);
    res.json({
      totalBookings:  parseInt(bookings.rows[0].count),
      totalHotels:    parseInt(hotels.rows[0].count),
      totalCustomers: parseInt(customers.rows[0].count),
      totalRevenue:   parseFloat(revenue.rows[0].total),
    });
  } catch (err) { next(err); }
};
