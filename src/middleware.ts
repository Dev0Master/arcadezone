import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page without authentication
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // For all other admin routes, check for the presence of valid auth token cookie
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken || !authToken.value || !authToken.value.startsWith('auth_')) {
      // Redirect to login if no valid auth token is found
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to admin routes
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
