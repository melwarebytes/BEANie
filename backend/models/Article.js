const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String },
  content: { type: String }, // sanitized HTML
  tags: [String],
  type: { type: String, enum: ['article', 'blog', 'guide'], default: 'article' },
  featured: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meta: { type: Object }
}, { timestamps: true })

module.exports = mongoose.model('Article', ArticleSchema)