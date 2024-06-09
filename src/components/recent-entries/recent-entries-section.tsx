import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import * as React from 'react';

export default function RecentEntriesSection() {
  return (
    <div className='min-h-72  flex flex-col gap-10 items-center justify-center'>
      <p className='text-2xl'>Recent reviews</p>
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
