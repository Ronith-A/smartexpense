const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies the token from the Authorization header and attaches user id to req.user
 */
module.exports = function authMiddleware(req, res, next) {
  const header = req.header('Authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = header.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
