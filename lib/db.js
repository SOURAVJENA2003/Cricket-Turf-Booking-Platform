require('./env-validator');
const { Pool, types } = require('pg');

// Keep PostgreSQL DATE columns as raw YYYY-MM-DD strings so booking dates
// never shift a day when they cross JSON or timezone boundaries.
types.setTypeParser(1082, (value) => value);

const connectionString = process.env.DATABASE_URL;
const useSsl = connectionString && /neon\.tech/i.test(connectionString);

let pool;
if (!global._postgresPool) {
  global._postgresPool = new Pool({
    connectionString: connectionString,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    max: 1, // Serverless optimizations
    idleTimeoutMillis: 2000,
    connectionTimeoutMillis: 5000,
  });
}
pool = global._postgresPool;

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};

