require('dotenv').config();
const { query } = require('../lib/db');

async function migrate() {
  try {
    console.log('Running Settings Table Migration...');

    // 1. Create settings table
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        turf_name VARCHAR(255) NOT NULL DEFAULT 'Runmakers Arena Box Cricket',
        turf_address TEXT NOT NULL DEFAULT 'Infront of Omfed Plant, Railway Station Rd, Chowk, Bankobija, Jeypore, Odisha 764002',
        turf_google_maps TEXT NOT NULL DEFAULT 'https://www.google.com/maps/place/Runmakers+Arena+Box+Cricket/data=!4m2!3m1!1s0x0:0x453d498e3c55270?sa=X&ved=1t:2428&hl=en-IN&ictx=111',
        turf_phone VARCHAR(50) NOT NULL DEFAULT 'N/A',
        turf_email VARCHAR(255) NOT NULL DEFAULT 'contact@runmakers.com',
        opening_time VARCHAR(5) NOT NULL DEFAULT '06:00',
        closing_time VARCHAR(5) NOT NULL DEFAULT '23:00',
        default_slot_price DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
        upi_id VARCHAR(255) NOT NULL DEFAULT 'owner@upi',
        upi_name VARCHAR(255) NOT NULL DEFAULT 'Turf Owner',
        payment_mode VARCHAR(20) NOT NULL DEFAULT 'upi',
        booking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        turf_description TEXT,
        turf_logo_url VARCHAR(500),
        turf_banner_url VARCHAR(500),
        whatsapp_number VARCHAR(20),
        instagram_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Check if a settings row already exists
    const check = await query('SELECT count(*) FROM settings');
    if (parseInt(check.rows[0].count, 10) === 0) {
      console.log('No settings row found. Initializing setting row...');
      
      // Load current environment configuration if present to bootstrap setting values
      const turfName = process.env.TURF_NAME || 'Runmakers Arena Box Cricket';
      const turfAddress = process.env.TURF_ADDRESS || 'Infront of Omfed Plant, Railway Station Rd, Chowk, Bankobija, Jeypore, Odisha 764002';
      const turfGoogleMaps = process.env.TURF_GOOGLE_MAPS || 'https://www.google.com/maps/place/Runmakers+Arena+Box+Cricket/data=!4m2!3m1!1s0x0:0x453d498e3c55270?sa=X&ved=1t:2428&hl=en-IN&ictx=111';
      const openingTime = process.env.TURF_OPEN_TIME || '06:00';
      const closingTime = process.env.TURF_CLOSE_TIME || '23:00';
      const defaultSlotPrice = parseFloat(process.env.DEFAULT_SLOT_PRICE || '1000.00');
      const upiId = process.env.UPI_ID || 'owner@upi';
      const upiName = process.env.UPI_NAME || 'Turf Owner';
      const paymentMode = process.env.PAYMENT_MODE || 'upi';

      await query(`
        INSERT INTO settings (
          id, turf_name, turf_address, turf_google_maps, opening_time, closing_time, 
          default_slot_price, upi_id, upi_name, payment_mode, booking_enabled
        ) VALUES (
          1, $1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE
        )
      `, [turfName, turfAddress, turfGoogleMaps, openingTime, closingTime, defaultSlotPrice, upiId, upiName, paymentMode]);

      console.log('Successfully bootstrapped settings row in database!');
    } else {
      console.log('Settings row already exists. Skipping initialization.');
    }

    console.log('Settings migration completed.');
  } catch (err) {
    console.error('Error running settings migration:', err);
  } finally {
    process.exit();
  }
}

migrate();
