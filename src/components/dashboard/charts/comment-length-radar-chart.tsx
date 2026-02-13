import React from 'react';
import CommentLengthRadarChartRender from './comment-length-radar-chart-render';
import { getCurrentUser, isUserAdmin } from '@/lib/auth';
import { database } from '@/db/database';
import { comments } from '@/db/schema';
import { sql } from 'drizzle-orm';

export default async function CommentLengthRadarChart() {
  const session = await getCurrentUser();
  if (!session) {
    return <p>NOT AUTHENTICATED</p>;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <p>NOT AUTHENTICATED</p>;
  }

  const commentLengths = await database
    .select({
      length: sql<number>`length(${comments.comment})`.as('length'),
    })
    .from(comments);

  const commentLengthsGrouped = commentLengths.reduce<{
    [key: string]: number;
  }>((acc, curr) => {
    const length = curr.length;

    if (length <= 10) {
      acc['10'] = (acc['10'] || 0) + 1;
    } else if (length <= 25) {
      acc['25'] = (acc['25'] || 0) + 1;
    } else if (length <= 50) {
      acc['50'] = (acc['50'] || 0) + 1;
    } else if (length <= 100) {
      acc['100'] = (acc['100'] || 0) + 1;
    } else if (length <= 150) {
      acc['150'] = (acc['150'] || 0) + 1;
    } else {
      acc['254'] = (acc['254'] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(commentLengthsGrouped).map(
    ([key, value]) => ({
      commentLengthGroup: key,
      count: value,
    })
  );

  return <CommentLengthRadarChartRender data={chartData} />;
}
