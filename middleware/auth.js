const { pool, poolConnect } = require('../config/db');
const { verifyToken } = require('../utils/token');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input('token', token)
      .query('SELECT * FROM Sessions WHERE token = @token AND expiresAt > GETDATE()');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Token not found or expired' });
    }

    req.user = { id: decoded.userId }; // Attach user info to the request
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticate;
