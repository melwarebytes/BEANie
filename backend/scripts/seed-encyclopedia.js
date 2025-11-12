// backend/scripts/seed-encyclopedia.js
require('dotenv').config()
const connectDB = require('../config/db')
const Encyclopedia = require('../models/Encyclopedia')
const User = require('../models/User')
const slugify = require('slugify')

async function run() {
  await connectDB()
  console.log('Seeding encyclopedia entries...')

  const author = await User.findOne({ email: 'admin@beanie.local' }) || await User.findOne()
  if (!author) { console.error('No user found; run seed-users.js'); process.exit(1) }

  const entries = [
    {
      title: 'Origin: Yirgacheffe — What Makes it Floral?',
      summary: 'A deep dive into Yirgacheffe terroir and processing.',
      body: '<h2>Yirgacheffe</h2><p>...detailed content...</p>',
      tags: ['ethiopia','origin'],
      type: 'origin'
    },
    {
      title: 'Brew Method: Pour Over Fundamentals',
      summary: 'Technique, ratio and common mistakes for pour over brewing.',
      body: '<h2>Pour Over</h2><p>...detailed content...</p>',
      tags: ['pour over','method'],
      type: 'method'
    }
    // add more encyclopedia pieces here
  ]

  for (const e of entries) {
    const slug = slugify(e.title, { lower: true, strict: true }).slice(0,200)
    const exists = await Encyclopedia.findOne({ slug })
    if (exists) { console.log(`Skipping: ${e.title}`); continue }
    const doc = new Encyclopedia({
      title: e.title,
      slug,
      summary: e.summary,
      body: e.body,
      tags: e.tags,
      type: e.type,
      author: author._id
    })
    await doc.save()
    console.log(`Inserted encyclopedia: ${e.title}`)
  }

  console.log('Encyclopedia seeded.')
  process.exit(0)
}
run().catch(err=>{ console.error(err); process.exit(1) })