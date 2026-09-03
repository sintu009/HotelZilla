const db = require("../config/db");

exports.getOwnerById = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Owner profile
    const { rows: [owner] } = await db.query(
      `SELECT id, name, email, phone, is_active, created_at FROM users WHERE id=$1 AND role='hotel_owner'`,
      [id]
    );
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    // Hotels
    const { rows: hotels } = await db.query(
      `SELECT h.id, h.name, h.city, h.state, h.status, h.star_rating, h.images, h.created_at,
              MIN(r.price_per_night) AS price_from,
              COUNT(DISTINCT r.id) AS room_count
       FROM hotels h
       LEFT JOIN rooms r ON r.hotel_id = h.id
       WHERE h.owner_id = $1
       GROUP BY h.id ORDER BY h.created_at DESC`,
      [id]
    );

    const hotelIds = hotels.map(h => h.id);

    // Bookings for owner's hotels
    const { rows: bookings } = hotelIds.length
      ? await db.query(
          `SELECT b.id, b.checkin_date, b.checkout_date, b.amount, b.status, b.created_at,
                  u.name AS customer_name, h.name AS hotel_name, h.id AS hotel_id
           FROM bookings b
           JOIN users u ON b.user_id = u.id
           JOIN hotels h ON b.hotel_id = h.id
           WHERE b.hotel_id = ANY($1::int[])
           ORDER BY b.created_at DESC`,
          [hotelIds]
        )
      : { rows: [] };

    // Revenue summary
    const { rows: [rev] } = await db.query(
      hotelIds.length
        ? `SELECT
            COALESCE(SUM(CASE WHEN b.status NOT IN ('cancelled') THEN b.amount ELSE 0 END), 0) AS total_revenue,
            COUNT(*) FILTER (WHERE b.status NOT IN ('cancelled')) AS total_bookings,
            COUNT(*) FILTER (WHERE b.status = 'cancelled') AS cancelled_bookings,
            COUNT(*) FILTER (WHERE b.status = 'confirmed' OR b.status = 'checked_in') AS active_bookings
           FROM bookings b WHERE b.hotel_id = ANY($1::int[])`
        : `SELECT 0 AS total_revenue, 0 AS total_bookings, 0 AS cancelled_bookings, 0 AS active_bookings`,
      hotelIds.length ? [hotelIds] : []
    );

    // Monthly revenue (last 12 months)
    const { rows: monthly } = hotelIds.length
      ? await db.query(
          `SELECT TO_CHAR(DATE_TRUNC('month', b.created_at), 'Mon YYYY') AS month,
                  DATE_TRUNC('month', b.created_at) AS month_date,
                  COALESCE(SUM(CASE WHEN b.status != 'cancelled' THEN b.amount ELSE 0 END), 0) AS revenue,
                  COUNT(*) FILTER (WHERE b.status != 'cancelled') AS bookings,
                  COUNT(*) FILTER (WHERE b.status = 'cancelled') AS cancellations
           FROM bookings b
           WHERE b.hotel_id = ANY($1::int[])
             AND b.created_at >= NOW() - INTERVAL '12 months'
           GROUP BY DATE_TRUNC('month', b.created_at)
           ORDER BY month_date ASC`,
          [hotelIds]
        )
      : { rows: [] };

    res.json({ owner, hotels, bookings, stats: rev, monthly });
  } catch (err) { next(err); }
};
