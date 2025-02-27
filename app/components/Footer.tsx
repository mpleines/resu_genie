import { Badge } from '@/components/ui/badge';
import { Copyright, Dot } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="p-4 border-t">
      <div className="max-w-screen-2xl mx-auto flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
        <div className="flex items-center gap-2">
          ResuGenie by{' '}
          <Link href="https://maikpleines.com" className="underline">
            Maik Pleines
          </Link>
          <Copyright size={16} />
          {new Date().getFullYear()}
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="underline">
            About
          </Link>
          <Link href="/legal" className="underline">
            Legal Notice
          </Link>
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
