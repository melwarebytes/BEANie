// backend/models/Blog.js
const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String },
  content: { type: String }, // sanitized HTML
  tags: [String],
  featured: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meta: { type: Object }
}, { timestamps: true, collection: 'blogs' }) // explicit collection name

module.exports = mongoose.model('Blog', BlogSchema)