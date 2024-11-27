// index.js
require('dotenv').config(); // Load environment variables

const authRoutes = require('./routes/auth');


const express = require('express');
const app = express();
const pool = require('./config/db'); // Updated path to db.js
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(cors());
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello, Swallet Backend!');
});

// Route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection error');
  }
});
app.get('/example-endpoint', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
