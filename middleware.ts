import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Publicly accessible routes
const publicPaths = [
  '/',
  '/legal',
  '/privacy-policy',
  '/signin',
  '/about',
  '/sitemap.xml',
];

export default async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // Exclude Stripe webhook from all middleware processing
  if (pathname.startsWith('/api/stripe-webhook')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const path = pathname.replace(/^\/[^\/]+/, '') || '/';

  const isPublic = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + '/')
  );

  // For public routes, just apply the intl middleware without auth check
  if (isPublic) {
    return intlMiddleware(req);
  }

  // Check user session only for protected routes
  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL(`/signin`, req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // Apply next-intl middleware for locale handling
  return intlMiddleware(req);
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
  // matcher: ['/', '/((?!_next|api|static|favicon.ico).*)'],
};
