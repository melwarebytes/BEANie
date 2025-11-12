// backend/routes/encyclopedia.js
const express = require('express')
const { body, validationResult } = require('express-validator')
const sanitizeHtml = require('sanitize-html')
const slugify = require('slugify')
const Encyclopedia = require('../models/Encyclopedia')
const auth = require('../middleware/auth')

const router = express.Router()

// GET /api/encyclopedia (supports ?search=, ?type=, ?count=true)
router.get('/', async (req, res) => {
  try {
    const { search, type, count } = req.query
    const filter = {}
    if (type) filter.type = type
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { summary: new RegExp(search, 'i') },
      { body: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ]
    if (count === 'true' || req.query.count === '1') {
      const c = await Encyclopedia.countDocuments(filter)
      return res.json({ count: c })
    }
    const items = await Encyclopedia.find(filter).sort({ createdAt: -1 }).limit(500).lean()
    res.json(items)
  } catch (err) {
    console.error('encyclopedia list error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/encyclopedia/featured
router.get('/featured', async (req, res) => {
  try {
    const items = await Encyclopedia.find({}).sort({ createdAt: -1 }).limit(10).lean()
    res.json(items)
  } catch (err) {
    console.error('encyclopedia featured error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/encyclopedia/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Encyclopedia.findById(req.params.id).lean()
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  } catch (err) {
    console.error('encyclopedia detail error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/encyclopedia (protected)
router.post('/', auth, [
  body('title').isLength({ min: 3 }).trim(),
  body('body').isString().isLength({ min: 3 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { title, body, summary, tags, type } = req.body
    const clean = sanitizeHtml(body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','figure','figcaption']),
      allowedAttributes: { a:['href','target','rel'], img:['src','alt','width','height'] },
      allowedSchemes: ['http','https','data']
    })
    const slug = slugify(title, { lower: true, strict: true }).slice(0,200)
    const enc = new Encyclopedia({
      title,
      slug,
      summary: summary || clean.replace(/<[^>]+>/g, '').slice(0,200),
      body: clean,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []),
      type: type || 'origin',
      author: req.user.id
    })
    await enc.save()
    res.json(enc)
  } catch (err) {
    console.error('encyclopedia create error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router