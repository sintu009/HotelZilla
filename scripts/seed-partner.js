require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function seed() {
  const client = await pool.connect()
  try {
    const password = await bcrypt.hash('partner123', 10)
    const { rows } = await client.query(
      `INSERT INTO users (name, email, password, phone, role)
       VALUES ($1, $2, $3, $4, 'hotel_owner')
       ON CONFLICT (email) DO UPDATE SET password = $3, role = 'hotel_owner'
       RETURNING id, name, email, role`,
      ['Ravi Sharma', 'partner@hotelzilla.com', password, '+91 9876543210']
    )
    console.log('✅ Hotel owner seeded:', rows[0])
    console.log('\nLogin credentials:')
    console.log('  Email:    partner@hotelzilla.com')
    console.log('  Password: partner123')
    console.log('\nPartner ID (use as VITE_PARTNER_ID):', rows[0].id)
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => { console.error('❌', err.message); process.exit(1) })
