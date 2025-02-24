'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const { isAccepted, acceptCookies, isLoading } = useCookieConsent();

  if (isLoading) {
    return null;
  }

  if (isAccepted) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 w-full mx-auto animate-in fade-in slide-in-from-bottom duration-700">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="text-sm text-muted-foreground">
          We use necessary cookies to make our site work. By continuing to use
          our site, you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="secondary">
            <Link href="/privacy-policy">Privacy Policy</Link>
          </Button>
          <Button
            className="shrink-0"
            onClick={acceptCookies}
            aria-label="Accept cookies"
          >
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

export function useCookieConsent() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    setIsAccepted(storedConsent === 'true');
    setIsLoading(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsAccepted(true);
  };

  return {
    isAccepted,
    acceptCookies,
    isLoading,
  };
}
