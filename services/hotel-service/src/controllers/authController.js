const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES ($1,$2,$3,$4,'hotel_owner') RETURNING id, name, email",
      [name, email, hashed, phone]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email=$1 AND role='hotel_owner'", [email]);
    const owner = rows[0];
    if (!owner || !(await bcrypt.compare(password, owner.password)))
      return res.status(401).json({ status: "error", code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
    if (!owner.is_active)
      return res.status(403).json({ status: "error", code: "ACCOUNT_SUSPENDED", message: "Your account has been suspended" });

    const token = jwt.sign({ id: owner.id, role: "hotel_owner" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, owner: { id: owner.id, name: owner.name, email: owner.email } });
  } catch (err) { next(err); }
};
