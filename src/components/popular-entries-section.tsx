import { Card } from '@/components/ui/card';
import * as React from 'react';
import { database } from '@/db/database';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';
import { sql, asc, desc, gt, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { plates, comments } from '@/db/schema';

import { usStateName } from '@/lib/us-states';

export default function PopularEntriesSection() {
  const numberOfEntriesToDisplay = 10;

  return (
    <div className='flex flex-col gap-5 justify-center w-full h-full'>
      <p className='text-2xl'>Popular Drivers</p>
      <Suspense
        fallback={<PopularEntriesSkeleton limit={numberOfEntriesToDisplay} />}>
        <PopularEntries limit={numberOfEntriesToDisplay} />
      </Suspense>
    </div>
  );
}

async function PopularEntries({ limit = 10 }) {
  const popularPlates = await database
    .select({
      plateNumber: plates.plateNumber,
      state: plates.state,
      id: plates.id,
      commentCount: sql<number>`cast(count(${comments.userId}) as int)`.as(
        'commentCount'
      ),
    })
    .from(plates)
    .leftJoin(comments, eq(plates.id, comments.plateId))
    .groupBy(plates.plateNumber, plates.state, plates.id)
    .orderBy(({ commentCount }) => desc(commentCount))
    .limit(limit);

  if (popularPlates.length === 0) {
    return (
      <div className='h-full text-center place-content-center'>
        <p className='text-xl'>No recent comments</p>
        <p className='text-xl'>Be the first!</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
      {popularPlates.map(async (plate) => (
        <Link
          key={plate.id}
          href={`/plate?plate=${plate.plateNumber}&state=${plate.state}`}>
          {/* <LicensePlate plateNumber={plate.plateNumber} state={plate.state} /> */}
          <Card className='aspect-video flex flex-col justify-center items-center '>
            <div className='flex flex-col h-full relative p-1'>
              <Badge className=''>{usStateName(plate.state)}</Badge>
              <div className='absolute inset-0 flex items-center justify-center uppercase'>
                <p className='text-xl'>{plate.plateNumber}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function PopularEntriesSkeleton({ limit = 10 }) {
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
