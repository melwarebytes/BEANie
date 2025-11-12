const mongoose = require('mongoose')

const BeanSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  origin: { type: String },
  notes: { type: String },
  process: { type: String },
  variety: { type: String },
  altitude: { type: String },
  metadata: { type: Object }
}, { timestamps: true })

module.exports = mongoose.model('Bean', BeanSchema)