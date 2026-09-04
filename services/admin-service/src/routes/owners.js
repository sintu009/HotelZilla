const router = require("express").Router();
const auth   = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const db     = require("../config/db");
const { getOwnerById } = require("../controllers/ownersController");

router.get("/:id", auth, getOwnerById);

// PATCH /api/admin/owners/:id/password — set partner login password
router.patch("/:id/password", auth, async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `UPDATE users SET password=$1 WHERE id=$2 AND role='hotel_owner' RETURNING id, name, email`,
      [hashed, id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Owner not found" });
    res.json({ message: "Password updated", owner: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;
