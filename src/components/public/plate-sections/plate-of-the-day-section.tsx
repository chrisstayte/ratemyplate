import { Suspense } from 'react';
import { database } from '@/db/database';
import { eq, sql } from 'drizzle-orm';
import { plate_reviews, plates } from '@/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Trophy } from 'lucide-react';
import { usStateName } from '@/lib/us-states';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function PlateOfTheDaySection() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="size-7 text-yellow-500" />
          Plate of the Day
        </h2>
        <p className="text-muted-foreground mt-1">
          Today&apos;s featured license plate
        </p>
      </div>
      <Suspense fallback={<PlateOfTheDaySkeleton />}>
        <PlateOfTheDayCard />
      </Suspense>
    </section>
  );
}

async function PlateOfTheDayCard() {
  // Get all plates that have at least one review
  const reviewedPlates = await database
    .select({
      id: plates.id,
      plateNumber: plates.plateNumber,
      state: plates.state,
      avgRating: sql<number>`cast(avg(${plate_reviews.rating}) as float)`,
      reviewCount: sql<number>`cast(count(${plate_reviews.id}) as int)`,
    })
    .from(plates)
    .innerJoin(plate_reviews, eq(plates.id, plate_reviews.plateId))
    .groupBy(plates.id, plates.plateNumber, plates.state);

  if (reviewedPlates.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No plates rated yet. Be the first to rate a plate!
        </p>
      </div>
    );
  }

  // Deterministic "random" pick based on the current date
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % reviewedPlates.length;
  const plate = reviewedPlates[index];

  const stateName = await usStateName(plate.state);
  const avgRating = plate.avgRating;

  return (
    <Link href={`/${plate.state}/${plate.plateNumber}`}>
      <Card className="max-w-md mx-auto transition-transform hover:scale-[1.02] border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <Badge className="text-lg px-4 py-1">{plate.plateNumber}</Badge>
          <p className="text-muted-foreground">{stateName}</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-5 ${
                    i < Math.round(avgRating ?? 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
            {avgRating !== null && (
              <span className="text-sm font-medium">
                {avgRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {plate.reviewCount} {plate.reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function PlateOfTheDaySkeleton() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center gap-4 p-8">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-20" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="size-5 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-16" />
      </CardContent>
    </Card>
  );
}
