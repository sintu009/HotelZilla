const db = require("../config/db");

exports.createHotel = async (req, res, next) => {
  const { name, description, city, state, address, amenities, images, status = 'approved',
    star_rating, check_in_time, check_out_time, cancellation_policy,
    pets_allowed, smoking_allowed, breakfast_included, latitude, longitude } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO hotels (name, description, city, state, address, amenities, images, status,
        star_rating, check_in_time, check_out_time, cancellation_policy,
        pets_allowed, smoking_allowed, breakfast_included, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [name, description, city, state || null, address, amenities || [], images || [], status,
        star_rating || 3, check_in_time || '12:00 PM', check_out_time || '11:00 AM',
        cancellation_policy || null, pets_allowed || false, smoking_allowed || false,
        breakfast_included || false, latitude || null, longitude || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.getHotelById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      `SELECT h.*, u.name AS owner_name, u.email AS owner_email,
              MIN(r.price_per_night) AS price_from
       FROM hotels h
       LEFT JOIN users u ON h.owner_id=u.id
       LEFT JOIN rooms r ON r.hotel_id=h.id
       WHERE h.id=$1
       GROUP BY h.id, u.name, u.email`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ status: 'error', message: 'Hotel not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.getAllHotels = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT h.*, u.name AS owner_name, u.email AS owner_email,
              MIN(r.price_per_night) AS price_from
       FROM hotels h
       LEFT JOIN users u ON h.owner_id=u.id
       LEFT JOIN rooms r ON r.hotel_id=h.id
       GROUP BY h.id, u.name, u.email
       ORDER BY h.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: [{ count }] } = await db.query("SELECT COUNT(*) FROM hotels");
    res.json({ data: rows, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.updateHotel = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, city, state, address, amenities, images,
    star_rating, check_in_time, check_out_time, cancellation_policy,
    pets_allowed, smoking_allowed, breakfast_included, latitude, longitude } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE hotels SET
        name=$1, description=$2, city=$3, state=$4, address=$5, amenities=$6, images=$7,
        star_rating=$8, check_in_time=$9, check_out_time=$10, cancellation_policy=$11,
        pets_allowed=$12, smoking_allowed=$13, breakfast_included=$14,
        latitude=$15, longitude=$16
       WHERE id=$17 RETURNING *`,
      [name, description, city, state || null, address, amenities || [], images || [],
        star_rating || 3, check_in_time || '12:00 PM', check_out_time || '11:00 AM',
        cancellation_policy || null, pets_allowed || false, smoking_allowed || false,
        breakfast_included || false, latitude || null, longitude || null, id]
    );
    if (!rows[0]) return res.status(404).json({ status: 'error', message: 'Hotel not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.updateHotelStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  // Enforce transition rules: approved hotels cannot be re-rejected or re-approved
  const ALLOWED_FROM = {
    approved:  ['pending', 'rejected'],   // only pending/rejected can be approved
    rejected:  ['pending'],               // only pending can be rejected
    pending:   ['rejected'],              // relist: rejected → pending
  };
  try {
    const { rows: [current] } = await db.query("SELECT status FROM hotels WHERE id=$1", [id]);
    if (!current) return res.status(404).json({ message: "Hotel not found" });
    const allowed = ALLOWED_FROM[status] || [];
    if (!allowed.includes(current.status)) {
      return res.status(400).json({ message: `Cannot change status from '${current.status}' to '${status}'` });
    }
    const { rows } = await db.query(
      "UPDATE hotels SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.deleteHotel = async (req, res, next) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM hotels WHERE id=$1", [id]);
    res.json({ message: 'Hotel deleted' });
  } catch (err) { next(err); }
};

exports.toggleHotelOpen = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "UPDATE hotels SET is_open = NOT is_open WHERE id=$1 RETURNING id, name, is_open, status",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Hotel not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.getRooms = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "SELECT * FROM rooms WHERE hotel_id=$1 ORDER BY created_at ASC", [id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.addRoom = async (req, res, next) => {
  const { id } = req.params;
  const { room_number, room_type, price_per_night, capacity, amenities, images } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity, amenities, images)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, room_number, room_type, price_per_night, capacity || 2, amenities || [], images || []]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.updateRoom = async (req, res, next) => {
  const { roomId } = req.params;
  const { room_number, room_type, price_per_night, capacity, amenities, images, is_available } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE rooms SET room_number=$1, room_type=$2, price_per_night=$3, capacity=$4, amenities=$5, images=$6, is_available=$7
       WHERE id=$8 RETURNING *`,
      [room_number, room_type, price_per_night, capacity, amenities || [], images || [], is_available ?? true, roomId]
    );
    if (!rows[0]) return res.status(404).json({ status: 'error', message: 'Room not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.deleteRoom = async (req, res, next) => {
  const { roomId } = req.params;
  try {
    await db.query("DELETE FROM rooms WHERE id=$1", [roomId]);
    res.json({ message: 'Room deleted' });
  } catch (err) { next(err); }
};
