const db = require("../config/db");

exports.getAllCustomers = async (req, res, next) => {
  const { page = 1, limit = 20, role = 'customer' } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, phone, created_at, is_active, role FROM users
       WHERE role=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [role, limit, offset]
    );
    const { rows: [{ count }] } = await db.query(
      "SELECT COUNT(*) FROM users WHERE role=$1", [role]
    );
    res.json({ data: rows, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.toggleCustomerStatus = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "UPDATE users SET is_active = NOT is_active WHERE id=$1 RETURNING id, name, email, is_active",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "User not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
