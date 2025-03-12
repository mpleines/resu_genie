'use client';

import Link from 'next/link';
import { FunctionComponent } from 'react';
import { SignInButton } from './AuthButtons';
import UserDropdown from './UserDropdown';
import Image from 'next/image';
import Logo from '@/public/logo.svg';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LocaleSwitch } from './LocaleSwitch';
import { useTranslations } from 'next-intl';

const HeaderContent: FunctionComponent = () => {
  const session = useSession();
  const t = useTranslations('landing');

  const renderSessionContent = () => {
    if (session.status === 'loading') {
      return null;
    }

    if (session?.data?.user != null) {
      return (
        <div className="flex gap-2 items-center">
          <LocaleSwitch />
          <UserDropdown
            username={session.data?.user.name ?? 'Unknown User'}
            avatarUrl={session.data?.user.image ?? undefined}
          />
        </div>
      );
    }

    return (
      <div>
        <Sheet>
          <SheetTrigger>
            <Button className="md:hidden">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center gap-2">
                  <Image width="30" height="30" alt="logo" src={Logo} />
                  <h1 className="text-xl font-bold">resugenie.</h1>
                </Link>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-8">
              <SheetClose className="flex" asChild>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground font-semibold"
                >
                  {t('howItWorks')}
                </Link>
              </SheetClose>

              <SheetClose className="flex" asChild>
                <Link
                  href="#faq"
                  className="text-muted-foreground font-semibold"
                >
                  {t('faq')}
                </Link>
              </SheetClose>
              <SheetClose className="flex" asChild>
                <SignInButton />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-4 ">
          <Link
            href="#how-it-works"
            className="text-muted-foreground font-semibold"
          >
            {t('howItWorks')}
          </Link>

          <Link href="#faq" className="text-muted-foreground font-semibold">
            {t('faq')}
          </Link>
          <LocaleSwitch />
          <SignInButton />
        </div>
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
