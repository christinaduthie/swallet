// routes/auth.js
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, pin } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password and PIN
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    let pinHash = null;

    if (pin) {
      pinHash = await bcrypt.hash(pin, saltRounds);
    }

    // Insert new user into the database
    await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, pin_hash) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, passwordHash, pinHash]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
      const { emailOrPhone, passwordOrPin } = req.body;
  
      // Find user by email or phone
      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR phone = $1',
        [emailOrPhone]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      const user = userResult.rows[0];
  
      // Compare password and PIN
      const isPasswordMatch = await bcrypt.compare(
        passwordOrPin,
        user.password_hash
      );
  
      let isPinMatch = false;
      if (user.pin_hash) {
        isPinMatch = await bcrypt.compare(passwordOrPin, user.pin_hash);
      }
  
      if (!isPasswordMatch && !isPinMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token, message: 'Login successful.' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
module.exports = router;
