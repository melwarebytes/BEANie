const express = require('express')
const { body, validationResult } = require('express-validator')
const { enqueueMail } = require('../utils/mailer')

const router = express.Router()

// POST /api/contact
router.post('/', [
  body('name').isLength({ min: 1 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('message').isLength({ min: 3 }).trim()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { name, email, message } = req.body

    const subject = `Contact form from ${name}`
    const html = `<p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <hr/>
                  <p>${message.replace(/\n/g, '<br/>')}</p>`
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`

    // enqueue to be sent (returns immediately)
    enqueueMail({ to: process.env.FROM_EMAIL || email, subject, html, text })

    return res.json({ message: 'Message received. We will get back to you.' })
  } catch (err) {
    console.error('contact error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router