require('dotenv').config();
const { query } = require('../lib/db');

async function updatePrices() {
  const newPrice = 20.00; // Change this value to your desired price

  try {
    console.log(`Updating all existing slots to ₹${newPrice}...`);
    
    await query('UPDATE slots SET price = $1', [newPrice]);

    console.log('Successfully updated all existing slot prices!');
  } catch (err) {
    console.error('Error updating prices:', err);
  } finally {
    process.exit();
  }
}

updatePrices();
