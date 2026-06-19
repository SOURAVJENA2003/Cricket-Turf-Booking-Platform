import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        id: process.env.UPI_ID,
        name: process.env.UPI_NAME,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch config'
    }, { status: 500 });
  }
}
