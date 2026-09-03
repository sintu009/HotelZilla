require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function run() {
  await client.connect()
  await client.query("ALTER TABLE rooms ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'")
  console.log('Migration done: rooms.images column added')
  await client.end()
}

run().catch(err => { console.error(err.message); process.exit(1) })
