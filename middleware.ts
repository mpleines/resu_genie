import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export const locales = ['en', 'de'];
export const defaultLocale = 'en';
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // Exclude Stripe webhook from all middleware processing
  if (pathname.startsWith('/api/stripe-webhook')) {
    return NextResponse.next();
  }

  // Exclude NextAuth API routes from locale redirection
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale is present, detect preferred locale and redirect
  if (!hasLocale) {
    const acceptLanguage = req.headers.get('accept-language');
    const preferredLocale =
      acceptLanguage?.split(',')[0].split('-')[0] || defaultLocale;
    const detectedLocale = locales.includes(preferredLocale)
      ? preferredLocale
      : defaultLocale;

    return NextResponse.redirect(
      new URL(`/${detectedLocale}${pathname}`, req.url)
    );
  }

  // Extract the locale and path without locale
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '') || '/';

  // Publicly accessible routes
  const publicPaths = [
    '/',
    '/legal',
    '/privacy-policy',
    '/signin',
    '/about',
    '/sitemap.xml',
  ];

  const isPublic = publicPaths.some(
    (path) =>
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
  );

  // For public routes, just apply the intl middleware without auth check
  if (isPublic) {
    return intlMiddleware(req);
  }

  // Check user session only for protected routes
  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL(`/${locale}/signin`, req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // Apply next-intl middleware for locale handling
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/((?!_next|api|static|favicon.ico).*)'],
};
