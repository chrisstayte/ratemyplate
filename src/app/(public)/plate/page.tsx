import { validateLicensePlate, Plate } from '@/lib/plates';
import { stateNameValidator } from '@/lib/us-states';
import LicensePlate from '@/components/public/license-plate';
import CommentsSection from '@/components/public/comments/comments-section';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchCard from '@/components/public/search-card/search-card';

import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const plateNumber = (searchParams?.plate as string) ?? null;
  const state = (searchParams?.state as string) ?? null;

  if (
    plateNumber === null ||
    state === null ||
    !(await validateLicensePlate(plateNumber, 'US')) ||
    !(await stateNameValidator(state))
  ) {
    return {
      title: 'Rate My Plate',
      description: 'Search Yours Today',
    };
  }

  return {
    title: `${plateNumber} in ${state}`,
    description: `View comments for license plate ${plateNumber} in ${state}`,
  };
}

export default async function PlatePage(props: Props) {
  const searchParams = await props.searchParams;
  const plateNumber = (searchParams?.plate as string) ?? null;
  const state = (searchParams?.state as string) ?? null;

  if (
    plateNumber === null ||
    state === null ||
    !(await validateLicensePlate(plateNumber, 'US')) ||
    !(await stateNameValidator(state))
  ) {
    return (
      <div className='container flex flex-col gap-5 py-10 items-center'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
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
    <div className='container flex flex-col gap-20 py-10 items-center'>
      <LicensePlate
        plate={{ state: state, plateNumber: plateNumber } as Plate}
      />
      <CommentsSection state={state} plateNumber={plateNumber} />
    </div>
  );
}
