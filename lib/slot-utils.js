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

    const values = [];
    const params = [];
    let paramIndex = 1;

    for (let hour = startTime; hour < endTime; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;

      values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
      params.push(dateString, start, end, price);
      paramIndex += 4;
    }

    if (values.length > 0) {
      await query(
        `INSERT INTO slots (date, start_time, end_time, price) VALUES ${values.join(', ')} ON CONFLICT DO NOTHING`,
        params
      );
    }
  } catch (error) {
    console.error(`Error auto-seeding for ${dateString}:`, error);
  }
}

module.exports = { ensureSlotsForDate };
