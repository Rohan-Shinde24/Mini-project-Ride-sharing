module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  
  if (!req.user) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
  }

  next();
};
