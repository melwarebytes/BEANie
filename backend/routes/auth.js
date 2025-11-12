const express = require('express')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// POST /api/auth/register
router.post('/register', [
  body('name').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    user = new User({ name, email, password: hashed })
    await user.save()

    const payload = { id: user.id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('register error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const payload = { id: user.id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    console.error('login error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me
const auth = require('../middleware/auth')
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.profile may be available from middleware fetch; otherwise fetch fresh
    if (req.user?.profile) return res.json(req.user.profile)
    const user = await User.findById(req.user.id).select('-password')
    return res.json(user)
  } catch (err) {
    console.error('me error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router