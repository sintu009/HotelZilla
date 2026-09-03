require("dotenv").config({ path: require("path").join(__dirname, "../../../.env") });
const express  = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("../../shared/middleware/errorHandler");
const db = require("./config/db");

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env variable is required");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many requests, please try again later." },
}));

app.use("/api/partner/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many login attempts." },
}));

app.use("/api/partner/auth",     require("./routes/auth"));
app.use("/api/partner/hotels",   require("./routes/hotels"));
app.use("/api/partner/bookings", require("./routes/bookings"));
app.use("/api/partner/earnings", require("./routes/earnings"));

app.get("/health", async (_, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", service: "hotel-service" });
  } catch {
    res.status(503).json({ status: "error", service: "hotel-service" });
  }
});

app.use((req, res) => res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Route not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 4003;
const server = app.listen(PORT, () => console.log(`[hotel-service] running on port ${PORT}`));

const shutdown = () => { server.close(() => { db.end(); process.exit(0); }); };
process.on("SIGTERM", shutdown);
process.on("SIGINT",  shutdown);
