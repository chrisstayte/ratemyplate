import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usStateName } from '@/lib/us-states';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Plate } from '@/lib/plates';
import Link from 'next/link';

interface LicensePlateTinyProps {
  plate: Plate;
  className?: string;
}

const LicensePlateTiny: React.FC<LicensePlateTinyProps> = async ({
  plate,
  className,
}) => {
  const stateName = await usStateName(plate.state);

  // console.log('stateName', stateName);

  // check if license plate image exists
  const imagePath = path.join(
    process.cwd(),
    'public',
    'images',
    'state-plates',
    `${stateName}.svg`
  );

  // console.log(imagePath);
  // const imageExists = fs.existsSync(imagePath);
  const imageExists = false;

  // console.log('imageExists', imageExists);

  if (imageExists) {
    return (
      <Link href={`/plate?plate=${plate.plateNumber}&state=${plate.state}`}>
        <div className='flex flex-col items-center h-full max-h-52 relative w-full max-w-96 p-3 aspect-video  rounded-lg   '>
          {/* <Image
            className='rounded-xl shadow-lg'
            alt={`License plate for ${stateName}`}
            fill
            style={{ objectFit: 'cover' }}
            src={`/images/state-plates/${stateName}.svg`}
          /> */}
          <div className='flex flex-col h-full relative p-1'>
            <div className='absolute inset-0 flex items-center justify-center uppercase'>
              <p className='text-2xl'>{plate.plateNumber}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={`/plate?plate=${plate.plateNumber}&state=${plate.state}`}>
        <Card className='aspect-video flex flex-col justify-center items-center '>
          <div className='flex flex-col h-full relative p-1'>
            <Badge className=''>{stateName}</Badge>
            <div className='absolute inset-0 flex items-center justify-center uppercase'>
              <p className='text-xl'>{plate.plateNumber}</p>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
};

export function LicensePlateTinySkeleton() {
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

export default LicensePlateTiny;
