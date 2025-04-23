import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if the user is authenticated
    const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true';

    // If not authenticated and not trying to access the login page, redirect to login
    if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/admin/login')) {
      // Create the login URL with the same hostname as the request
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated and trying to access login page, redirect to admin dashboard
    if (isAuthenticated && request.nextUrl.pathname === '/admin/login') {
      // Create the admin URL with the same hostname as the request
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
};
