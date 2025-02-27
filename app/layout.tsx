import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './components/Providers';
import { Toaster } from '@/components/ui/toaster';
import Header from './components/Header';
import CookieBanner from './components/CookieBanner';
import Analytics from './components/Analytics';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
        <Toaster />
        <CookieBanner />
      </body>
      <Analytics />
    </html>
  );
}
