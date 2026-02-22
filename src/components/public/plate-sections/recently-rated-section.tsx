import { Suspense } from 'react';
import { database } from '@/db/database';
import { desc, eq, isNotNull, and, or } from 'drizzle-orm';
import { plate_reviews, plates } from '@/db/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usStateName } from '@/lib/us-states';
import Link from 'next/link';

export default function RecentlyRatedSection() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Recently Rated</h2>
        <p className="text-muted-foreground mt-1">
          See what the community is saying
        </p>
      </div>
      <Suspense fallback={<RecentlyRatedSkeleton />}>
        <RecentlyRatedCards />
      </Suspense>
    </section>
  );
}

async function RecentlyRatedCards() {
  const reviews = await database
    .select({
      id: plate_reviews.id,
      rating: plate_reviews.rating,
      comment: plate_reviews.comment,
      createdAt: plate_reviews.createdAt,
      plateNumber: plates.plateNumber,
      state: plates.state,
    })
    .from(plate_reviews)
    .innerJoin(plates, eq(plate_reviews.plateId, plates.id))
    .where(
      or(isNotNull(plate_reviews.rating), isNotNull(plate_reviews.comment))
    )
    .orderBy(desc(plate_reviews.createdAt))
    .limit(6);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No reviews yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map(async (review) => {
        const stateName = await usStateName(review.state);
        return (
          <Link key={review.id} href={`/${review.state}/${review.plateNumber}`}>
            <Card className="transition-transform hover:scale-[1.02] h-full">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <Badge>{review.plateNumber}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {stateName}
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < (review.rating ?? 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {review.comment}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function RecentlyRatedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="size-4 rounded-full" />
              ))}
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
