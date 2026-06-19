import { NextResponse } from 'next/server';
import { verifyToken, getSessionCookie } from './lib/auth';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = getSessionCookie(request);
  const verified = await verifyToken(token);

  // 1. API admin route protection
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login' && pathname !== '/api/admin/logout') {
    if (!verified) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  // 2. Frontend admin page protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!verified) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 3. Prevent logged-in admin from accessing login page
  if (pathname === '/admin/login') {
    if (verified) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
