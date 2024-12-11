const express = require('express');
const bcrypt = require('bcryptjs');
const { pool, poolConnect } = require('../config/db');
const { generateToken } = require('../utils/token');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input('username', username)
      .query('SELECT id, password FROM Users WHERE username = @username');

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    // Store token in the database
    await pool
      .request()
      .input('userId', user.id)
      .input('token', token)
      .input('expiresAt', new Date(Date.now() + 60 * 60 * 1000)) // 1 hour
      .query(
        'INSERT INTO Sessions (userId, token, expiresAt) VALUES (@userId, @token, @expiresAt)'
      );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
  
    try {
      await poolConnect;
  
      await pool.request().input('token', token).query('DELETE FROM Sessions WHERE token = @token');
  
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
module.exports = router;
