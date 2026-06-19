require('dotenv').config();
const { query } = require('../lib/db');

async function updateDbForUPI() {
  try {
    console.log('Updating database for UPI workflow...');
    
    // 1. Add status to bookings (pending, confirmed, cancelled)
    await query(`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'confirmed';
    `);

    // 2. Add transaction_id (UTR) to bookings
    await query(`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(50);
    `);

    // 3. Update slots to handle 'pending' state if we want to block them
    // For now, we'll keep using is_booked, but we'll mark it true even for pending
    // so no one else can pick it while it's being reviewed.

    console.log('Database updated successfully.');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    process.exit();
  }
}

updateDbForUPI();
