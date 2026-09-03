const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { createCoupon, paginationQuery, idParam } = require("../../../shared/validators/adminSchemas");
const { getAllCoupons, createCoupon: create, deleteCoupon } = require("../controllers/couponsController");

router.get("/",       auth, validate(paginationQuery), getAllCoupons);
router.post("/",      auth, validate(createCoupon), create);
router.patch("/:id",  auth, async (req, res, next) => {
  const { id } = req.params;
  const { code, discount_type, discount_value, min_amount, expires_at, max_uses } = req.body;
  const db = require("../config/db");
  try {
    const { rows } = await db.query(
      `UPDATE coupons SET
        code=COALESCE($1,code), discount_type=COALESCE($2,discount_type),
        discount_value=COALESCE($3,discount_value), min_amount=COALESCE($4,min_amount),
        expires_at=COALESCE($5,expires_at), max_uses=COALESCE($6,max_uses)
       WHERE id=$7 RETURNING *`,
      [code, discount_type, discount_value, min_amount, expires_at, max_uses, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Coupon not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});
router.delete("/:id", auth, validate({ params: idParam }), deleteCoupon);

module.exports = router;
