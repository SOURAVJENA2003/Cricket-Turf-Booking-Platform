import db from '@/lib/db';
const { query } = db;
import { NextResponse } from 'next/server';
import { getSessionCookie, verifyToken } from '@/lib/auth';

// Helper to authenticate requests in this endpoint
async function isAuthenticated(request) {
  const token = getSessionCookie(request);
  const verified = await verifyToken(token);
  return !!verified;
}

export async function PATCH(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { slotId, status } = await request.json();

    if (!slotId || !status) {
      return NextResponse.json({ success: false, message: 'Slot ID and Status are required' }, { status: 400 });
    }

    // Only update pending active bookings for that slot
    await query(
      "UPDATE bookings SET status = $1 WHERE slot_id = $2 AND status = 'pending'",
      [status, slotId]
    );

    return NextResponse.json({
      success: true,
      data: {
        message: `Booking status updated to ${status}`
      }
    });
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { slotId } = await request.json();

    if (!slotId) {
      return NextResponse.json({ success: false, message: 'Slot ID is required' }, { status: 400 });
    }

    await query('BEGIN');

    // Check if slot exists and is not already booked (deriving dynamically)
    const slotCheck = await query(
      `SELECT id, 
              EXISTS (
                SELECT 1 FROM bookings 
                WHERE slot_id = $1 AND status IN ('pending', 'confirmed')
              ) AS is_booked
       FROM slots WHERE id = $1`,
      [slotId]
    );

    if (slotCheck.rows.length === 0) {
      await query('ROLLBACK');
      return NextResponse.json({ success: false, message: 'Slot not found' }, { status: 404 });
    }

    if (slotCheck.rows[0].is_booked) {
      await query('ROLLBACK');
      return NextResponse.json({ success: false, message: 'Slot is already booked or pending' }, { status: 400 });
    }

    // Admin marks slot as booked (defaults to 'confirmed' status for offline block)
    await query(
      `INSERT INTO bookings (slot_id, customer_name, phone, status) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (slot_id) WHERE status IN ('pending', 'confirmed') DO NOTHING`,
      [slotId, 'Admin (Offline)', 'N/A', 'confirmed']
    );

    await query('COMMIT');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Slot marked as booked by Admin'
      }
    });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Admin booking error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { slotId } = await request.json();

    if (!slotId) {
      return NextResponse.json({ success: false, message: 'Slot ID is required' }, { status: 400 });
    }

    await query('BEGIN');

    // Admin soft-cancels the slot by changing status to 'cancelled'
    await query(
      `UPDATE bookings 
       SET status = 'cancelled' 
       WHERE slot_id = $1 AND status IN ('pending', 'confirmed')`,
      [slotId]
    );

    await query('COMMIT');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Slot cleared by Admin'
      }
    });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Admin clear error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT b.id, b.slot_id, b.customer_name, b.phone, b.booking_group_id, b.transaction_id, b.status, b.created_at,
              s.date, s.start_time, s.end_time, s.price
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       ORDER BY s.date DESC, s.start_time DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Admin fetch bookings error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
