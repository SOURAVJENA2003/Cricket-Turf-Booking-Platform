require('dotenv').config();
const { query } = require('../lib/db');

async function migrate() {
  try {
    console.log('Adding advance_booking_price column to settings table...');
    await query('ALTER TABLE settings ADD COLUMN IF NOT EXISTS advance_booking_price DECIMAL(10, 2) NOT NULL DEFAULT 100.00');
    console.log('Successfully migrated database settings table!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit();
  }
}

migrate();
