import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Plate } from '@/lib/plates';
import { cn } from '@/lib/utils';
import PlateArtwork from './plate-artwork';

interface LicensePlateTinyProps {
  plate: Plate;
  className?: string;
}

export default function LicensePlateTiny({
  plate,
  className,
}: LicensePlateTinyProps) {
  return (
    <Link
      href={`/${plate.state}/${plate.plateNumber}`}
      className={cn(
        'block min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        className
      )}
    >
      <PlateArtwork plate={plate} />
    </Link>
  );
}

export function LicensePlateTinySkeleton() {
  return <Skeleton className="aspect-[2/1] w-full rounded-lg" />;
}
