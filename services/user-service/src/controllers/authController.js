const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES ($1,$2,$3,$4,'customer') RETURNING id, name, email",
      [name, email, hashed, phone]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email=$1 AND role='customer'", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ status: "error", code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
    if (!user.is_active)
      return res.status(403).json({ status: "error", code: "ACCOUNT_SUSPENDED", message: "Your account has been suspended" });

    const token = jwt.sign({ id: user.id, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};
