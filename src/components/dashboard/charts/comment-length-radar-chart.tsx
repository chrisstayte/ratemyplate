import React from 'react';
import CommentLengthRadarChartRender from './comment-length-radar-chart-render';
import { database } from '@/db/database';
import { comments } from '@/db/schema';
import { sql } from 'drizzle-orm';

export default async function CommentLengthRadarChart() {
  const chartData = await database
    .select({
      commentLengthGroup: sql<string>`
        CASE
          WHEN length(${comments.comment}) <= 10 THEN '10'
          WHEN length(${comments.comment}) <= 25 THEN '25'
          WHEN length(${comments.comment}) <= 50 THEN '50'
          WHEN length(${comments.comment}) <= 100 THEN '100'
          WHEN length(${comments.comment}) <= 150 THEN '150'
          ELSE '254'
        END
      `.as('comment_length_group'),
      count: sql<number>`cast(count(*) as int)`.as('count'),
    })
    .from(comments)
    .groupBy(sql`
      CASE
        WHEN length(${comments.comment}) <= 10 THEN '10'
        WHEN length(${comments.comment}) <= 25 THEN '25'
        WHEN length(${comments.comment}) <= 50 THEN '50'
        WHEN length(${comments.comment}) <= 100 THEN '100'
        WHEN length(${comments.comment}) <= 150 THEN '150'
        ELSE '254'
      END
    `);

  return <CommentLengthRadarChartRender data={chartData} />;
}
