import db from '@/lib/db';
const { query } = db;
import { ensureSlotsForDate } from '@/lib/slot-utils';
import { NextResponse } from 'next/server';
import { getSessionCookie, verifyToken } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ success: false, message: 'Date is required' }, { status: 400 });
  }

  try {
    // Automatically generate slots if they don't exist for the requested date
    await ensureSlotsForDate(date);

    // Verify session via cookie
    const token = getSessionCookie(request);
    const verified = await verifyToken(token);

    let result;
    if (verified) {
      // Admin view: Join with bookings to get customer info of active bookings
      result = await query(
        `SELECT s.id, s.date, s.start_time, s.end_time, s.price,
                (b.id IS NOT NULL) AS is_booked,
                b.customer_name, b.phone, b.booking_group_id, b.status, b.transaction_id 
         FROM slots s 
         LEFT JOIN bookings b ON s.id = b.slot_id AND b.status IN ('pending', 'confirmed')
         WHERE s.date = $1 
         ORDER BY s.start_time ASC`,
        [date]
      );
    } else {
      // Public view: Derive is_booked dynamically based on whether there are pending or confirmed bookings
      result = await query(
        `SELECT s.id, s.date, s.start_time, s.end_time, s.price,
                EXISTS (
                  SELECT 1 FROM bookings b 
                  WHERE b.slot_id = s.id AND b.status IN ('pending', 'confirmed')
                ) AS is_booked
         FROM slots s 
         WHERE s.date = $1 
         ORDER BY s.start_time ASC`,
        [date]
      );
    }
    
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
