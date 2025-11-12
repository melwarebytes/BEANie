// backend/scripts/seed-users.js
require('dotenv').config()
const connectDB = require('../config/db')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

async function run() {
  await connectDB()
  console.log('Seeding users...')

  // remove only if you want fresh users
  // await User.deleteMany({})

  const users = [
    { name: 'Admin', email: 'admin@beanie.local', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'demo@beanie.local', password: 'demo1234', role: 'user' }
  ]

  for (const u of users) {
    const exists = await User.findOne({ email: u.email })
    if (exists) {
      console.log(`Skipping existing user: ${u.email}`)
      continue
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(u.password, salt)
    const created = new User({ name: u.name, email: u.email, password: hash, role: u.role })
    await created.save()
    console.log(`Created user: ${u.email}`)
  }

  console.log('Users seeded.')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })