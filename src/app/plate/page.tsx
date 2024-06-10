'use client';

import { useSearchParams } from 'next/navigation';
import { validateLicensePlate } from '@/lib/plates';

export default function Plate() {
  const searchParams = useSearchParams();

  const plateNumber = searchParams.get('plate');
  const state = searchParams.get('state');

  console.log(plateNumber, state);

  if (
    plateNumber === null ||
    state === null ||
    !validateLicensePlate(plateNumber, 'US')
  ) {
    return (
      <div className='container flex flex-col gap-5 py-10 items-center'>
        <p>Invalid plate number or state</p>
      </div>
    );
  }

  return (
    <div className='container flex flex-col gap-5 py-10 items-center'>
      <div className=' flex flex-col justify-center items-center p-10 uppercase'>
        <p>{plateNumber}</p>
      </div>
    </div>
  );
}
