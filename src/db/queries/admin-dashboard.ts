import 'server-only';

import {
  avg,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  lte,
  max,
  sql,
} from 'drizzle-orm';
import { database } from '@/db/database';
import {
  accounts,
  plates,
  plate_reviews,
  review_likes,
  user_favorite_plates,
  users,
} from '@/db/schema';

function firstCount(rows: { count: number }[]) {
  return rows[0]?.count ?? 0;
}

function nullableNumber(value: string | number | null | undefined) {
  return value == null ? null : Number(value);
}

function latestDate(
  first: Date | null | undefined,
  second: Date | null | undefined
) {
  if (!first) return second ?? null;
  if (!second) return first;
  return first > second ? first : second;
}

export async function getAdminDashboardData(recentWindowDays: number) {
  const recentStart = new Date(
    Date.now() - recentWindowDays * 24 * 60 * 60 * 1000
  );

  const reviewLikeCounts = database
    .select({
      reviewId: review_likes.reviewId,
      likeCount: count().as('likeCount'),
    })
    .from(review_likes)
    .groupBy(review_likes.reviewId)
    .as('reviewLikeCounts');

  const [
    userResult,
    plateResult,
    commentResult,
    favoriteResult,
    likeResult,
    recentUserResult,
    recentPlateResult,
    recentCommentResult,
    averageRatingResult,
    positiveResult,
    criticalResult,
    averageLengthResult,
    recentCommentRows,
    topPlateRows,
    stateRows,
    activeUsers,
    providerRows,
  ] = await Promise.all([
    database.select({ count: count() }).from(users),
    database.select({ count: count() }).from(plates),
    database.select({ count: count() }).from(plate_reviews),
    database.select({ count: count() }).from(user_favorite_plates),
    database.select({ count: count() }).from(review_likes),
    database
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, recentStart)),
    database
      .select({ count: count() })
      .from(plates)
      .where(gte(plates.timestamp, recentStart)),
    database
      .select({ count: count() })
      .from(plate_reviews)
      .where(gte(plate_reviews.createdAt, recentStart)),
    database
      .select({ averageRating: avg(plate_reviews.rating) })
      .from(plate_reviews),
    database
      .select({ count: count() })
      .from(plate_reviews)
      .where(gte(plate_reviews.rating, 4)),
    database
      .select({ count: count() })
      .from(plate_reviews)
      .where(lte(plate_reviews.rating, 2)),
    database
      .select({
        averageLength: avg(sql<number>`length(${plate_reviews.comment})`),
      })
      .from(plate_reviews),
    database
      .select({
        id: plate_reviews.id,
        plateId: plate_reviews.plateId,
        comment: plate_reviews.comment,
        rating: plate_reviews.rating,
        createdAt: plate_reviews.createdAt,
        updatedAt: plate_reviews.updatedAt,
        userEmail: users.email,
        userName: users.name,
        plateNumber: plates.plateNumber,
        state: plates.state,
        likeCount: reviewLikeCounts.likeCount,
      })
      .from(plate_reviews)
      .leftJoin(users, eq(plate_reviews.userId, users.id))
      .leftJoin(plates, eq(plate_reviews.plateId, plates.id))
      .leftJoin(reviewLikeCounts, eq(plate_reviews.id, reviewLikeCounts.reviewId))
      .orderBy(desc(plate_reviews.createdAt))
      .limit(40),
    database
      .select({
        id: plates.id,
        plateNumber: plates.plateNumber,
        state: plates.state,
        timestamp: plates.timestamp,
        reviewCount: countDistinct(plate_reviews.id),
        favoriteCount: countDistinct(user_favorite_plates.userId),
        averageRating: avg(plate_reviews.rating),
        lastReviewAt: max(plate_reviews.createdAt),
      })
      .from(plates)
      .leftJoin(plate_reviews, eq(plates.id, plate_reviews.plateId))
      .leftJoin(user_favorite_plates, eq(plates.id, user_favorite_plates.plateId))
      .groupBy(plates.id)
      .orderBy(
        desc(countDistinct(plate_reviews.id)),
        desc(countDistinct(user_favorite_plates.userId))
      )
      .limit(6),
    database
      .select({
        state: plates.state,
        plateCount: countDistinct(plates.id),
        reviewCount: countDistinct(plate_reviews.id),
        averageRating: avg(plate_reviews.rating),
      })
      .from(plates)
      .leftJoin(plate_reviews, eq(plates.id, plate_reviews.plateId))
      .groupBy(plates.state)
      .orderBy(desc(countDistinct(plates.id)))
      .limit(8),
    database
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        provider: accounts.providerId,
        commentCount: countDistinct(plate_reviews.id),
        favoriteCount: countDistinct(user_favorite_plates.plateId),
      })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .leftJoin(plate_reviews, eq(users.id, plate_reviews.userId))
      .leftJoin(user_favorite_plates, eq(users.id, user_favorite_plates.userId))
      .groupBy(users.id, accounts.providerId)
      .orderBy(
        desc(countDistinct(plate_reviews.id)),
        desc(countDistinct(user_favorite_plates.plateId))
      )
      .limit(6),
    database
      .select({
        provider: accounts.providerId,
        count: count(),
      })
      .from(accounts)
      .groupBy(accounts.providerId),
  ]);

  return {
    totalUsers: firstCount(userResult),
    totalPlates: firstCount(plateResult),
    totalComments: firstCount(commentResult),
    totalFavorites: firstCount(favoriteResult),
    totalLikes: firstCount(likeResult),
    recentUsers: firstCount(recentUserResult),
    recentPlates: firstCount(recentPlateResult),
    recentCommentsCount: firstCount(recentCommentResult),
    ratingStats: {
      averageRating: nullableNumber(averageRatingResult[0]?.averageRating),
      positiveCount: firstCount(positiveResult),
      criticalCount: firstCount(criticalResult),
      averageLength: Math.round(
        nullableNumber(averageLengthResult[0]?.averageLength) ?? 0
      ),
    },
    recentComments: recentCommentRows.map((comment) => ({
      ...comment,
      likeCount: comment.likeCount ?? 0,
    })),
    topPlates: topPlateRows.map((plate) => ({
      id: plate.id,
      plateNumber: plate.plateNumber,
      state: plate.state,
      reviewCount: plate.reviewCount,
      favoriteCount: plate.favoriteCount,
      averageRating: nullableNumber(plate.averageRating),
      lastActivity: latestDate(plate.timestamp, plate.lastReviewAt),
    })),
    stateRows: stateRows.map((row) => ({
      ...row,
      averageRating: nullableNumber(row.averageRating),
    })),
    activeUsers,
    providerRows,
  };
}
