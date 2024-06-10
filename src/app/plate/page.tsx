import { validateLicensePlate } from '@/lib/plates';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { usStateName, stateNameValidator } from '@/lib/us-states';
import { Button } from '@/components/ui/button';
import LicensePlate from '@/components/license-plate';
import CommentsSection from '@/components/comments/comments-section';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchCard from '@/components/search-card/search-card';

export default async function Plate({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
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
    <div className='container flex flex-col gap-5 py-10 items-center'>
      <LicensePlate plateNumber={plateNumber} state={state} />
      <CommentsSection state={state} plateNumber={plateNumber} />
    </div>
  );
}
