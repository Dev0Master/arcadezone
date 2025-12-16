import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page without authentication
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // For all other admin routes, check for the presence of valid auth token cookie
    const authCookie = request.headers.get('cookie');
    let hasValidAuthToken = false;

    if (authCookie) {
      const cookies = authCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token' && value && value.startsWith('auth_')) {
          // Basic validation: token should start with 'auth_' and have some content
          hasValidAuthToken = true;
          break;
        }
      }
    }

    // Redirect to login if no valid auth token is found
    if (!hasValidAuthToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to admin routes
export const config = {
  matcher: [
    '/admin',
    '/admin/',
    '/admin/:path*',
  ], // Match the base admin path and all sub-paths
};