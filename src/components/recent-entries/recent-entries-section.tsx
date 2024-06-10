import { Card } from '@/components/ui/card';
import * as React from 'react';
import { auth } from '@/auth';
import { database } from '@/db/database';
import { Badge } from '@/components/ui/badge';
import { desc, asc } from 'drizzle-orm';
import { plates } from '@/db/schema';

import { usStateName } from '@/lib/us-states';

export default async function RecentEntriesSection() {
  const recentPlates = await database.query.plates.findMany({
    orderBy: [desc(plates.timestamp)],
    limit: 10,
  });

  return (
    <div className='flex flex-col gap-10 justify-center container '>
      <p className='text-2xl'>Recent reviews</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
        {recentPlates.map(async (plate) => (
          <Card
            key={plate.id}
            className='aspect-video flex flex-col justify-center items-center'>
            <div className='flex flex-col h-full relative p-1'>
              <Badge className='bg-blue-500 text-white'>
                {await usStateName(plate.state)}
              </Badge>
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-xl'>{plate.plateNumber}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
