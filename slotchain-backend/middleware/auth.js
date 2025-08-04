const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Standard authentication middleware
const auth = async (req, res, next) => {
  try {
    // Supports tokens in "Authorization: Bearer ..." header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // Validate the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based admin middleware (for admin-only routes)
const adminAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

module.exports = { auth, adminAuth };
