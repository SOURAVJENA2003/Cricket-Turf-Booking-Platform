require('dotenv').config();
const { ensureSlotsForDate } = require('../lib/slot-utils');

async function seed() {
  try {
    console.log('Seeding slots for the next 7 days...');
    
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const now = Date.now();
    for (let i = 0; i < 7; i++) {
      const timeInIst = now + i * 24 * 60 * 60 * 1000;
      const dateString = formatter.format(new Date(timeInIst));
      
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
