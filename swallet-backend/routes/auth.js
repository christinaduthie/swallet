const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
  const { name, email, phone, password, pin } = req.body;

  try {
    // Check if the email already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash password and PIN
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const pinHash = await bcrypt.hash(pin, saltRounds);

    // Generate unique wallet ID
    const shortId = uuidv4().split('-')[0]; // Take first segment for shortness
    const walletId = 'SWALLET-' + shortId;
    await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, pin_hash, wallet_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, phone, passwordHash, pinHash, walletId]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user by email
    const result = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user data
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT name, email, phone, wallet_id, profile_icon FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update user profile
router.put('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, profile_icon } = req.body;

    await pool.query(
      'UPDATE users SET name = $1, phone = $2, profile_icon = $3 WHERE id = $4',
      [name, phone, profile_icon, userId]
    );

    // Fetch updated user data
    const result = await pool.query(
      'SELECT name, email, phone, wallet_id, profile_icon FROM users WHERE id = $1',
      [userId]
    );

    res.json({ message: 'Profile updated successfully.', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);

    const user = result.rows[0];

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      newPasswordHash,
      userId,
    ]);

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
router.post('/verify-pin', authenticateToken, async (req, res) => {
     try {
       const userId = req.user.userId;
       const { pin } = req.body;
       if (!pin) {
         return res.status(400).json({ message: 'PIN is required.' });
       }
  
       const userRes = await pool.query('SELECT pin_hash FROM users WHERE id=$1', [userId]);
       if (userRes.rows.length === 0) {
         return res.status(404).json({ message: 'User not found.' });
       }
  
      const pinHash = userRes.rows[0].pin_hash;
      const bcrypt = require('bcrypt');
       const isMatch = await bcrypt.compare(pin, pinHash);
       if (!isMatch) {
         return res.status(401).json({ message: 'Invalid PIN.' });
       }
  
       res.json({ message: 'PIN verified successfully.' });
     } catch (error) {
       console.error('Error verifying PIN:', error);
       res.status(500).json({ message: 'Server error verifying PIN.' });
     }
   });
module.exports = router;
