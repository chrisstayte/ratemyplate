import React from 'react';
import { database } from '@/db/database';
import { sql } from 'drizzle-orm';
import { PlateStatePieChartRender } from '@/components/dashboard/charts/plate-state-pie-chart-render';
import { plates } from '@/db/schema';
import { State, usStates } from '@/lib/us-states';

export default async function PlateStatePieChart() {
  const plateCountByState = await database
    .select({
      state: plates.state,
      plateCount: sql<number>`cast(count(${plates.plateNumber}) as int)`.as(
        'commentCount'
      ),
    })
    .from(plates)
    .groupBy(plates.state);

  const states: State[] = await usStates();

  const addColorToState = plateCountByState.map((state) => {
    return {
      ...state,
      stateName:
        states.find((s) => s.abbreviation === state.state)?.name ?? state.state,
      fill: states.find((s) => s.abbreviation === state.state)?.color ?? '',
    };
  });

  return <PlateStatePieChartRender data={addColorToState} />;
}
