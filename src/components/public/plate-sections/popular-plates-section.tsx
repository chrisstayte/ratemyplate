import { Card } from '@/components/ui/card';
import * as React from 'react';
import { database } from '@/db/database';
import { Suspense } from 'react';
import { sql, desc, eq } from 'drizzle-orm';
import { Skeleton } from '@/components/ui/skeleton';
import { Plate } from '@/lib/plates';
import { plates, plate_reviews } from '@/db/schema';

import LicensePlateTiny, {
  LicensePlateTinySkeleton,
} from '@/components/public/license-plate-tiny';

export default function PopularEntriesSection() {
  const numberOfEntriesToDisplay = 10;

  return (
    <div className="flex flex-col gap-5 justify-center w-full h-full">
      <p className="text-2xl">Popular Drivers</p>
      <Suspense
        fallback={<PopularEntriesSkeleton limit={numberOfEntriesToDisplay} />}
      >
        <PopularEntries limit={numberOfEntriesToDisplay} />
      </Suspense>
    </div>
  );
}

async function PopularEntries({ limit = 10 }) {
  // give me the plateNumber, state, id, and count of comments for each plate
  // sort by the count of comments in descending order
  // limit the result to the number of entries to display
  // only give me plates that have at least one comment
  const popularPlates = await database
    .select({
      plateNumber: plates.plateNumber,
      state: plates.state,
      id: plates.id,
      commentCount: sql<number>`cast(count(${plate_reviews.plateId}) as int)`.as(
        'commentCount'
      ),
    })
    .from(plates)
    .leftJoin(plate_reviews, eq(plates.id, plate_reviews.plateId))
    .groupBy(plates.plateNumber, plates.state, plates.id)
    .having(sql`count(${plate_reviews.plateId}) > 0`)
    .orderBy(({ commentCount }) => desc(commentCount))
    .limit(limit);

  if (popularPlates.length === 0) {
    return (
      <div className="h-full text-center place-content-center">
        <p className="text-xl">No recent comments</p>
        <p className="text-xl">Be the first!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {popularPlates.map(async (plate) => (
        <LicensePlateTiny
          key={plate.id}
          plate={
            { plateNumber: plate.plateNumber, state: plate.state } as Plate
          }
        />
      ))}
    </div>
  );
}

function PopularEntriesSkeleton({ limit = 10 }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {skeletons.map((_, index) => (
        <LicensePlateTinySkeleton key={index} />
      ))}
    </div>
  );
}
