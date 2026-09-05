import type { Plate } from '@/lib/plates';
import { cn } from '@/lib/utils';
import PlateArtwork from './plate-artwork';

interface LicensePlateProps {
  plate: Plate;
  className?: string;
}

export default function LicensePlate({ plate, className }: LicensePlateProps) {
  return <PlateArtwork plate={plate} className={cn('max-w-96', className)} />;
}
