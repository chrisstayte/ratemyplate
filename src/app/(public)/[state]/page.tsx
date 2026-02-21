import { notFound } from 'next/navigation';
import { stateNameValidator, usStateName } from '@/lib/us-states';
import { database } from '@/db/database';
import { plates, comments } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import LicensePlateTiny from '@/components/public/license-plate-tiny';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import SearchCard from '@/components/public/search-card/search-card';

import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ state: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { state } = await params;
  const upperState = state.toUpperCase();

  if (!(await stateNameValidator(upperState))) {
    return { title: 'Rate My Plate' };
  }

  const stateName = await usStateName(upperState);

  return {
    title: `Plates in ${stateName}`,
    description: `Browse license plates rated in ${stateName}`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const upperState = state.toUpperCase();

  if (!(await stateNameValidator(upperState))) {
    notFound();
  }

  const stateName = await usStateName(upperState);

  const statePlates = await database
    .select({
      id: plates.id,
      plateNumber: plates.plateNumber,
      state: plates.state,
      commentCount: sql<number>`count(${comments.id})`.as('commentCount'),
    })
    .from(plates)
    .leftJoin(comments, eq(plates.id, comments.plateId))
    .where(eq(plates.state, upperState))
    .groupBy(plates.id, plates.plateNumber, plates.state)
    .orderBy(desc(plates.timestamp));

  return (
    <div className="container flex flex-col gap-10 py-10 items-center">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-4xl font-bold text-center">{stateName}</h1>
        <p className="text-muted-foreground text-center">
          {statePlates.length} {statePlates.length === 1 ? 'plate' : 'plates'}{' '}
          rated
        </p>
      </div>

      {statePlates.length === 0 ? (
        <div className="flex flex-col items-center gap-6 min-w-md">
          <p className="text-lg text-muted-foreground text-center">
            Add the first plate for {stateName} today
          </p>
          <SearchCard />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {statePlates.map((plate) => (
            <LicensePlateTiny
              key={plate.id}
              plate={{
                state: plate.state,
                plateNumber: plate.plateNumber,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
