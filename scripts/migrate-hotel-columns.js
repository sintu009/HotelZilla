require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const migrations = [
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS star_rating         INT DEFAULT 3`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS state               VARCHAR(100)`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS latitude            NUMERIC(10,7)`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS longitude           NUMERIC(10,7)`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS check_in_time       VARCHAR(20) DEFAULT '12:00 PM'`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS check_out_time      VARCHAR(20) DEFAULT '11:00 AM'`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'Free cancellation up to 24 hours before check-in.'`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS pets_allowed        BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS smoking_allowed     BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS breakfast_included  BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS is_open             BOOLEAN DEFAULT TRUE`,
]

async function run() {
  const client = await pool.connect()
  try {
    for (const sql of migrations) {
      await client.query(sql)
      console.log('✓', sql.split('ADD COLUMN IF NOT EXISTS')[1]?.trim().split(' ')[0] || sql)
    }
    console.log('\n✅ All columns added successfully.')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
