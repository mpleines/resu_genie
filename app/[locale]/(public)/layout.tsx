import type { Metadata } from 'next';
import '../../globals.css';
import Providers from '../../components/Providers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title:
    'resugenie - AI Resume Builder | Create a Job-Winning Resume in Minutes',
  description:
    'Build a professional resume with AI. Get expert recommendations and Application Tracking System optimizations. Choose from different professional templates.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user != null) {
    redirect('/dashboard');
  }

  return (
    <div>
      <Providers>
        <div className="min-h-screen">
          <div className="min-h-full w-full font-[family-name:var(--font-geist-sans)]">
            {children}
          </div>
        </div>
      </Providers>
      <Footer />
    </div>
  );
}
