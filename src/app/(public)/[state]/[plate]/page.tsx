import { validateLicensePlate, Plate } from '@/lib/plates';
import { stateNameValidator } from '@/lib/us-states';
import LicensePlate from '@/components/public/license-plate';
import CommentsSection from '@/components/public/comments/comments-section';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchCard from '@/components/public/search-card/search-card';

import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ state: string; plate: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { state, plate } = await params;
  const upperState = state.toUpperCase();
  const upperPlate = plate.toUpperCase();

  if (
    !validateLicensePlate(upperPlate, 'US') ||
    !(await stateNameValidator(upperState))
  ) {
    return {
      title: 'Rate My Plate',
      description: 'Search Yours Today',
    };
  }

  return {
    title: `${upperPlate} in ${upperState}`,
    description: `View comments for license plate ${upperPlate} in ${upperState}`,
  };
}

export default async function PlatePage({ params }: Props) {
  const { state, plate } = await params;
  const upperState = state.toUpperCase();
  const upperPlate = plate.toUpperCase();

  if (
    !validateLicensePlate(upperPlate, 'US') ||
    !(await stateNameValidator(upperState))
  ) {
    return (
      <div className="container flex flex-col gap-5 py-10 items-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            This is not a valid license plate. I&apos;ve provided a search form
            below to help you find the right one.
          </AlertDescription>
        </Alert>
        <SearchCard />
      </div>
    );
  }

  return (
    <div className="container flex flex-col gap-20 py-10 items-center">
      <LicensePlate
        plate={{ state: upperState, plateNumber: upperPlate } as Plate}
      />
      <CommentsSection state={upperState} plateNumber={upperPlate} />
    </div>
  );
}
