import { ReactNode } from 'react';
import Header from '../api/auth/[...nextauth]/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-16 px-16 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
