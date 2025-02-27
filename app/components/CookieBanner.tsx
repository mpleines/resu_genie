'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  isOnPage?: boolean;
};

export default function CookieBanner({ isOnPage }: Props) {
  const {
    isAccepted,
    acceptCookies,
    isLoading,
    analyticsConsent,
    setAnalyticsConsent,
  } = useCookieConsent();

  if (isLoading) {
    return null;
  }

  if (isAccepted && !isOnPage) {
    return null;
  }

  return (
    <div className="w-full fixed bottom-4">
      <Card className="mx-auto max-w-screen-2xl animate-in fade-in slide-in-from-bottom duration-700">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-sm text-muted-foreground max-w-5xl">
            We use essential cookies to ensure our website functions properly.
            With your consent, we also use additional cookies to analyze site
            usage through Google Analytics. By clicking 'Accept,' you agree to
            our use of these cookies. You can manage your preferences or learn
            more in our{' '}
            <Link className="underline" href="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label
                htmlFor="analytics-consent"
                className="text-sm text-muted-foreground"
              >
                Enable Analytics Cookies
              </label>
              <Checkbox
                defaultChecked={analyticsConsent}
                id="analytics-consent"
                checked={analyticsConsent}
                onCheckedChange={(checkedState) =>
                  setAnalyticsConsent(checkedState.valueOf() == 'true')
                }
                className="toggle"
              />
            </div>
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
    </div>
  );
}

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';
const ANALYTICS_CONSENT_KEY = 'analytics-consent';

export function useCookieConsent() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const storedAnalyticsConsent = localStorage.getItem(ANALYTICS_CONSENT_KEY);

    setIsAccepted(storedConsent === 'true');

    const analyticsInitialChecked =
      storedAnalyticsConsent == null && storedConsent == null;
    setAnalyticsConsent(
      storedAnalyticsConsent === 'true' || analyticsInitialChecked
    );

    setIsLoading(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(
      ANALYTICS_CONSENT_KEY,
      analyticsConsent ? 'true' : 'false'
    );
    setIsAccepted(true);
  };

  return {
    isAccepted,
    acceptCookies,
    isLoading,
    analyticsConsent,
    setAnalyticsConsent,
    setIsAccepted,
  };
}
