import { NextResponse } from 'next/server';
import db from '@/lib/db';
const { query } = db;
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { formatLocalDateString } from '@/lib/date-utils';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid JSON request body' }, { status: 400 });
    }

    const { action } = body;

    if (action === 'create-order') {
      const { slotIds } = body;
      if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
        return NextResponse.json({ success: false, message: 'Slot IDs are required' }, { status: 400 });
      }

      if (!slotIds.every(id => Number.isInteger(Number(id)))) {
        return NextResponse.json({ success: false, message: 'Invalid slot IDs format' }, { status: 400 });
      }

      // Check slot pricing and availability
      const placeholders = slotIds.map((_, i) => `$${i + 1}`).join(',');
      const slotsResult = await query(
        `SELECT s.id, s.price,
                EXISTS (
                  SELECT 1 FROM bookings b 
                  WHERE b.slot_id = s.id AND b.status IN ('pending', 'confirmed')
                ) AS is_booked
         FROM slots s 
         WHERE s.id IN (${placeholders})`,
        slotIds
      );

      if (slotsResult.rows.length !== slotIds.length) {
        return NextResponse.json({ success: false, message: 'Some slots were not found' }, { status: 404 });
      }

      // Prevent booking already booked slots
      for (const slot of slotsResult.rows) {
        if (slot.is_booked) {
          return NextResponse.json({ success: false, message: 'One or more slots are already booked' }, { status: 400 });
        }
      }

      // Compute total price
      const totalPrice = slotsResult.rows.reduce((sum, s) => sum + parseFloat(s.price), 0);
      const amountInPaise = Math.round(totalPrice * 100);

      // Create Razorpay Order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${crypto.randomBytes(4).toString('hex')}`,
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        }
      });
    }

    if (action === 'verify-payment') {
      const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        slotIds,
        customerName,
        phone
      } = body;

      // 1. Basic validation
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !slotIds || !Array.isArray(slotIds) || slotIds.length === 0 || !customerName || !phone) {
        return NextResponse.json({ success: false, message: 'Missing required validation fields' }, { status: 400 });
      }

      // 2. Name validation & sanitization
      const sanitizedName = String(customerName).trim().replace(/<[^>]*>/g, '');
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        return NextResponse.json({ success: false, message: 'Customer Name must be between 2 and 50 characters.' }, { status: 400 });
      }

      // 3. Phone validation
      const cleanedPhone = String(phone).trim().replace(/\s+/g, '').replace(/[-()]/g, '');
      const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        return NextResponse.json({ success: false, message: 'Invalid Indian mobile number. Must be a valid 10-digit number.' }, { status: 400 });
      }

      // 4. Validate Slot IDs format
      if (!slotIds.every(id => Number.isInteger(Number(id)))) {
        return NextResponse.json({ success: false, message: 'Invalid slot IDs format.' }, { status: 400 });
      }

      // 5. Signature verification
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ success: false, message: 'Razorpay signature verification failed. Invalid transaction signature.' }, { status: 400 });
      }

      // Start transaction
      await query('BEGIN');

      // 6. Check slot existence, double booking and past booking check
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

      const now = new Date();
      for (const slot of slotCheck.rows) {
        if (slot.is_booked) {
          await query('ROLLBACK');
          return NextResponse.json({ success: false, message: `Slot starting at ${slot.start_time} is already booked.` }, { status: 400 });
        }

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

      // 7. Verify we don't have duplicate payment id in database
      const pCheck = await query('SELECT booking_group_id FROM bookings WHERE transaction_id = $1 LIMIT 1', [razorpayPaymentId]);
      if (pCheck.rows.length > 0) {
        await query('ROLLBACK');
        return NextResponse.json({ success: false, message: 'This transaction has already been submitted for another booking.' }, { status: 400 });
      }

      // Generate Group ID
      const bookingGroupId = `BK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      // Insert bookings directly as 'confirmed' since payment signature is verified
      for (const slotId of slotIds) {
        await query(
          'INSERT INTO bookings (slot_id, customer_name, phone, booking_group_id, transaction_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
          [slotId, sanitizedName, cleanedPhone, bookingGroupId, razorpayPaymentId, 'confirmed']
        );
      }

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        data: {
          message: 'Booking successfully confirmed via Razorpay.',
          bookingGroupId
        }
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid payment action specified' }, { status: 400 });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Razorpay API error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
