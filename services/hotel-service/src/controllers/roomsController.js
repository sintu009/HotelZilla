const db = require("../config/db");

exports.getRooms = async (req, res, next) => {
  const { hotel_id } = req.params;
  try {
    const { rows } = await db.query(
      "SELECT * FROM rooms WHERE hotel_id=$1 ORDER BY room_number",
      [hotel_id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.addRoom = async (req, res, next) => {
  const { hotel_id } = req.params;
  const { room_number, room_type, price_per_night, capacity, amenities } = req.body;
  try {
    // Verify hotel belongs to this owner
    const hotel = await db.query("SELECT id FROM hotels WHERE id=$1 AND owner_id=$2", [hotel_id, req.owner.id]);
    if (!hotel.rows[0]) return res.status(403).json({ status: "error", code: "FORBIDDEN", message: "Hotel not found" });

    const { rows } = await db.query(
      `INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity, amenities)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [hotel_id, room_number, room_type, price_per_night, capacity, amenities]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.updateRoom = async (req, res, next) => {
  const { id } = req.params;
  const { price_per_night, is_available, amenities } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE rooms SET
        price_per_night=COALESCE($1,price_per_night),
        is_available=COALESCE($2,is_available),
        amenities=COALESCE($3,amenities)
       WHERE id=$4 RETURNING *`,
      [price_per_night, is_available, amenities, id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Room not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
