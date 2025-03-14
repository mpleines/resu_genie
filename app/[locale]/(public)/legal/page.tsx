import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function page() {
  const lastUpdatedString = '27.11.2024';
  const [day, month, year] = lastUpdatedString.split('.').map(Number);
  const lastUpdated = new Date(year, month - 1, day);

  return (
    <div className="space-y-4 mt-8 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold">Legal Notice</h1>
      <p>Last updated {formatDate(lastUpdated)}</p>
      <h2 className="text-2xl font-bold">Contact</h2>
      <p>
        Email:{' '}
        <Link href="mailto:service.mpleines@gmail.com">
          service.mpleines@gmail.com
        </Link>
      </p>
    </div>
  );
}
