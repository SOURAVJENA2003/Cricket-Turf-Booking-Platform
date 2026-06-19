require('dotenv').config();
const { query } = require('../lib/db');

async function updateDb() {
  try {
    console.log('Updating bookings table...');
    
    // Add booking_group_id column
    await query(`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_group_id VARCHAR(50);
    `);

    // For existing records, set a dummy group ID if they don't have one
    await query(`
      UPDATE bookings SET booking_group_id = 'GRP-' || id WHERE booking_group_id IS NULL;
    `);

    console.log('Database updated successfully.');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    process.exit();
  }
}

updateDb();
