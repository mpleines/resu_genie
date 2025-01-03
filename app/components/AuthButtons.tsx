'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut } from 'next-auth/react';

export const SignoutButton = () => {
  return (
    <Button onClick={() => signOut({ callbackUrl: '/' })} size="sm">
      Sign Out
    </Button>
  );
};

export const SignInButton = () => {
  return (
    <Button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      size="sm"
    >
      Sign In{' '}
    </Button>
  );
};
