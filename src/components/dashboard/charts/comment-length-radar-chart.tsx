import React from 'react';
import CommentLengthRadarChartRender from './comment-length-radar-chart-render';
import { database } from '@/db/database';
import { plate_reviews } from '@/db/schema';
import { sql } from 'drizzle-orm';

export default async function CommentLengthRadarChart() {
  const chartData = await database
    .select({
      commentLengthGroup: sql<string>`
        CASE
          WHEN length(${plate_reviews.comment}) <= 10 THEN '10'
          WHEN length(${plate_reviews.comment}) <= 25 THEN '25'
          WHEN length(${plate_reviews.comment}) <= 50 THEN '50'
          WHEN length(${plate_reviews.comment}) <= 100 THEN '100'
          WHEN length(${plate_reviews.comment}) <= 150 THEN '150'
          ELSE '254'
        END
      `.as('comment_length_group'),
      count: sql<number>`cast(count(*) as int)`.as('count'),
    })
    .from(plate_reviews)
    .groupBy(sql`
      CASE
        WHEN length(${plate_reviews.comment}) <= 10 THEN '10'
        WHEN length(${plate_reviews.comment}) <= 25 THEN '25'
        WHEN length(${plate_reviews.comment}) <= 50 THEN '50'
        WHEN length(${plate_reviews.comment}) <= 100 THEN '100'
        WHEN length(${plate_reviews.comment}) <= 150 THEN '150'
        ELSE '254'
      END
    `);

  return <CommentLengthRadarChartRender data={chartData} />;
}
