require('dotenv').config();
const { query } = require('../lib/db');

async function migrateCancellation() {
  try {
    console.log('Starting cancellation architecture migration...');

    // 1. Drop the legacy unique constraint on slot_id
    console.log('Dropping bookings_slot_id_key constraint...');
    await query(`
      ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_slot_id_key;
    `);

    // 2. Create the partial unique index to allow only one active booking per slot
    console.log('Creating idx_active_bookings_per_slot partial unique index...');
    await query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_active_bookings_per_slot 
      ON bookings (slot_id) 
      WHERE status IN ('pending', 'confirmed');
    `);

    // 3. Drop the redundant is_booked column from slots table
    console.log('Dropping redundant is_booked column from slots table...');
    await query(`
      ALTER TABLE slots DROP COLUMN IF EXISTS is_booked;
    `);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit();
  }
}

migrateCancellation();
