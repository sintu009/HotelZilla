const { Pool } = require("pg");

const pool = process.env.USE_SUPABASE === "true"
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host:     process.env.DB_HOST     || "postgres",
      port:     process.env.DB_PORT     || 5432,
      user:     process.env.DB_USER     || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME     || "hotelzilla",
    });

pool.connect()
  .then(() => console.log(`[hotel-service] DB connected (${process.env.USE_SUPABASE === "true" ? "Supabase" : "local postgres"})`))
  .catch((err) => console.error("[hotel-service] DB error:", err));

module.exports = pool;
