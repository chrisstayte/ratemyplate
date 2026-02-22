import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-5 mb-10 pt-5">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-5 w-48" />

      <div className="flex flex-col gap-5 md:gap-8 md:flex-row">
        {/* Left column: plate + stats */}
        <div className="flex shrink-0 md:w-80 flex-col gap-5">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>

        {/* Right column: comments */}
        <div className="flex grow min-w-0 flex-col gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
