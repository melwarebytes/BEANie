// backend/scripts/seed-all.js (updated)
const { spawn } = require('child_process')
const path = require('path')

function runScript(name) {
  return new Promise((resolve, reject) => {
    const p = spawn('node', [path.join(__dirname, name)], { stdio: 'inherit', env: process.env })
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`${name} exited ${code}`)))
  })
}

async function run() {
  try {
    await runScript('seed-users.js')
    await runScript('seed-blogs.js')
    await runScript('seed-encyclopedia.js')
    console.log('All seeds complete')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()