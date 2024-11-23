'use client';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FunctionComponent } from 'react';

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const session = useSession();

  if (session.status === 'authenticated') {
    return (
      <header className="sticky top-0 w-full bg-white shadow-md h-[64px] px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText />
          <Link href="/dashboard">
            <h1 className="text-xl font-bold">ResuGenie</h1>
          </Link>
        </div>
        {session.status === 'authenticated' && (
          <div className="flex gap-6 items-center">
            {session.data.user?.name}
            <Button onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          </div>
        )}
      </header>
    );
  }
  return (
    <header className="sticky top-0 w-full bg-white shadow-md h-[64px] px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FileText />
        <Link href="/">
          <h1 className="text-xl font-bold">ResuGenie</h1>
        </Link>
      </div>
      {session.status === 'unauthenticated' && (
        <div className="flex gap-6 items-center">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Sign In{' '}
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
