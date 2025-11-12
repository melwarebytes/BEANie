const express = require('express')
const { body, validationResult } = require('express-validator')
const sanitizeHtml = require('sanitize-html')
const slugify = require('slugify')
const Article = require('../models/Article')
const auth = require('../middleware/auth')

const router = express.Router()

// GET /api/articles
// supports ?search=, ?type=blog, ?featured=true, ?count=true
router.get('/', async (req, res) => {
  try {
    const { search, type, featured, count } = req.query

    const filter = {}
    if (type) filter.type = type
    if (featured === 'true' || featured === '1') filter.featured = true
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { excerpt: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ]

    if (count === 'true' || req.query.count === '1') {
      const c = await Article.countDocuments(filter)
      return res.json({ count: c })
    }

    const items = await Article.find(filter).sort({ featured: -1, createdAt: -1 }).limit(100).lean()
    return res.json(items)
  } catch (err) {
    console.error('articles list error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/articles/featured (alias)
router.get('/featured', async (req, res) => {
  try {
    const items = await Article.find({ featured: true }).sort({ createdAt: -1 }).limit(10).lean()
    res.json(items)
  } catch (err) {
    console.error('featured error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/articles/:id
router.get('/:id', async (req, res) => {
  try {
    const a = await Article.findById(req.params.id).lean()
    if (!a) return res.status(404).json({ message: 'Not found' })
    res.json(a)
  } catch (err) {
    console.error('article detail error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/articles (protected)
router.post('/', auth, [
  body('title').isLength({ min: 3 }).trim(),
  body('content').isString().isLength({ min: 3 }),
  body('excerpt').optional().isString(),
  body('tags').optional()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { title, content, excerpt, tags, type, featured } = req.body

    // sanitize HTML: allow safe tags and attributes
    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h1', 'h2', 'h3', 'figure', 'figcaption' ]),
      allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height']
      },
      allowedSchemes: ['http', 'https', 'data']
    })

    const slug = slugify(title, { lower: true, strict: true }).slice(0, 200)

    const article = new Article({
      title,
      slug,
      excerpt: excerpt || (cleanContent ? cleanContent.replace(/<[^>]+>/g, '').slice(0, 200) : ''),
      content: cleanContent,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []),
      type: type || 'article',
      featured: !!featured,
      author: req.user.id
    })
    await article.save()
    res.json(article)
  } catch (err) {
    console.error('article create error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router