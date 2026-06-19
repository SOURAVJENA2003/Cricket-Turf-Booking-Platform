import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const paymentMode = process.env.PAYMENT_MODE || 'upi';
    const configData = {
      paymentMode,
      turfDetails: {
        name: process.env.TURF_NAME,
        address: process.env.TURF_ADDRESS,
        googleMaps: process.env.TURF_GOOGLE_MAPS,
        openTime: process.env.TURF_OPEN_TIME,
        closeTime: process.env.TURF_CLOSE_TIME,
      }
    };

    if (paymentMode === 'upi') {
      configData.upiDetails = {
        id: process.env.UPI_ID,
        name: process.env.UPI_NAME,
      };
      // Maintain top-level compatibility for existing UPI selectors
      configData.id = process.env.UPI_ID;
      configData.name = process.env.UPI_NAME;
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
