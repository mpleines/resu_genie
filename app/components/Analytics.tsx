'use client';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useCookieConsent } from './CookieBanner';

export default function Analytics() {
  const { analyticsConsent } = useCookieConsent();

  if (!analyticsConsent) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    throw new Error('No GOOGLE_ANALYTICS_ID set in environment variables.');
  }

  return (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
  );
}
