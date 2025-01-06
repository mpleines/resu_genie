import type { Metadata } from 'next';
import '../globals.css';
import Providers from '../components/Providers';
import Header from '../components/Header';
import { Copyright } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (session?.user != null) {
    redirect('/dashboard');
  }

  return (
    <div>
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
