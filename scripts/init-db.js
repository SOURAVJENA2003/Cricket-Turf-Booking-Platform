require('dotenv').config();
const { Client } = require('pg');
const { query } = require('../lib/db');

async function initDb() {
  // First, connect to default 'postgres' database to create the new database
  const connectionString = process.env.DATABASE_URL;
  const dbName = connectionString.split('/').pop().split('?')[0];
  const baseUrl = connectionString.substring(0, connectionString.lastIndexOf('/'));
  const useSsl = /neon\.tech/i.test(connectionString);
  
  const client = new Client({
    connectionString: `${baseUrl}/postgres`,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  try {
    console.log(`Checking for database "${dbName}"...`);
    await client.connect();
    
    // Check if DB exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" not found. Creating it...`);
      // Cannot create database inside a transaction or with parameterized query in some cases
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
    await client.end();

    // Now connect to the new database and create tables
    console.log('Creating tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        start_time VARCHAR(5) NOT NULL,
        end_time VARCHAR(5) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        is_booked BOOLEAN DEFAULT FALSE,
        UNIQUE(date, start_time)
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        slot_id INTEGER UNIQUE REFERENCES slots(id) ON DELETE CASCADE,
        customer_name VARCHAR(255),
        phone VARCHAR(20),
        booking_group_id VARCHAR(50),
        transaction_id VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error during database initialization:', err);
    if (client) await client.end();
  } finally {
    process.exit();
  }
}

initDb();
