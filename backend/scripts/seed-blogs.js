// backend/scripts/seed-blogs.js
require('dotenv').config()
const connectDB = require('../config/db')
const Blog = require('../models/Blog')
const User = require('../models/User')
const slugify = require('slugify')

async function run() {
  await connectDB()
  console.log('Seeding blogs...')

  const author = await User.findOne({ email: 'admin@beanie.local' }) || await User.findOne()
  if (!author) { console.error('No user found; run seed-users.js'); process.exit(1) }

  const blogs = [
    {
      title: 'How to Cup Like a Pro: A Practical Guide',
      excerpt: 'Step-by-step cupping method, scoring tips and vocabulary to sharpen your palate.',
      content: '<h2>Introduction</h2><p>...full content...</p>',
      tags: ['cupping','sensory'],
      featured: false
    },
    {
      title: 'Sustainability in Coffee: Practical Steps for Roasters and Buyers',
      excerpt: 'How traceability, long-term contracts and farmer partnerships create better coffee and fairer livelihoods.',
      content: '<h2>Why sustainability matters</h2><p>...full content...</p>',
      tags: ['sustainability','origins'],
      featured: true
    }
    // add more blog posts here (or call your existing seed-full-blogs)
  ]

  for (const b of blogs) {
    const slug = slugify(b.title, { lower: true, strict: true }).slice(0,200)
    const exists = await Blog.findOne({ slug })
    if (exists) { console.log(`Skipping: ${b.title}`); continue }
    const doc = new Blog({
      title: b.title,
      slug,
      excerpt: b.excerpt,
      content: b.content,
      tags: b.tags,
      featured: !!b.featured,
      author: author._id
    })
    await doc.save()
    console.log(`Inserted blog: ${b.title}`)
  }

  console.log('Blogs seeded.')
  process.exit(0)
}
run().catch(err=>{ console.error(err); process.exit(1) })