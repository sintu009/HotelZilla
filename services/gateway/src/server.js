require("dotenv").config({ path: require("path").join(__dirname, "../../../.env") });
const express = require("express");
const { legacyCreateProxyMiddleware } = require("http-proxy-middleware");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Global rate limit at gateway level
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many requests." },
}));

const ADMIN_SERVICE  = process.env.ADMIN_SERVICE_URL  || "http://admin-service:4001";
const USER_SERVICE   = process.env.USER_SERVICE_URL   || "http://user-service:4002";
const HOTEL_SERVICE  = process.env.HOTEL_SERVICE_URL  || "http://hotel-service:4003";

const proxy = (target) => legacyCreateProxyMiddleware({ target, changeOrigin: true, on: { error: (err, req, res) => { res.status(502).json({ status: 'error', message: 'Service unavailable' }); } } });

app.use("/api/admin",   proxy(ADMIN_SERVICE));
app.use("/uploads",     proxy(ADMIN_SERVICE));
app.use("/api/partner", proxy(HOTEL_SERVICE));
app.use("/api/public",  proxy(HOTEL_SERVICE));
app.use("/api",         proxy(USER_SERVICE));

app.get("/health", (_, res) => res.json({ status: "ok", service: "gateway" }));

app.use((req, res) => res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Route not found" }));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`[gateway] running on port ${PORT}`));

const shutdown = () => { server.close(() => process.exit(0)); };
process.on("SIGTERM", shutdown);
process.on("SIGINT",  shutdown);
