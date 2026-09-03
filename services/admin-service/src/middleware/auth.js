const jwt = require("jsonwebtoken");
const { blacklist } = require("../controllers/authController");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ status: "error", code: "UNAUTHORIZED", message: "No token provided" });
  if (blacklist.has(token)) return res.status(401).json({ status: "error", code: "TOKEN_REVOKED", message: "Token has been revoked" });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const code = err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
    res.status(401).json({ status: "error", code, message: err.message });
  }
};
