import Link from 'next/link';
import { FunctionComponent } from 'react';
import { SignInButton } from './AuthButtons';
import UserDropdown from './UserDropdown';
import Image from 'next/image';
import Logo from '@/public/logo.svg';
import { auth } from '@/auth';

const HeaderContent: FunctionComponent = async () => {
  const session = await auth();

  const renderSessionContent = () => {
    if (session?.user != null) {
      return (
        <div className="flex gap-6 items-center">
          <UserDropdown
            username={session.user.name ?? 'Unknown User'}
            avatarUrl={session.user.image ?? undefined}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Link
          href="#how-it-works"
          className="text-muted-foreground font-semibold"
        >
          How it works
        </Link>

        <Link href="#faq" className="text-muted-foreground font-semibold">
          FAQ
        </Link>
        <SignInButton />
      </div>
    );
  };

  return (
    <div className="h-full mx-auto max-w-screen-2xl flex items-center justify-between py-8 px-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image width="30" height="30" alt="logo" src={Logo} />
          <h1 className="text-xl font-bold">resugenie.</h1>
        </Link>
      </div>
      {renderSessionContent()}
    </div>
  );
};

export default HeaderContent;
