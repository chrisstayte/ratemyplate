import { Card } from '@/components/ui/card';
import * as React from 'react';
import { database } from '@/db/database';
import { Suspense } from 'react';
import { sql, desc, eq } from 'drizzle-orm';
import { Skeleton } from '@/components/ui/skeleton';
import { Plate } from '@/lib/plates';
import { plates, user_favorite_plates } from '@/db/schema';

import LicensePlateTiny, {
  LicensePlateTinySkeleton,
} from '@/components/public/license-plate-tiny';

export default function MostFavoritedPlatesSection() {
  const numberOfEntriesToDisplay = 10;

  return (
    <div className='flex flex-col gap-5 justify-center w-full h-full'>
      <p className='text-2xl'>Favorited Drivers</p>
      <Suspense
        fallback={<FavoritedPlatesSkeleton limit={numberOfEntriesToDisplay} />}>
        <FavoritedPlates limit={numberOfEntriesToDisplay} />
      </Suspense>
    </div>
  );
}

async function FavoritedPlates({ limit = 10 }) {
  // give me the plateNumber, state, id, and count of comments for each plate
  // sort by the count of comments in descending order
  // limit the result to the number of entries to display
  // only give me plates that have at least one comment
  const popularPlates = await database
    .select({
      plateNumber: plates.plateNumber,
      state: plates.state,
      id: plates.id,
      favoriteCount:
        sql<number>`cast(count(${user_favorite_plates.plateId}) as int)`.as(
          'favoriteCount'
        ),
    })
    .from(plates)
    .leftJoin(user_favorite_plates, eq(plates.id, user_favorite_plates.plateId))
    .groupBy(plates.plateNumber, plates.state, plates.id)
    .having(sql`count(${user_favorite_plates.plateId}) > 0`)
    .orderBy(({ favoriteCount }) => desc(favoriteCount))
    .limit(limit);

  if (popularPlates.length === 0) {
    return (
      <div className='h-full text-center place-content-center'>
        <p className='text-xl'>No favorited plates</p>
        <p className='text-xl'>Be the first!</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
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

function FavoritedPlatesSkeleton({ limit = 10 }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
      {skeletons.map((_, index) => (
        <LicensePlateTinySkeleton key={index} />
      ))}
    </div>
  );
}
