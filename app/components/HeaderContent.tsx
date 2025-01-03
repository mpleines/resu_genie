import { FileText, User } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { SignInButton, SignoutButton } from './AuthButtons';

const HeaderContent: FunctionComponent = async () => {
  const session = await getServerSession();

  const renderSessionContent = () => {
    if (session?.user != null) {
      return (
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <User className="hidden md:block" />
            <span className="hidden md:block">{session.user?.name}</span>
          </div>
          <SignoutButton />
        </div>
      );
    }

    return <SignInButton />;
  };

  return (
    <div className="h-full mx-auto max-w-screen-2xl flex items-center justify-between py-8 px-4">
      <div className="flex items-center gap-2">
        <FileText className="text-primary" style={{ marginLeft: '-4px' }} />
        <Link href="/">
          <h1 className="text-xl font-bold">ResuGenie</h1>
        </Link>
      </div>
      {renderSessionContent()}
    </div>
  );
};

export default HeaderContent;
