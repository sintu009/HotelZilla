const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// In-memory token blacklist for logout (use Redis in production)
const blacklist = new Set();
exports.blacklist = blacklist;

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM admins WHERE email=$1", [email]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ status: "error", code: "INVALID_CREDENTIALS", message: "Invalid email or password" });

    const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT id, name, email, created_at FROM admins WHERE id=$1",
      [req.admin.id]
    );
    if (!rows[0]) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Admin not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) blacklist.add(token);
  res.json({ message: "Logged out successfully" });
};
