import React from 'react';
import { database } from '@/db/database';
import { auth, isUserAdmin } from '@/auth';
import { sql } from 'drizzle-orm';
import { PlateStatePieChartRender } from '@/components/dashboard/charts/plate-state-pie-chart-render';
import { accounts } from '@/db/schema';
import { State, usStates } from '@/lib/us-states';
import { OAuthPlatformPieChartRender } from './oauth-platform-pie-chart-render';

export default async function OAuthPlatformPieChart() {
  const session = await auth();
  if (!session) {
    return <p>NOT AUTHENTICATED</p>;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <p>NOT AUTHENTICATED</p>;
  }

  const plateCountByState = await database
    .select({
      provider: accounts.providerId,
      providerCount: sql<number>`cast(count(${accounts.providerId}) as int)`.as(
        'providerCount'
      ),
    })
    .from(accounts)
    .groupBy(accounts.providerId);

  return <OAuthPlatformPieChartRender data={plateCountByState} />;
}
