import type { plates } from '@/db/schema';
import { validateLicensePlate } from '@/lib/plates';
import { stateNameValidator } from '@/lib/us-states';
import { database } from '@/db/database';
type Plate = typeof plates.$inferSelect;
import LicensePlate from '@/components/public/license-plate';
import CommentsSection from '@/components/public/comments/comments-section';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchCard from '@/components/public/search-card/search-card';

import type { Metadata, ResolvingMetadata } from 'next';
import BreadCrumbs from '@/components/bread-crumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

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
  const { state, plate: plateNumber } = await params;
  const upperState = state.toUpperCase();
  const upperPlate = plateNumber.toUpperCase();

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

  let plate: Plate | undefined;

  try {
    plate = await database.query.plates.findFirst({
      where: (plates, { and, eq }) =>
        and(eq(plates.state, upperState), eq(plates.plateNumber, upperPlate)),
    });
  } catch (error) {
    console.error('PLATE ERROR', error);
  }

  return (
    <div className=" flex flex-col gap-20 max-w-6xl mx-auto px-5 mb-10">
      <BreadCrumbs />
      <div className="flex flex-col gap-5 md:gap-5 md:flex-row">
        <div className="flex min-w-82 flex-col">
          <Card>
            <CardContent className="">
              <div className="rounded-lg bg-accent p-2  flex items-center justify-center">
                <LicensePlate
                  plate={{ state: upperState, plateNumber: upperPlate }}
                />
              </div>
              <div className="flex flex-col pt-4 gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-center text-xl">{upperPlate}</p>
                  {plate && <p>First reported [ADD FIRST REPORTED] </p>}
                </div>
                <Separator className="" />
                {plate && (
                  <div className="flex flex-row justify-between">
                    <p className=" text-xs">Last Sighted</p>
                    <p>[ADD LAST SIGHTED]</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex grow">
          {' '}
          <CommentsSection state={upperState} plateNumber={upperPlate} />
        </div>
      </div>
    </div>
  );
}
