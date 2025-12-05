import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page without authentication
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // For all other admin routes, check authentication by looking for a session cookie
    const cookieStore = request.cookies;
    const session = cookieStore.get('auth_token'); // Updated cookie name

    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to admin routes
export const config = {
  matcher: ['/admin/:path*'], // Removed api matcher since API routes handle auth differently
};