import { formatDate, parse } from 'date-fns';
import Link from 'next/link';

export default function page() {
  const lastUpdatedString = '27.11.2024';
  const [day, month, year] = lastUpdatedString.split('.').map(Number);
  const lastUpdated = new Date(year, month - 1, day);

  return (
    <div className="px-9 space-y-4 mt-8">
      <h1 className="text-3xl font-bold">Legal Notice</h1>
      <p>Last updated {formatDate(lastUpdated, ' dd. MMMM yyyy')}</p>
      <h2 className="text-2xl font-bold">Contact</h2>
      <p>
        Email:{' '}
        <Link href="mailto:service.mpleines@gmail.com">
          service.mpleines@gmail.com
        </Link>
      </p>
      <p>
        This app is a personal project and not operated for commercial purposes.
      </p>
    </div>
  );
}