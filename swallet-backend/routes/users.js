// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path to your db config

// GET /api/users - Returns a list of all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, profile_icon FROM users');
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
