import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    id: process.env.UPI_ID || 'owner@upi',
    name: process.env.UPI_NAME || 'Turf Owner',
  });
}
