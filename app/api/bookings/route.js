import db from '@/lib/db';
const { query } = db;
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { formatLocalDateString } from '@/lib/date-utils';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid JSON request body' }, { status: 400 });
    }

    const { slotIds, customerName, phone, transactionId } = body;

    // 1. Check basic presence of fields
    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0 || !customerName || !phone || !transactionId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 2. Clean and Sanitize Customer Name
    const sanitizedName = String(customerName).trim().replace(/<[^>]*>/g, '');
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      return NextResponse.json({ success: false, message: 'Customer Name must be between 2 and 50 characters.' }, { status: 400 });
    }

    // 3. Clean and Validate Phone Number (Indian mobile format: 10 digits, optional country code)
    const cleanedPhone = String(phone).trim().replace(/\s+/g, '').replace(/[-()]/g, '');
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json({ success: false, message: 'Invalid Indian mobile number. Must be a valid 10-digit number.' }, { status: 400 });
    }

    // 4. Validate UPI Transaction UTR format (Exactly 12 digits)
    const cleanedUTR = String(transactionId).trim();
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(cleanedUTR)) {
      return NextResponse.json({ success: false, message: 'Invalid UTR format. UPI transaction ID must be exactly 12 digits.' }, { status: 400 });
    }

    // 5. Validate Slot IDs are integers
    if (!slotIds.every(id => Number.isInteger(Number(id)))) {
      return NextResponse.json({ success: false, message: 'Invalid slot IDs format.' }, { status: 400 });
    }

    // Start a transaction
    await query('BEGIN');

    // 6. Prevent Duplicate UTR Submissions (At the transaction level)
    const utrCheck = await query('SELECT booking_group_id FROM bookings WHERE transaction_id = $1 LIMIT 1', [cleanedUTR]);
    if (utrCheck.rows.length > 0) {
      await query('ROLLBACK');
      return NextResponse.json({ success: false, message: 'This transaction UTR has already been submitted for another booking.' }, { status: 400 });
    }

    // 7. Check if slots exist and get date/time details (derive is_booked dynamically)
    const placeholders = slotIds.map((_, i) => `$${i + 1}`).join(',');
    const slotCheck = await query(
      `SELECT s.id, s.date, s.start_time,
              EXISTS (
                SELECT 1 FROM bookings b 
                WHERE b.slot_id = s.id AND b.status IN ('pending', 'confirmed')
              ) AS is_booked
       FROM slots s 
       WHERE s.id IN (${placeholders})`,
      slotIds
    );
    
    if (slotCheck.rows.length !== slotIds.length) {
      await query('ROLLBACK');
      return NextResponse.json({ success: false, message: 'Some slots were not found in the database.' }, { status: 404 });
    }

    // 8. Prevent Booking Past Slots
    const now = new Date();
    for (const slot of slotCheck.rows) {
      if (slot.is_booked) {
        await query('ROLLBACK');
        return NextResponse.json({ success: false, message: `Slot starting at ${slot.start_time} is already booked.` }, { status: 400 });
      }

      // Convert slot date/time to absolute IST timestamp (UTC +05:30)
      const cleanDateStr = typeof slot.date === 'string' 
        ? slot.date.split('T')[0] 
        : slot.date.toISOString().split('T')[0];
      const slotIsoStr = `${cleanDateStr}T${slot.start_time}:00+05:30`;
      const slotDateTime = new Date(slotIsoStr);

      if (slotDateTime < now) {
        await query('ROLLBACK');
        return NextResponse.json({ success: false, message: `Cannot book slots in the past (Slot: ${slot.start_time} on ${formatLocalDateString(slot.date)}).` }, { status: 400 });
      }
    }

    // Generate a unique Group ID
    const bookingGroupId = `BK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create bookings with 'pending' status (we do not write to slots.is_booked)
    for (const slotId of slotIds) {
      await query(
        'INSERT INTO bookings (slot_id, customer_name, phone, booking_group_id, transaction_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [slotId, sanitizedName, cleanedPhone, bookingGroupId, cleanedUTR, 'pending']
      );
    }

    await query('COMMIT');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Booking request submitted. Waiting for admin approval.',
        bookingGroupId: bookingGroupId
      }
    }, { status: 201 });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Booking error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { bookingIds, phone } = await request.json();

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0 || !phone) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
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
      return NextResponse.json({ success: false, message: 'Some bookings were not found or incorrect phone number' }, { status: 404 });
    }

    // Soft-cancel bookings by updating status to 'cancelled'
    for (const booking of bookings.rows) {
      await query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [booking.id]);
    }

    await query('COMMIT');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Cancellation successful'
      }
    });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Cancellation error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('groupId');
  const phone = searchParams.get('phone');

  if (!groupId || !phone) {
    return NextResponse.json({ success: false, message: 'Missing Group ID or Phone' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT b.id as booking_id, s.date, s.start_time, s.end_time, s.price 
       FROM bookings b 
       JOIN slots s ON b.slot_id = s.id 
       WHERE b.booking_group_id = $1 AND b.phone = $2 AND b.status != 'cancelled'`,
      [groupId, phone]
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch group error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
