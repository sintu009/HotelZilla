require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
})

async function migrate() {
  const client = await pool.connect()
  try {
    console.log('Running booking columns migration...')
    await client.query(`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS owner_id          INT REFERENCES users(id);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name     VARCHAR(150);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email    VARCHAR(150);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_phone    VARCHAR(30);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(50);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source            VARCHAR(30) DEFAULT 'main_site';

      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS brand_name           VARCHAR(200);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS brand_tagline        VARCHAR(200);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS logo_text            VARCHAR(5);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS logo_url             TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS theme                VARCHAR(30) DEFAULT 'emerald';
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cover_image          TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS landing_page_enabled BOOLEAN DEFAULT FALSE;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS contact_email        VARCHAR(150);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS contact_phone        VARCHAR(30);

      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS hero_heading         TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS hero_subheading      TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature1_title       VARCHAR(200);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature1_desc        TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature2_title       VARCHAR(200);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature2_desc        TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature3_title       VARCHAR(200);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature3_desc        TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature4_title       VARCHAR(200);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature4_desc        TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cta_heading          TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cta_subheading       TEXT;
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS footer_tagline       TEXT;
    `)
    console.log('Migration complete.')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch(err => { console.error(err); process.exit(1) })
