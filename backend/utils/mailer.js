const nodemailer = require('nodemailer')

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const FROM_EMAIL = process.env.FROM_EMAIL || 'BEANie <noreply@beanie.local>'

let transporter = null
if (SMTP_HOST && SMTP_PORT) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  })
  transporter.verify().then(()=>console.log('Mailer ready')).catch(err=>console.warn('Mailer verify failed', err.message))
} else {
  console.log('No SMTP configured — mailer will log emails to console')
}

// Simple in-memory queue
const queue = []
let processing = false

async function processQueue() {
  if (processing) return
  processing = true
  while (queue.length) {
    const job = queue.shift()
    try {
      if (transporter) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: job.to,
          subject: job.subject,
          html: job.html,
          text: job.text
        })
        console.log(`Mail sent to ${job.to} subject="${job.subject}"`)
      } else {
        console.log('--- MAIL (no SMTP):', job)
      }
    } catch (err) {
      console.error('Mail send failed, retrying later', err.message)
      // simple retry strategy: push back with a delay
      setTimeout(() => queue.push(job), 5000)
    }
    // brief pause between jobs
    await new Promise(r => setTimeout(r, 200))
  }
  processing = false
}

function enqueueMail({ to, subject, html, text }) {
  queue.push({ to, subject, html, text })
  // kick the queue
  processQueue().catch(err => console.error('processQueue error', err))
}

module.exports = { enqueueMail }