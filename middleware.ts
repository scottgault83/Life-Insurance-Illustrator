import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login page and API routes without authentication
  if (pathname === '/login' || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // All other routes require authentication
  // Check for session cookie (set during login)
  const sessionCookie = request.cookies.get('sb-token');

  if (!sessionCookie) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home', '/home/:path*'],
};
