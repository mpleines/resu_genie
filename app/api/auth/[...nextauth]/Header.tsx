'use client';
import { Button } from '@/components/ui/button';
import { FileText, User } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FunctionComponent, useEffect, useState } from 'react';

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const session = useSession();
  const [shouldShowBorder, setShouldShowBorder] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const { pageYOffset } = window;
      if (pageYOffset > 0) {
        setShouldShowBorder(true);
      } else {
        setShouldShowBorder(false);
      }
    });
  }, []);

  if (session.status === 'authenticated') {
    return (
      <HeaderWrapper shouldShowBorder={shouldShowBorder}>
        <div className="flex items-center gap-2">
          <FileText className="text-primary" style={{ marginLeft: '-4px' }} />
          <Link href="/dashboard">
            <h1 className="text-xl font-bold">ResuGenie</h1>
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          {/* FIXME: this should be a dropdown for mobile view */}
          <div className="flex items-center gap-2">
            <User className="hidden md:block" />

            <span className="hidden md:block">{session.data.user?.name}</span>
          </div>
          <Button onClick={() => signOut({ callbackUrl: '/' })} size="sm">
            Sign Out
          </Button>
        </div>
      </HeaderWrapper>
    );
  }
  return (
    <HeaderWrapper shouldShowBorder={shouldShowBorder}>
      <div className="flex items-center gap-2">
        <FileText className="text-primary" style={{ marginLeft: '-4px' }} />
        <Link href="/">
          <h1 className="text-xl font-bold">ResuGenie</h1>
        </Link>
      </div>
      {session.status === 'unauthenticated' && (
        <Button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          size="sm"
        >
          Sign In{' '}
        </Button>
      )}
    </HeaderWrapper>
  );
};

const HeaderWrapper: React.FC<
  React.PropsWithChildren<{ shouldShowBorder: boolean }>
> = ({ shouldShowBorder, children }) => {
  return (
    <header
      className={`sticky top-0 w-full bg-transparent z-10 h-[64px] ${
        shouldShowBorder ? 'border-b bg-white/10 backdrop-blur-md' : ''
      }`}
    >
      <div className="h-full mx-auto max-w-screen-2xl flex items-center justify-between py-8 px-4">
        {children}
      </div>
    </header>
  );
};

export default Header;
