require('dotenv').config();
const { query } = require('../lib/db');

async function addUtrTrigger() {
  try {
    console.log('Adding database-level unique UTR check trigger...');

    // 1. Create or replace the trigger function
    await query(`
      CREATE OR REPLACE FUNCTION check_duplicate_utr()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Ignore offline admin bookings and check for UTR duplicates
        IF NEW.transaction_id IS NOT NULL AND NEW.transaction_id != '' AND NEW.customer_name != 'Admin (Offline)' THEN
          IF EXISTS (
            SELECT 1 FROM bookings 
            WHERE transaction_id = NEW.transaction_id 
              AND booking_group_id IS DISTINCT FROM NEW.booking_group_id
          ) THEN
            RAISE EXCEPTION 'Duplicate UTR submission: UTR % has already been used in another booking group', NEW.transaction_id;
          END IF;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 2. Drop the trigger if it already exists to avoid duplicate errors
    await query(`
      DROP TRIGGER IF EXISTS enforce_unique_utr ON bookings;
    `);

    // 3. Create the trigger
    await query(`
      CREATE TRIGGER enforce_unique_utr
      BEFORE INSERT OR UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION check_duplicate_utr();
    `);

    console.log('Database trigger created successfully.');
  } catch (err) {
    console.error('Error creating database trigger:', err);
  } finally {
    process.exit();
  }
}

addUtrTrigger();
