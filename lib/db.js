const { Pool } = require('pg');

// Ensure environment variables are loaded if not already
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined in environment variables.');
}

const useSsl = connectionString && /neon\.tech/i.test(connectionString);

const pool = new Pool({
  connectionString: connectionString,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

module.exports = {
  query: (text, params) => {
    if (!connectionString) {
      throw new Error('DATABASE_URL is missing. Check your .env file.');
    }
    return pool.query(text, params);
  },
};
