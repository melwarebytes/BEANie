// backend/models/Encyclopedia.js
const mongoose = require('mongoose')

const EncyclopediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String },
  body: { type: String }, // sanitized HTML
  tags: [String],
  type: { type: String, enum: ['origin','method','equipment','science'], default: 'origin' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meta: { type: Object }
}, { timestamps: true, collection: 'encyclopedias' })

module.exports = mongoose.model('Encyclopedia', EncyclopediaSchema)