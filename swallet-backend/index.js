// index.js

require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();
const pool = require('./config/db'); // Updated path to db.js

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Test route to check if server is running
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
