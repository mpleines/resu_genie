import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import Providers from '../components/Providers';
import Header from '../api/auth/[...nextauth]/Header';
import { Copyright } from 'lucide-react';
import Link from 'next/link';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gradient-to-r from-white to-mint-cream/60">
      <Providers>
        <Header />
        <div className="min-h-screen">
          <div className="min-h-full w-full font-[family-name:var(--font-geist-sans)]">
            {children}
          </div>
        </div>
      </Providers>
      <footer className="p-4 border-t">
        <div className="max-w-screen-2xl mx-auto md:flex md:justify-between">
          <div className="flex items-center gap-2 font-bold">
            ResuGenie by{' '}
            <Link href="https://maikpleines.com" className="underline">
              Maik Pleines
            </Link>
            <Copyright size={16} />
            {new Date().getFullYear()}
          </div>
          <div>
            <Link href="/legal" className="underline">
              Legal Notice
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
