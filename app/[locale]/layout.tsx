import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import Providers from '../components/Providers';
import { Toaster } from '@/components/ui/toaster';
import Header from '../components/Header';
import CookieBanner from '../components/CookieBanner';
import Analytics from '../components/Analytics';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title:
    'resugenie | AI Resume Builder | Create a Job-Winning Resume in Minutes',
  description:
    'Build a professional resume with AI. Get expert recommendations and Application Tracking System optimizations. Choose from different professional templates.',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NextIntlClientProvider>
            <Header />
            {children}
            <Toaster />
            <CookieBanner />
          </NextIntlClientProvider>
        </Providers>
      </body>
      <Analytics />
    </html>
  );
}
