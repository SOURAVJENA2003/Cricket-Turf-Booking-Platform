require('dotenv').config();
const { ensureSlotsForDate } = require('../lib/slot-utils');

async function seed() {
  try {
    console.log('Seeding slots for the next 7 days...');
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toLocaleDateString('en-CA');
      
      await ensureSlotsForDate(dateString);
    }
    
    console.log('Seeding completed.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    process.exit();
  }
}

seed();
