const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // attach user id & role
    req.user = { id: decoded.id, role: decoded.role }
    // optionally fetch full user (light)
    try {
      const user = await User.findById(decoded.id).select('-password')
      req.user.profile = user
    } catch (e) {
      // ignore user fetch errors
    }
    next()
  } catch (err) {
    console.error('JWT error', err)
    return res.status(401).json({ message: 'Token is not valid' })
  }
}