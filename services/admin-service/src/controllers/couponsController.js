const db = require("../config/db");

exports.getAllCoupons = async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM coupons ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { next(err); }
};

exports.createCoupon = async (req, res, next) => {
  const { code, discount_type, discount_value, min_amount, expires_at, max_uses } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_amount, expires_at, max_uses)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [code, discount_type, discount_value, min_amount, expires_at, max_uses]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.deleteCoupon = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query("DELETE FROM coupons WHERE id=$1", [id]);
    if (!rowCount) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (err) { next(err); }
};
