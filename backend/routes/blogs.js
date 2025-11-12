// backend/routes/blogs.js
const express = require('express')
const { body, validationResult } = require('express-validator')
const sanitizeHtml = require('sanitize-html')
const slugify = require('slugify')
const Blog = require('../models/Blog')
const auth = require('../middleware/auth')

const router = express.Router()

// GET /api/blogs  (supports ?search=, ?featured=true, ?count=true)
router.get('/', async (req, res) => {
  try {
    const { search, featured, count } = req.query
    const filter = {}
    if (featured === 'true' || featured === '1') filter.featured = true
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { excerpt: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ]
    if (count === 'true' || req.query.count === '1') {
      const c = await Blog.countDocuments(filter)
      return res.json({ count: c })
    }
    const items = await Blog.find(filter).sort({ featured: -1, createdAt: -1 }).limit(200).lean()
    res.json(items)
  } catch (err) {
    console.error('blogs list error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/blogs/featured
router.get('/featured', async (req, res) => {
  try {
    const items = await Blog.find({ featured: true }).sort({ createdAt: -1 }).limit(10).lean()
    res.json(items)
  } catch (err) {
    console.error('blogs featured error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/blogs/:id
router.get('/:id', async (req, res) => {
  try {
    const b = await Blog.findById(req.params.id).lean()
    if (!b) return res.status(404).json({ message: 'Not found' })
    res.json(b)
  } catch (err) {
    console.error('blog detail error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/blogs (protected)
router.post('/', auth, [
  body('title').isLength({ min: 3 }).trim(),
  body('content').isString().isLength({ min: 3 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { title, content, excerpt, tags, featured } = req.body
    const clean = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','figure','figcaption']),
      allowedAttributes: { a:['href','target','rel'], img:['src','alt','width','height'] },
      allowedSchemes: ['http','https','data']
    })
    const slug = slugify(title, { lower: true, strict: true }).slice(0,200)
    const blog = new Blog({
      title,
      slug,
      excerpt: excerpt || clean.replace(/<[^>]+>/g, '').slice(0,200),
      content: clean,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []),
      featured: !!featured,
      author: req.user.id
    })
    await blog.save()
    res.json(blog)
  } catch (err) {
    console.error('blog create error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router