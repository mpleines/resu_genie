import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './components/Providers';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

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
  title: 'ResuGenie',
  description: 'AI Resume Generator',
};

// set up supabase client for server
const cookieStore = cookies();
export const supabaseClientServer = createClient(cookieStore);

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
