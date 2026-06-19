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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slotId, status } = await request.json();

    if (!slotId || !status) {
      return NextResponse.json({ error: 'Slot ID and Status are required' }, { status: 400 });
    }

    await query('UPDATE bookings SET status = $1 WHERE slot_id = $2', [status, slotId]);

    return NextResponse.json({ message: `Booking status updated to ${status}` });
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slotId } = await request.json();

    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }

    await query('BEGIN');

    const slotCheck = await query('SELECT is_booked FROM slots WHERE id = $1', [slotId]);
    if (slotCheck.rows.length === 0) {
      await query('ROLLBACK');
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    // Admin can override or just mark as booked
    await query(
      'INSERT INTO bookings (slot_id, customer_name, phone) VALUES ($1, $2, $3) ON CONFLICT (slot_id) DO NOTHING',
      [slotId, 'Admin (Offline)', 'N/A']
    );

    await query('UPDATE slots SET is_booked = TRUE WHERE id = $1', [slotId]);

    await query('COMMIT');

    return NextResponse.json({ message: 'Slot marked as booked by Admin' });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Admin booking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slotId } = await request.json();

    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }

    await query('BEGIN');

    await query('DELETE FROM bookings WHERE slot_id = $1', [slotId]);
    await query('UPDATE slots SET is_booked = FALSE WHERE id = $1', [slotId]);

    await query('COMMIT');

    return NextResponse.json({ message: 'Slot cleared by Admin' });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Admin clear error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
