import { Card } from '@/components/ui/card';
import * as React from 'react';
import { database } from '@/db/database';
import { Badge } from '@/components/ui/badge';
import { desc } from 'drizzle-orm';
import { plates } from '@/db/schema';
import { Suspense } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

import { usStateName } from '@/lib/us-states';
import LicensePlate from './license-plate';

export default function RecentEntriesSection() {
  const numberOfEntriesToDisplay = 10;

  return (
    <div className='flex flex-col gap-5 justify-center w-full h-full'>
      <p className='text-2xl '>Recent comments</p>
      <Suspense
        fallback={<RecentEntriesSkeleton limit={numberOfEntriesToDisplay} />}>
        <RecentEntries limit={numberOfEntriesToDisplay} />
      </Suspense>
    </div>
  );
}

async function RecentEntries({ limit = 10 }) {
  const recentPlates = await database.query.plates.findMany({
    orderBy: [desc(plates.timestamp)],
    limit: limit,
  });

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
