import db from '@/lib/db';
const { query } = db;
import { ensureSlotsForDate } from '@/lib/slot-utils';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const adminPassword = searchParams.get('adminPassword');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    // Automatically generate slots if they don't exist for the requested date
    await ensureSlotsForDate(date);

    let result;
    if (adminPassword === process.env.ADMIN_PASSWORD) {
      // Admin view: Join with bookings to get customer info
      result = await query(
        `SELECT s.*, b.customer_name, b.phone, b.booking_group_id, b.status, b.transaction_id 
         FROM slots s 
         LEFT JOIN bookings b ON s.id = b.slot_id 
         WHERE s.date = $1 
         ORDER BY s.start_time ASC`,
        [date]
      );
    } else {
      // Public view: Only slot info
      result = await query(
        'SELECT * FROM slots WHERE date = $1 ORDER BY start_time ASC',
        [date]
      );
    }
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
