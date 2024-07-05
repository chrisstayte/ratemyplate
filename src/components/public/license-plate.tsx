import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usStateName } from '@/lib/us-states';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { Plate } from '@/lib/plates';
interface LicensePlateProps {
  plate: Plate;
  className?: string;
}

const LicensePlate: React.FC<LicensePlateProps> = async ({
  plate,
  className,
}) => {
  const stateName = await usStateName(plate.state);

  // check if license plate image exists
  // const imagePath = path.join(
  //   process.cwd(),
  //   'public',
  //   'images',
  //   'state-plates',
  //   `${stateName}.svg`
  // );

  // console.log(imagePath);
  // const imageExists = fs.existsSync(imagePath);
  const imageExists = false;

  if (imageExists) {
    return (
      <div
        className={`select-none flex flex-col items-center h-full max-h-52 relative w-full max-w-96 p-3 aspect-video  rounded-lg   ${className}`}>
        {/* <Image
          className='rounded-xl shadow-lg'
          alt={`License plate for ${stateName}`}
          fill
          style={{ objectFit: 'cover' }}
          src={`/images/state-plates/${stateName}.svg`}
        /> */}
        <div className='absolute inset-0 flex items-center justify-center uppercase'>
          <p className='text-4xl md:text-5xl'>{plate.plateNumber}</p>
        </div>
      </div>
    );
  } else {
    return (
      <Card
        className={`select-none flex flex-col items-center h-full max-h-52 relative w-full max-w-96 p-3 aspect-video shadow-sm ${className}`}>
        {plate.state && <Badge className='text-xl'>{stateName}</Badge>}
        <div className='absolute inset-0 flex items-center justify-center uppercase'>
          <p className='text-4xl'>{plate.plateNumber}</p>
        </div>
      </Card>
    );
  }
};

export default LicensePlate;
