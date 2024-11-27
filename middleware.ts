import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = new URL(req.url);

  // Allow public access to `/` and `/api/auth` (NextAuth routes)
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname === '/legal'
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the login page
  if (!token) {
    const loginUrl = new URL('/api/auth/signin', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Save redirect after login
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Ensure middleware runs for all routes
export const config = {
  matcher: '/((?!_next|favicon.ico|public).*)', // Exclude assets and public files
};
