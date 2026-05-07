import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Protect these routes (and their sub-routes)
  const protectedRoutes = ['/faculty', '/student', '/dashboard'];
  
  // Check if current path matches any protected route
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  // If it's a protected route and no token exists, redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optional: save the attempted URL to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // If user is already logged in, prevent them from accessing /login or /signup
  if (token && (pathname === '/login' || pathname === '/signup')) {
    // We don't have role info in the middleware easily (without decoding JWT), 
    // but we can redirect to a generic dashboard or let the client-side AuthContext handle it.
    // For now, let the client-side handle redirecting logged-in users away from login pages 
    // to their respective dashboards to avoid guessing here.
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to these paths
  matcher: [
    '/faculty/:path*',
    '/student/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup'
  ]
};
