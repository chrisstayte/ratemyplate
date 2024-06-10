import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import * as React from 'react';
import { auth } from '@/auth';
import { database } from '@/db/database';
import { Badge } from '@/components/ui/badge';
import { desc, asc } from 'drizzle-orm';
import { plates } from '@/db/schema';

export default async function RecentEntriesSection() {
  const session = await auth();

  // if (!session?.user) {
  //   return <div>Not authenticated</div>;
  // }

  const recentPlates = await database.query.plates.findMany({
    orderBy: [desc(plates.timestamp)],
    limit: 10,
  });

  return (
    <div className='flex flex-col gap-10 justify-center container '>
      <p className='text-2xl'>Recent reviews</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
        {recentPlates.map((review) => (
          <Card
            key={review.id}
            className='aspect-video flex flex-col justify-center items-center'>
            <div className='flex flex-col h-full relative'>
              <div className='self-start'>
                <Badge className='bg-blue-500 text-white'>{review.state}</Badge>
              </div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-xl'>{review.plateNumber}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* <Carousel className='w-full max-w-sm'>
        <CarouselContent className='-ml-1'>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='pl-1 md:basis-1/2 lg:basis-1/3'>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-2xl font-semibold'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
    </div>
  );
}
