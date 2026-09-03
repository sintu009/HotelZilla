require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'init.sql'), 'utf8')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function run() {
  await client.connect()
  console.log('Connected to Supabase')
  await client.query(sql)
  console.log('Schema applied successfully')
  await client.end()
}

run().catch(err => { console.error('Error:', err.message); process.exit(1) })
