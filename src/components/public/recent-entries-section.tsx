import { Card } from '@/components/ui/card';
import * as React from 'react';
import { database } from '@/db/database';
import { desc, eq, sql, gt } from 'drizzle-orm';
import { comments, plates } from '@/db/schema';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Plate } from '@/lib/plates';
import LicensePlateTiny from '@/components/public/license-plate-tiny';

export default function RecentEntriesSection() {
  const numberOfEntriesToDisplay = 10;

  return (
    <div className='flex flex-col gap-5 justify-center w-full h-full'>
      <p className='text-2xl '>Recent Comments</p>
      <Suspense
        fallback={<RecentEntriesSkeleton limit={numberOfEntriesToDisplay} />}>
        <RecentEntries limit={numberOfEntriesToDisplay} />
      </Suspense>
    </div>
  );
}

async function RecentEntries({ limit = 10 }) {
  const recentPlates = await database
    .select({
      id: plates.id,
      plateNumber: plates.plateNumber,
      state: plates.state,
      timestamp: plates.timestamp,
      commentCount: sql<number>`cast(count(${comments.plateId}) as int)`.as(
        'commentCount'
      ),
    })
    .from(plates)
    .groupBy(plates.plateNumber, plates.state, plates.id)
    .leftJoin(comments, eq(plates.id, comments.plateId))
    .having(sql`count(${comments.plateId}) > 0`)
    .orderBy(({ timestamp }) => desc(timestamp))
    .limit(limit);

  if (recentPlates.length === 0) {
    return (
      <div className='h-full text-center place-content-center'>
        <p className='text-xl'>No recent comments</p>
        <p className='text-xl'>Be the first!</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 '>
      {recentPlates.map(async (plate) => (
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

function RecentEntriesSkeleton({ limit = 10 }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
      {skeletons.map((_, index) => (
        <EntrySkeleton key={index} />
      ))}
    </div>
  );
}

function EntrySkeleton() {
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
