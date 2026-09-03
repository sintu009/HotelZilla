const router = require("express").Router();
const db = require("../config/db");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT id, code, discount_type, discount_value, min_amount, expires_at, max_uses, uses FROM coupons WHERE expires_at > NOW() AND uses < max_uses ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post("/validate", async (req, res, next) => {
  const { code, amount } = req.body;
  if (!code) return res.status(400).json({ message: "Code required" });
  try {
    const { rows } = await db.query(
      "SELECT * FROM coupons WHERE code=$1 AND expires_at > NOW() AND uses < max_uses",
      [code.toUpperCase()]
    );
    const c = rows[0];
    if (!c) return res.status(400).json({ message: "Invalid or expired coupon" });
    if (c.min_amount > 0 && amount < c.min_amount)
      return res.status(400).json({ message: `Minimum order amount is ₹${c.min_amount}` });
    const discount = c.discount_type === "percent"
      ? Math.round((amount * c.discount_value) / 100)
      : parseFloat(c.discount_value);
    res.json({ discount, code: c.code });
  } catch (err) { next(err); }
});

module.exports = router;
