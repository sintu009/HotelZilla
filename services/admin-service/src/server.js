require("dotenv").config({ path: require("path").join(__dirname, "../../../.env") });
const express  = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");
const multer    = require("multer");
const path      = require("path");
const fs        = require("fs");
const { errorHandler } = require("../../shared/middleware/errorHandler");
const db = require("./config/db");

const UPLOADS_DIR = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env variable is required");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));

// Request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing — limit payload size
app.use(express.json({ limit: "10kb" }));

// Serve uploaded files — no CSP restrictions
app.use("/uploads", (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(UPLOADS_DIR));

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many requests, please try again later." },
}));

// Strict rate limit on auth
app.use("/api/admin/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many login attempts." },
}));

// Image upload endpoint
app.post("/api/admin/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const host = process.env.ADMIN_SERVICE_PUBLIC_URL || `http://localhost:4001`;
  const url = `${host}/uploads/${req.file.filename}`;
  res.json({ url });
});

app.use("/api/admin/auth",      require("./routes/auth"));
app.use("/api/admin/dashboard", require("./routes/dashboard"));
app.use("/api/admin/hotels",    require("./routes/hotels"));
app.use("/api/admin/bookings",  require("./routes/bookings"));
app.use("/api/admin/customers", require("./routes/customers"));
app.use("/api/admin/owners",    require("./routes/owners"));
app.use("/api/admin/payments",  require("./routes/payments"));
app.use("/api/admin/coupons",   require("./routes/coupons"));
app.use("/api/admin/reviews",   require("./routes/reviews"));
app.use("/api/admin/cms",       require("./routes/cms"));

// Health check with real DB ping
app.get("/health", async (_, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", service: "admin-service" });
  } catch {
    res.status(503).json({ status: "error", service: "admin-service" });
  }
});

// 404 handler
app.use((req, res) => res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Route not found" }));

// Central error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
const server = app.listen(PORT, () => console.log(`[admin-service] running on port ${PORT}`));

// Graceful shutdown
const shutdown = () => { server.close(() => { db.end(); process.exit(0); }); };
process.on("SIGTERM", shutdown);
process.on("SIGINT",  shutdown);
