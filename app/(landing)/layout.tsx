import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import Providers from '../components/Providers';
import Header from '../api/auth/[...nextauth]/Header';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

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
  title: 'Create Next App',
  description: 'Generated by create next app',
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
        <Providers>
          <div className="min-h-screen">
            <div className="min-h-full w-full max-w-7xl mx-auto font-[family-name:var(--font-geist-sans)]">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}