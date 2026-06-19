const db = require('../lib/db');
const { query } = db;

async function ensureSlotsForDate(dateString) {
  try {
    // Check if slots already exist for this date
    const check = await query('SELECT count(*) FROM slots WHERE date = $1', [dateString]);
    
    if (parseInt(check.rows[0].count) > 0) {
      return; // Slots already exist
    }

    console.log(`Auto-seeding slots for ${dateString}...`);
    const startTime = 6; // 6 AM
    const endTime = 23; // 11 PM
    const price = parseFloat(process.env.DEFAULT_SLOT_PRICE || '1000.00');

    for (let hour = startTime; hour < endTime; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;

      await query(
        'INSERT INTO slots (date, start_time, end_time, price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [dateString, start, end, price]
      );
    }
  } catch (error) {
    console.error(`Error auto-seeding for ${dateString}:`, error);
  }
}

module.exports = { ensureSlotsForDate };
