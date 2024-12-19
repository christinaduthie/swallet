const express = require('express');
const router = express.Router();
const db = require('../config/db'); 


router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name,email, phone, wallet_id, profile_icon FROM users');
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/check/:swalletId', async (req, res) => {
    const { swalletId } = req.params;
    try {
      const result = await db.query(
        'SELECT id, name, wallet_id FROM users WHERE wallet_id = $1',
        [swalletId]
      );
      if (result.rows.length > 0) {
        return res.json({ exists: true, user: result.rows[0] });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking swalletId:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  
module.exports = router;
