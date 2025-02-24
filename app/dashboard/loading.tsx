import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">My Resumes</h1>
      <div className="flex flex-wrap gap-4">
        <Skeleton className="w-full md:w-[250px] h-[250px] md:h-[300px]" />
        <Skeleton className="w-full md:w-[250px] h-[250px] md:h-[300px]" />
        <Skeleton className="w-full md:w-[250px] h-[250px] md:h-[300px]" />
        <Skeleton className="w-full md:w-[250px] h-[250px] md:h-[300px]" />
        <Skeleton className="w-full md:w-[250px] h-[250px] md:h-[300px]" />
      </div>
    </div>
  );
}
