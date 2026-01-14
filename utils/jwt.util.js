const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      organization: user.organization
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken
};
