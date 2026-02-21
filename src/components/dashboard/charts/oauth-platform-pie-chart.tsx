import React from 'react';
import { database } from '@/db/database';
import { sql } from 'drizzle-orm';
import { accounts } from '@/db/schema';
import { OAuthPlatformPieChartRender } from './oauth-platform-pie-chart-render';

export default async function OAuthPlatformPieChart() {
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
