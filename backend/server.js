require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const connectDB = require('./config/db')
const path = require('path')

const app = express()
connectDB()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' })) // allow JSON bodies

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/articles', require('./routes/articles'))
app.use('/api/beans', require('./routes/beans'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/blogs', require('./routes/blogs'))
app.use('/api/encyclopedia', require('./routes/encyclopedia'))
app.use('/api/logs', require('./routes/logs'))



app.get('/', (req, res) => res.send('BEANie API'))

// basic error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))