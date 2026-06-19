import { NextResponse } from 'next/server';
import db from '@/lib/db';
const { query } = db;
import { getSessionCookie, verifyToken } from '@/lib/auth';

async function isAuthenticated(request) {
  const token = getSessionCookie(request);
  const verified = await verifyToken(token);
  return !!verified;
}

export async function GET(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const result = await query('SELECT * FROM settings WHERE id = 1');
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Settings not initialized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Fetch admin settings error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid JSON request body' }, { status: 400 });
    }

    const {
      turfName,
      turfAddress,
      turfGoogleMaps,
      turfPhone,
      turfEmail,
      openingTime,
      closingTime,
      defaultSlotPrice,
      upiId,
      upiName,
      paymentMode,
      bookingEnabled,
      turfDescription,
      turfLogoUrl,
      turfBannerUrl,
      whatsappNumber,
      instagramUrl
    } = body;

    // Validation
    if (!turfName || !turfAddress || !turfGoogleMaps || !openingTime || !closingTime || defaultSlotPrice === undefined || !upiId || !upiName || !paymentMode) {
      return NextResponse.json({ success: false, message: 'Missing required configuration fields' }, { status: 400 });
    }

    // Hour format validation (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(openingTime) || !timeRegex.test(closingTime)) {
      return NextResponse.json({ success: false, message: 'Opening and Closing times must be in HH:MM format' }, { status: 400 });
    }

    if (isNaN(parseFloat(defaultSlotPrice)) || parseFloat(defaultSlotPrice) < 0) {
      return NextResponse.json({ success: false, message: 'Default slot price must be a valid positive number' }, { status: 400 });
    }

    if (paymentMode !== 'upi' && paymentMode !== 'razorpay') {
      return NextResponse.json({ success: false, message: 'Payment mode must be either "upi" or "razorpay"' }, { status: 400 });
    }

    // Execute settings update atomically
    await query(
      `UPDATE settings 
       SET turf_name = $1,
           turf_address = $2,
           turf_google_maps = $3,
           turf_phone = $4,
           turf_email = $5,
           opening_time = $6,
           closing_time = $7,
           default_slot_price = $8,
           upi_id = $9,
           upi_name = $10,
           payment_mode = $11,
           booking_enabled = $12,
           turf_description = $13,
           turf_logo_url = $14,
           turf_banner_url = $15,
           whatsapp_number = $16,
           instagram_url = $17,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [
        turfName,
        turfAddress,
        turfGoogleMaps,
        turfPhone || 'N/A',
        turfEmail || '',
        openingTime,
        closingTime,
        parseFloat(defaultSlotPrice),
        upiId,
        upiName,
        paymentMode,
        bookingEnabled === undefined ? true : !!bookingEnabled,
        turfDescription || null,
        turfLogoUrl || null,
        turfBannerUrl || null,
        whatsappNumber || null,
        instagramUrl || null
      ]
    );

    return NextResponse.json({ success: true, data: { message: 'Settings updated successfully' } });
  } catch (error) {
    console.error('Update admin settings error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
