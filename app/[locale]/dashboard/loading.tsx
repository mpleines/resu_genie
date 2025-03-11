import { Skeleton } from '@/components/ui/skeleton';
import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('dashboard');
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:auto-cols-auto auto-cols-auto gap-4">
        <Skeleton className="w-full h-[250px] md:h-[300px]" />
        <Skeleton className="w-full h-[250px] md:h-[300px]" />
        <Skeleton className="w-full h-[250px] md:h-[300px]" />
        <Skeleton className="w-full h-[250px] md:h-[300px]" />
        <Skeleton className="w-full h-[250px] md:h-[300px]" />
      </div>
    </div>
  );
}
