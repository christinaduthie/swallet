// init_db.js

require('dotenv').config();
const pool = require('./config/db');
const fs = require('fs');

const sql = fs.readFileSync('create_users_table.sql').toString();

pool.query(sql)
  .then(() => {
    console.log('Users table created successfully.');
    pool.end();
  })
  .catch((err) => {
    console.error('Error creating users table:', err);
    pool.end();
  });
