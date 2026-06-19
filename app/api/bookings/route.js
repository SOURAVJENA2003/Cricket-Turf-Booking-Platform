import db from '@/lib/db';
const { query } = db;
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { slotIds, customerName, phone, transactionId } = await request.json();

    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0 || !customerName || !phone || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start a transaction
    await query('BEGIN');

    // Check if any slot is already booked
    const placeholders = slotIds.map((_, i) => `$${i + 1}`).join(',');
    const slotCheck = await query(`SELECT id, is_booked FROM slots WHERE id IN (${placeholders})`, slotIds);
    
    if (slotCheck.rows.length !== slotIds.length) {
      await query('ROLLBACK');
      return NextResponse.json({ error: 'Some slots were not found' }, { status: 404 });
    }

    if (slotCheck.rows.some(s => s.is_booked)) {
      await query('ROLLBACK');
      return NextResponse.json({ error: 'One or more slots are already booked or pending' }, { status: 400 });
    }

    // Generate a unique Group ID
    const bookingGroupId = `BK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create bookings with 'pending' status
    for (const slotId of slotIds) {
      await query(
        'INSERT INTO bookings (slot_id, customer_name, phone, booking_group_id, transaction_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [slotId, customerName, phone, bookingGroupId, transactionId, 'pending']
      );
      // Update slots to block others
      await query('UPDATE slots SET is_booked = TRUE WHERE id = $1', [slotId]);
    }

    await query('COMMIT');

    return NextResponse.json({
      message: 'Booking request submitted. Waiting for admin approval.',
      bookingGroupId: bookingGroupId
    }, { status: 201 });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { bookingIds, phone } = await request.json();

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0 || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start transaction
    await query('BEGIN');

    // Verify bookings
    const placeholders = bookingIds.map((_, i) => `$${i + 1}`).join(',');
    const bookings = await query(
      `SELECT id, slot_id FROM bookings WHERE id IN (${placeholders}) AND phone = $${bookingIds.length + 1}`,
      [...bookingIds, phone]
    );

    if (bookings.rows.length !== bookingIds.length) {
      await query('ROLLBACK');
      return NextResponse.json({ error: 'Some bookings were not found or incorrect phone number' }, { status: 404 });
    }

    // Delete bookings and update slots
    for (const booking of bookings.rows) {
      await query('DELETE FROM bookings WHERE id = $1', [booking.id]);
      await query('UPDATE slots SET is_booked = FALSE WHERE id = $1', [booking.slot_id]);
    }

    await query('COMMIT');

    return NextResponse.json({ message: 'Cancellation successful' });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Cancellation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('groupId');
  const phone = searchParams.get('phone');

  if (!groupId || !phone) {
    return NextResponse.json({ error: 'Missing Group ID or Phone' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT b.id as booking_id, s.date, s.start_time, s.end_time, s.price 
       FROM bookings b 
       JOIN slots s ON b.slot_id = s.id 
       WHERE b.booking_group_id = $1 AND b.phone = $2`,
      [groupId, phone]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch group error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
