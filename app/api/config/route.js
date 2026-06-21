import { NextResponse } from 'next/server';
import db from '@/lib/db';
const { query } = db;

export async function GET() {
  try {
    const result = await query('SELECT * FROM settings WHERE id = 1');
    if (result.rows.length === 0) {
      throw new Error('Database settings not initialized.');
    }
    const s = result.rows[0];
    const paymentMode = s.payment_mode || 'upi';

    const configData = {
      paymentMode,
      bookingEnabled: s.booking_enabled,
      advanceBookingPrice: parseFloat(s.advance_booking_price || '100.00'),
      turfDetails: {
        name: s.turf_name,
        address: s.turf_address,
        googleMaps: s.turf_google_maps,
        phone: s.turf_phone,
        email: s.turf_email,
        openTime: s.opening_time,
        closeTime: s.closing_time,
        description: s.turf_description || '',
        logoUrl: s.turf_logo_url || '',
        bannerUrl: s.turf_banner_url || '',
        whatsappNumber: s.whatsapp_number || '',
        instagramUrl: s.instagram_url || '',
      }
    };

    if (paymentMode === 'upi') {
      configData.upiDetails = {
        id: s.upi_id,
        name: s.upi_name,
      };
      // Maintain top-level compatibility for existing UPI selectors
      configData.id = s.upi_id;
      configData.name = s.upi_name;
    } else if (paymentMode === 'razorpay') {
      configData.razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    }

    return NextResponse.json({
      success: true,
      data: configData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch config'
    }, { status: 500 });
  }
}
