import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login page and API routes
  if (pathname === '/login' || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if user is trying to access the home page (calculator)
  if (pathname === '/') {
    const authenticated = request.cookies.get('authenticated');

    // If not authenticated, redirect to login
    if (!authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
