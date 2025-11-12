// scripts/seed.js
require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')
const Article = require('../models/Article')
const Bean = require('../models/Bean')
const bcrypt = require('bcryptjs')

async function run(){
  await connectDB()
  await User.deleteMany({})
  await Article.deleteMany({})
  await Bean.deleteMany({})

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash('password123', salt)
  const admin = await new User({ name: 'Admin', email: 'admin@beanie.local', password: hashed, role: 'admin' }).save()

  const a1 = await new Article({
    title: 'Seed: The Science of Extraction',
    slug: 'science-of-extraction',
    excerpt: 'Short summary of extraction principles',
    content: '<p>Extraction content</p>',
    tags: ['extraction', 'brewing'],
    featured: true,
    author: admin._id
  }).save()

  const b1 = await new Bean({
    name: 'Yirgacheffe',
    slug: 'yirgacheffe',
    origin: 'Ethiopia',
    notes: 'Floral, tea-like',
    process: 'Washed',
    variety: 'Heirloom',
    altitude: '1800m'
  }).save()

  console.log('Seed complete. Admin login: admin@beanie.local / password123')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })