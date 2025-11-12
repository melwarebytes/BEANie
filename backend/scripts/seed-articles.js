// backend/scripts/seed-articles.js
require('dotenv').config()
const connectDB = require('../config/db')
const Article = require('../models/Article')
const User = require('../models/User')
const slugify = require('slugify')

async function run() {
  await connectDB()
  console.log('Seeding articles...')

  // Find an author to attribute (fallback to first user)
  let author = await User.findOne({ email: 'admin@beanie.local' })
  if (!author) author = await User.findOne() // any user

  const articlesData = [
    {
      title: 'The Science of Extraction',
      excerpt: 'How grind size, water temperature and time affect extraction and taste.',
      content: `<h2>What is extraction?</h2><p>Extraction dissolves soluble compounds into water — learn how to balance it.</p>`,
      tags: ['extraction','science'],
      type: 'article',
      featured: true
    },
    {
      title: 'Pour Over — A Beginner Friendly Guide',
      excerpt: 'Step-by-step pour over recipe with ratios and troubleshooting.',
      content: `<h2>Pour Over</h2><p>18g coffee : 300ml water, bloom 30s, pour in spirals.</p>`,
      tags: ['pour over','guide'],
      type: 'guide',
      featured: true
    },
    {
      title: 'Sustainability in Coffee Supply Chains',
      excerpt: 'Traceability, farmer partnerships and ethical sourcing explained.',
      content: `<p>Direct trade, traceability and long-term partnerships improve outcomes for farmers and roasters.</p>`,
      tags: ['sustainability','origins'],
      type: 'blog',
      featured: true
    },
    {
      title: 'Cold Brew Concentrate Tips',
      excerpt: 'Practical tips for clean cold brew concentrate.',
      content: `<p>Use coarse grind, steep ~18 hours, dilute concentrate 1:1 to taste.</p>`,
      tags: ['cold brew','recipe'],
      type: 'article',
      featured: false
    },
    {
      title: 'How to Cup Like a Pro',
      excerpt: 'Cupping basics and tasting vocabulary.',
      content: `<p>Set cupping bowls, evaluate aroma, acidity, body and finish.</p>`,
      tags: ['cupping','sensory'],
      type: 'blog',
      featured: false
    }
  ]

  for (const a of articlesData) {
    const slug = slugify(a.title, { lower: true, strict: true }).slice(0,200)
    const exists = await Article.findOne({ slug })
    if (exists) {
      console.log(`Skipping existing article: ${a.title}`)
      continue
    }
    const art = new Article({
      title: a.title,
      slug,
      excerpt: a.excerpt,
      content: a.content,
      tags: a.tags,
      type: a.type || 'article',
      featured: !!a.featured,
      author: author ? author._id : undefined
    })
    await art.save()
    console.log(`Created article: ${a.title}`)
  }

  console.log('Articles seeded.')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })