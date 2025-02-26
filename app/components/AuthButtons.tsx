'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut } from 'next-auth/react';

export const SignoutButton = () => {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </Button>
  );
};

export const SignInButton = () => {
  return (
    <Button variant="secondary" onClick={() => signIn()}>
      Sign In{' '}
    </Button>
  );
};
