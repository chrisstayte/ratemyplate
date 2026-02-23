import type { plates } from '@/db/schema';
import { validateLicensePlate } from '@/lib/plates';
import { stateNameValidator, usStateName } from '@/lib/us-states';
import { database } from '@/db/database';
type Plate = typeof plates.$inferSelect;
import LicensePlate from '@/components/public/license-plate';
import CommentsSection from '@/components/public/comments/comments-section';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  Star,
  MessageSquare,
  Calendar,
  Clock,
} from 'lucide-react';
import SearchCard from '@/components/public/search-card/search-card';

import type { Metadata, ResolvingMetadata } from 'next';
import BreadCrumbs from '@/components/bread-crumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { plate_reviews } from '@/db/schema';
import { eq, sql, avg, count } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import InlineSearch from '@/components/public/inline-search';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ state: string; plate: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { state, plate } = await params;
  const upperState = state.toUpperCase();
  const upperPlate = plate.toUpperCase();

  if (
    !validateLicensePlate(upperPlate, 'US') ||
    !(await stateNameValidator(upperState))
  ) {
    return {
      title: 'Rate My Plate',
      description: 'Search Yours Today',
    };
  }

  return {
    title: `${upperPlate} in ${upperState}`,
    description: `View comments for license plate ${upperPlate} in ${upperState}`,
    openGraph: {
      images: [
        {
          url: `/api/og?state=${upperState}&plate=${upperPlate}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og?state=${upperState}&plate=${upperPlate}`],
    },
  };
}

export default async function PlatePage({ params }: Props) {
  const { state, plate: plateNumber } = await params;
  const upperState = state.toUpperCase();
  const upperPlate = plateNumber.toUpperCase();

  if (
    !validateLicensePlate(upperPlate, 'US') ||
    !(await stateNameValidator(upperState))
  ) {
    return (
      <div className="container flex flex-col gap-5 py-10 items-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            This is not a valid license plate. I&apos;ve provided a search form
            below to help you find the right one.
          </AlertDescription>
        </Alert>
        <SearchCard />
      </div>
    );
  }

  const stateName = await usStateName(upperState);

  let plate: Plate | undefined;

  try {
    plate = await database.query.plates.findFirst({
      where: (plates, { and, eq }) =>
        and(eq(plates.state, upperState), eq(plates.plateNumber, upperPlate)),
    });
  } catch (error) {
    console.error('PLATE ERROR', error);
  }

  // Fetch stats if the plate exists
  let avgRating: number | null = null;
  let totalReviews = 0;
  let lastActivity: Date | null = null;

  if (plate) {
    const [stats] = await database
      .select({
        avgRating: sql<number>`cast(avg(${plate_reviews.rating}) as float)`,
        totalReviews: count(),
        lastActivity: sql<Date>`greatest(max(${plate_reviews.createdAt}), max(${plate_reviews.updatedAt}))`,
      })
      .from(plate_reviews)
      .where(eq(plate_reviews.plateId, plate.id));

    if (stats) {
      avgRating = stats.avgRating;
      totalReviews = stats.totalReviews;
      lastActivity = stats.lastActivity;
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-5 mb-10 pt-5">
      <BreadCrumbs />

      {/* Two-column layout */}
      <div className="flex flex-col gap-5 md:gap-8 md:flex-row">
        {/* Left: plate visual + stats */}
        <div className="flex shrink-0 md:w-80 flex-col gap-5">
          <Card>
            <CardContent>
              <div className="rounded-lg bg-accent p-2 flex items-center justify-center">
                <LicensePlate
                  plate={{ state: upperState, plateNumber: upperPlate }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-4 p-5">
              {/* Average Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="size-4" />
                  Average Rating
                </div>
                <div className="flex items-center gap-1">
                  {avgRating !== null ? (
                    <>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < Math.round(avgRating!)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/40'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium ml-1">
                        {avgRating.toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Total Reviews */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="size-4" />
                  Total Reviews
                </div>
                <span className="text-sm font-medium">{totalReviews}</span>
              </div>

              <Separator />

              {/* First Reported */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  First Reported
                </div>
                <span className="text-sm font-medium">
                  {plate
                    ? formatDistanceToNow(plate.timestamp, { addSuffix: true })
                    : 'N/A'}
                </span>
              </div>

              <Separator />

              {/* Last Activity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Last Activity
                </div>
                <span className="text-sm font-medium">
                  {lastActivity
                    ? formatDistanceToNow(lastActivity, { addSuffix: true })
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: reviews */}
        <div className="flex grow min-w-0">
          <CommentsSection state={upperState} plateNumber={upperPlate} />
        </div>
      </div>
    </div>
  );
}
