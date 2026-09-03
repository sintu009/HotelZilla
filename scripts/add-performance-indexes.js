require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { Pool } = require('pg')

const pool = process.env.USE_SUPABASE === 'true'
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host: process.env.DB_HOST || 'postgres',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'hotelzilla',
    })

const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_hotels_status_open  ON hotels(status, is_open)',
  'CREATE INDEX IF NOT EXISTS idx_hotels_city         ON hotels(LOWER(city))',
  'CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id      ON rooms(hotel_id)',
  'CREATE INDEX IF NOT EXISTS idx_rooms_hotel_avail   ON rooms(hotel_id, is_available)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id    ON reviews(hotel_id)',
  'CREATE INDEX IF NOT EXISTS idx_bookings_user_id    ON bookings(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id   ON bookings(hotel_id)',
]

;(async () => {
  for (const sql of indexes) {
    await pool.query(sql)
    console.log('✓', sql.match(/idx_\w+/)[0])
  }
  console.log('All indexes created.')
  await pool.end()
})().catch(err => { console.error(err); process.exit(1) })
