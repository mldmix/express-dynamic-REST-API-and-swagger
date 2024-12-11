const jwt = require('jsonwebtoken');

const SECRET_KEY = 'CASECACOBATPH'; // Use a secure key and store it in env variables

// Generate a JWT token
const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // 1-hour expiration
};

// Verify a JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
