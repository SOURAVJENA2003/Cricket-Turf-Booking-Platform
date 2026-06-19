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
    const settingsResult = await query('SELECT opening_time, closing_time, default_slot_price FROM settings WHERE id = 1');
    let startTime = 6;
    let endTime = 23;
    let price = 1000.00;

    if (settingsResult.rows.length > 0) {
      const s = settingsResult.rows[0];
      startTime = parseInt((s.opening_time || '06:00').split(':')[0], 10);
      endTime = parseInt((s.closing_time || '23:00').split(':')[0], 10);
      price = parseFloat(s.default_slot_price || '1000.00');
    }

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
