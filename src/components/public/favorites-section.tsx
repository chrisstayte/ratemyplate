import { Card } from '@/components/ui/card';
import * as React from 'react';
import { database } from '@/db/database';
import { desc, eq, and } from 'drizzle-orm';
import { plates, user_favorite_plates } from '@/db/schema';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Plate } from '@/lib/plates';
import LicensePlateTiny from '@/components/public/license-plate-tiny';
import { auth } from '@/auth';

export default function FavoritesSection() {
  const numberOfEntriesToDisplay = 10;

  return (
    <div className='flex flex-col gap-5 justify-center w-full'>
      <p className='text-2xl '>Favorites</p>
      <Suspense
        fallback={<FavoritePlatesSkeleton limit={numberOfEntriesToDisplay} />}>
        <FavoritePlates limit={numberOfEntriesToDisplay} />
      </Suspense>
    </div>
  );
}

async function FavoritePlates({ limit = 10 }) {
  const session = await auth();

  const userId = session!.user!.id!;

  const favoritePlates = await database
    .select({
      plateNumber: plates.plateNumber,
      state: plates.state,
      id: plates.id,
      timestamp: plates.timestamp,
    })
    .from(plates)

    .leftJoin(
      user_favorite_plates,
      and(eq(plates.id, user_favorite_plates.plateId))
    )
    .where(eq(user_favorite_plates.userId, userId))
    .orderBy(desc(plates.timestamp))
    .limit(limit);

  if (favoritePlates.length === 0) {
    return (
      <div className='h-full text-center place-content-center'>
        <p className='text-xl'>No favorites</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 '>
      {favoritePlates.map(async (plate) => (
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

function FavoritePlatesSkeleton({ limit = 10 }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
      {skeletons.map((_, index) => (
        <PlateSkeleton key={index} />
      ))}
    </div>
  );
}

function PlateSkeleton() {
  return (
    <Card className='aspect-video flex flex-col justify-center items-center'>
      <div className='flex flex-col h-full relative p-1 w-full items-center'>
        <Skeleton className='w-full max-w-[50px] h-[20px] ' />
        <div className='absolute inset-0 flex items-center justify-center uppercase'>
          <Skeleton className='w-full max-w-[100px] h-[20px] ' />
        </div>
      </div>
    </Card>
  );
}
