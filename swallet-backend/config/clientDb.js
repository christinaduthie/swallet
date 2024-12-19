const { Pool } = require('pg');

const clientDbPool = new Pool({
  connectionString: process.env.CLIENT_DATABASE_URL,
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = clientDbPool;
