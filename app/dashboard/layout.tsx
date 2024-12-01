import Header from '../api/auth/[...nextauth]/Header';

export default function BasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: implement
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto max-w-screen-2xl w-full py-8 flex-1 overflow-y-auto">
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
