const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get wallet balance
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

   
    const result = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      
      await pool.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [userId, 0.0]);
      return res.json({ balance: 0.0 });
    }

    res.json({ balance: result.rows[0].balance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get wallet transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

   
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;
