const { spawn } = require('child_process')
const path = require('path')

const services = [
  { name: 'gateway',          dir: 'gateway',          port: 4000 },
  { name: 'admin-service',    dir: 'admin-service',    port: 4001 },
  { name: 'user-service',     dir: 'user-service',     port: 4002 },
  { name: 'hotel-service',    dir: 'hotel-service',    port: 4003 },
  { name: 'realtime-service', dir: 'realtime-service', port: 4004 },
]

const colors = ['\x1b[36m', '\x1b[32m', '\x1b[33m', '\x1b[35m', '\x1b[34m']
const reset  = '\x1b[0m'

services.forEach(({ name, dir, port }, i) => {
  const color   = colors[i % colors.length]
  const cwd     = path.join(__dirname, dir)
  const label   = `[${name}:${port}]`

  const proc = spawn('node', ['src/server.js'], { cwd, env: process.env })

  proc.stdout.on('data', d => process.stdout.write(`${color}${label}${reset} ${d}`))
  proc.stderr.on('data', d => process.stderr.write(`${color}${label}${reset} ${d}`))

  proc.on('exit', code => {
    console.log(`${color}${label}${reset} exited with code ${code}`)
  })
})

console.log('\x1b[1m[HotelZilla] Starting all services...\x1b[0m')
