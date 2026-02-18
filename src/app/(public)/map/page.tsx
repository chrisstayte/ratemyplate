import { database } from '@/db/database';
import { plates } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { usStates } from '@/lib/us-states';
import USMap from '@/components/public/map/us-map';

export default async function MapPage() {
  const plateCountByState = await database
    .select({
      state: plates.state,
      plateCount: sql<number>`cast(count(${plates.plateNumber}) as int)`.as(
        'plateCount'
      ),
    })
    .from(plates)
    .groupBy(plates.state);

  const states = await usStates();

  return <USMap plateCountByState={plateCountByState} states={states} />;
}
