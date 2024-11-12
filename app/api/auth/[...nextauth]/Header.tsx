"use client";
import { buttonVariants } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const session = useSession();

  if (session.status === "authenticated") {
    return (
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText />
          <h1 className="text-xl font-bold">ResuGenie</h1>
        </div>
        <div className="flex gap-6 items-center">
          {session.data.user?.name}
          <Link
            href="/api/auth/signout"
            className={buttonVariants({ variant: "secondary" })}
          >
            Sign Out
          </Link>
        </div>
      </header>
    );
  }
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FileText />
        <h1 className="text-xl font-bold">ResuGenie</h1>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link
          href="/api/auth/signin"
          className={buttonVariants({ variant: "secondary" })}
        >
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default Header;
