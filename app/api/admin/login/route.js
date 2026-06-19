import { NextResponse } from 'next/server';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD_HASH in environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (email !== adminEmail || !verifyPassword(password, adminPasswordHash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Set expiration to 24 hours from now
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
    const token = await signToken({ email, exp: expirationTime });

    if (!token) {
      return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

    // Set session cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
