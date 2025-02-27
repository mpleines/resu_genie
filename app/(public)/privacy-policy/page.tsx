'use client';
import { useCookieConsent } from '@/app/components/CookieBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Globe, Mail } from 'lucide-react';

export default function Page() {
  const { analyticsConsent, setAnalyticsConsent, acceptCookies, isLoading } =
    useCookieConsent();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Effective Date: February 24, 2025
          </p>
        </div>

        <div className="mx-auto w-full">
          <h1>Cookie Preferences</h1>
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
                disabled={isLoading}
                checked={!isLoading && analyticsConsent}
                onCheckedChange={setAnalyticsConsent}
                className="toggle"
              />
            </div>

            <Button
              className="shrink-0"
              onClick={() => {
                acceptCookies();
                toast({ title: 'Cookie Preferences saved' });
              }}
              aria-label="Accept cookies"
            >
              Save Preferences
            </Button>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg">
            At resugenie., we value your privacy. This Privacy Policy explains
            how we collect, use, and protect your data when you use our
            services.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>User Authentication:</strong> We collect your email and
                authentication data via NextAuth.js and Supabase.
              </li>
              <li>
                <strong>Generated Data:</strong> When you submit data to
                generate a resume, we send it to OpenAI for processing.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies to manage your session
                and remember your cookie consent preferences.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authenticate your account and keep you logged in.</li>
              <li>Generate resume content based on your input.</li>
              <li>Improve your experience on our platform.</li>
            </ul>
            <p className="mt-4">
              We do not sell or share your personal data for marketing purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Cookies & Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We use essential cookies to keep you logged in and track your
              cookie consent preferences. You can manage your cookie settings at
              any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>We use the following services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Supabase:</strong> For database and authentication.
              </li>
              <li>
                <strong>OpenAI:</strong> For generating resume content.
              </li>
              <li>
                <strong>Google Analytics:</strong> To collect data on how you
                use our website, which helps us improve its design and
                functionality. With your consent, Google Analytics processes and
                collects your personal data, including cookies and IP addresses,
                to provide us with valuable insights. Please note that Google
                Analytics transfers your data to the United States and stores it
                for a specified period. For more information on Google's data
                transfer policies, please refer to their documentation.
              </li>
            </ul>
            <p className="mt-4">
              We only share data necessary to provide the service and do not use
              it for marketing purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>You can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to or delete your data.</li>
              <li>Withdraw consent for cookies at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at
              mpleines.service@gmail.com.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you have any questions, please reach out to us at:</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Email: mpleines.service@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>Website: https://resu-genie.vercel.app</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
