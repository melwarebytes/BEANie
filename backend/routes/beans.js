const express = require('express')
const { body, validationResult } = require('express-validator')
const slugify = require('slugify')
const Bean = require('../models/Bean')
const auth = require('../middleware/auth')

const router = express.Router()

// GET /api/beans
// supports ?count=true
router.get('/', async (req, res) => {
  try {
    const { count } = req.query
    if (count === 'true' || req.query.count === '1') {
      const c = await Bean.countDocuments()
      return res.json({ count: c })
    }
    const items = await Bean.find().sort({ createdAt: -1 }).limit(500).lean()
    res.json(items)
  } catch (err) {
    console.error('beans list error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/beans/:id
router.get('/:id', async (req, res) => {
  try {
    const b = await Bean.findById(req.params.id).lean()
    if (!b) return res.status(404).json({ message: 'Not found' })
    res.json(b)
  } catch (err) {
    console.error('bean detail error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/beans (protected)
router.post('/', auth, [
  body('name').isLength({ min: 2 }).trim()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { name, origin, notes, process, variety, altitude } = req.body
    const slug = slugify(name, { lower: true, strict: true }).slice(0,200)
    const bean = new Bean({ name, slug, origin, notes, process, variety, altitude, metadata: {} })
    await bean.save()
    res.json(bean)
  } catch (err) {
    console.error('bean create error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router