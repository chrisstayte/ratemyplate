import { validateLicensePlate } from '@/lib/plates';
import { stateNameValidator } from '@/lib/us-states';
import LicensePlate from '@/components/license-plate';
import CommentsSection from '@/components/comments/comments-section';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchCard from '@/components/search-card/search-card';

import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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

export default async function Plate({ searchParams }: Props) {
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
      <LicensePlate plateNumber={plateNumber} state={state} />
      <CommentsSection state={state} plateNumber={plateNumber} />
    </div>
  );
}
