const mongoose = require('mongoose')

module.exports = async function connectDB(){
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI not set in .env')
    process.exit(1)
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('Failed to connect MongoDB', err.message)
    process.exit(1)
  }
}