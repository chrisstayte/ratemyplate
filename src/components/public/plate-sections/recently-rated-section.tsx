import { Suspense } from 'react';
import { database } from '@/db/database';
import { desc, isNotNull, or, eq } from 'drizzle-orm';
import { plate_reviews, plates } from '@/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usStateName } from '@/lib/us-states';
import ReviewMarquee from '@/components/public/review-marquee';

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
        <RecentlyRatedMarquee />
      </Suspense>
    </section>
  );
}

async function RecentlyRatedMarquee() {
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
    .limit(20);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No reviews yet. Be the first!</p>
      </div>
    );
  }

  const reviewsWithState = await Promise.all(
    reviews.map(async (r) => ({
      ...r,
      stateName: await usStateName(r.state),
    }))
  );

  const mid = Math.ceil(reviewsWithState.length / 2);
  const row1 = reviewsWithState.slice(0, mid);
  const row2 = reviewsWithState.slice(mid);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-linear-to-l from-background to-transparent" />
      <div className="flex flex-col gap-4">
        <ReviewMarquee reviews={row1} direction="rtl" duration={150} />
        <ReviewMarquee
          reviews={row2.length > 0 ? row2 : row1}
          direction="ltr"
          duration={150}
        />
      </div>
    </div>
  );
}

function RecentlyRatedSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col gap-4">
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="w-75 shrink-0">
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
        ))}
      </div>
    </div>
  );
}
