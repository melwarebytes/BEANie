// backend/scripts/seed-beans.js
require('dotenv').config()
const connectDB = require('../config/db')
const Bean = require('../models/Bean')
const slugify = require('slugify')

async function run() {
  await connectDB()
  console.log('Seeding beans...')

  const beansData = [
    { name: 'Yirgacheffe — Ethiopia', origin: 'Ethiopia', notes: 'Floral, jasmine, tea-like acidity', process: 'Washed', variety: 'Heirloom', altitude: '1800m' },
    { name: 'Colombian Huila', origin: 'Colombia', notes: 'Caramel, chocolate, clean finish', process: 'Washed', variety: 'Caturra', altitude: '1500m' },
    { name: 'Guatemalan Antigua', origin: 'Guatemala', notes: 'Nutty, cacao, balanced acidity', process: 'Washed', variety: 'Bourbon', altitude: '1600m' },
    { name: 'Sumatra Mandheling', origin: 'Indonesia', notes: 'Earthy, low acidity, heavy body', process: 'Wet-hulled', variety: 'Typica', altitude: '1200m' },
    { name: 'Kenya AA', origin: 'Kenya', notes: 'Blackcurrant, bright acidity, juicy body', process: 'Washed', variety: 'SL28/SL34', altitude: '1650m' }
  ]

  for (const b of beansData) {
    const slug = slugify(b.name, { lower: true, strict: true }).slice(0,200)
    const exists = await Bean.findOne({ slug })
    if (exists) {
      console.log(`Skipping existing bean: ${b.name}`)
      continue
    }
    const bean = new Bean({
      name: b.name,
      slug,
      origin: b.origin,
      notes: b.notes,
      process: b.process,
      variety: b.variety,
      altitude: b.altitude,
      metadata: {}
    })
    await bean.save()
    console.log(`Created bean: ${b.name}`)
  }

  console.log('Beans seeded.')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })