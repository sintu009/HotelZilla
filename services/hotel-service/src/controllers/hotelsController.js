const db = require("../config/db");

exports.getMyHotels = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM hotels WHERE owner_id=$1 ORDER BY created_at DESC",
      [req.owner.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.createHotel = async (req, res, next) => {
  const { name, description, city, state, address, amenities, images,
    star_rating, check_in_time, check_out_time, cancellation_policy,
    pets_allowed, smoking_allowed, breakfast_included, latitude, longitude } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO hotels (owner_id, name, description, city, state, address, amenities, images, status,
        star_rating, check_in_time, check_out_time, cancellation_policy,
        pets_allowed, smoking_allowed, breakfast_included, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [req.owner.id, name, description, city, state || null, address, amenities, images,
        star_rating || 3, check_in_time || '12:00 PM', check_out_time || '11:00 AM',
        cancellation_policy || null, pets_allowed || false, smoking_allowed || false,
        breakfast_included || false, latitude || null, longitude || null]
    );
    res.status(201).json(rows[0]);
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
        name=COALESCE($1,name), description=COALESCE($2,description),
        city=COALESCE($3,city), state=COALESCE($4,state), address=COALESCE($5,address),
        amenities=COALESCE($6,amenities), images=COALESCE($7,images),
        star_rating=COALESCE($8,star_rating), check_in_time=COALESCE($9,check_in_time),
        check_out_time=COALESCE($10,check_out_time), cancellation_policy=COALESCE($11,cancellation_policy),
        pets_allowed=COALESCE($12,pets_allowed), smoking_allowed=COALESCE($13,smoking_allowed),
        breakfast_included=COALESCE($14,breakfast_included),
        latitude=COALESCE($15,latitude), longitude=COALESCE($16,longitude)
       WHERE id=$17 AND owner_id=$18 RETURNING *`,
      [name, description, city, state, address, amenities, images,
        star_rating, check_in_time, check_out_time, cancellation_policy,
        pets_allowed, smoking_allowed, breakfast_included, latitude, longitude, id, req.owner.id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Hotel not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.toggleHotelOpen = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Only allowed if hotel is approved — can't open a pending/rejected hotel
    const { rows } = await db.query(
      `UPDATE hotels SET is_open = NOT is_open
       WHERE id=$1 AND owner_id=$2 AND status='approved'
       RETURNING id, name, is_open, status`,
      [id, req.owner.id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", message: "Hotel not found or not approved" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
