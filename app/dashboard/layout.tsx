export default function BasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: implement
  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto max-w-screen-2xl w-full py-8 px-4 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
