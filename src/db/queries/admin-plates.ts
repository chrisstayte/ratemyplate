import 'server-only';

import { avg, count, desc, eq, ilike, max } from 'drizzle-orm';
import { database } from '@/db/database';
import {
  plate_reviews,
  plates,
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

export async function getAdminPlatesPageData(q?: string) {
  const favoriteCountSubquery = database
    .select({
      plateId: user_favorite_plates.plateId,
      favoriteCount: count().as('favoriteCount'),
    })
    .from(user_favorite_plates)
    .groupBy(user_favorite_plates.plateId)
    .as('favoriteCountSubquery');

  const commentCountSubquery = database
    .select({
      plateId: plate_reviews.plateId,
      commentCount: count().as('commentCount'),
    })
    .from(plate_reviews)
    .groupBy(plate_reviews.plateId)
    .as('commentCountSubquery');

  const [plateRows, statesResult] = await Promise.all([
    database
      .select({
        id: plates.id,
        state: plates.state,
        plateNumber: plates.plateNumber,
        timestamp: plates.timestamp,
        favoriteCount: favoriteCountSubquery.favoriteCount,
        commentCount: commentCountSubquery.commentCount,
      })
      .from(plates)
      .leftJoin(
        favoriteCountSubquery,
        eq(plates.id, favoriteCountSubquery.plateId)
      )
      .leftJoin(
        commentCountSubquery,
        eq(plates.id, commentCountSubquery.plateId)
      )
      .where(q ? ilike(plates.plateNumber, `%${q}%`) : undefined)
      .orderBy(desc(plates.timestamp)),
    database.selectDistinct({ state: plates.state }).from(plates),
  ]);

  return {
    licensePlates: plateRows.map((plate) => ({
      ...plate,
      favoriteCount: plate.favoriteCount ?? 0,
      commentCount: plate.commentCount ?? 0,
    })),
    uniqueStates: statesResult.map((r) => r.state).sort(),
  };
}

export async function getAdminPlateDetail(plateId: number) {
  const reviewLikeCounts = database
    .select({
      reviewId: review_likes.reviewId,
      likeCount: count().as('likeCount'),
    })
    .from(review_likes)
    .groupBy(review_likes.reviewId)
    .as('reviewLikeCounts');

  const [
    plateRows,
    reviewStatsRows,
    favoriteCountRows,
    likeCountRows,
    reviewRows,
    favoriteRows,
  ] = await Promise.all([
    database
      .select({
        id: plates.id,
        plateNumber: plates.plateNumber,
        state: plates.state,
        timestamp: plates.timestamp,
        creatorId: users.id,
        creatorName: users.name,
        creatorEmail: users.email,
      })
      .from(plates)
      .leftJoin(users, eq(plates.userId, users.id))
      .where(eq(plates.id, plateId))
      .limit(1),
    database
      .select({
        reviewCount: count(),
        averageRating: avg(plate_reviews.rating),
        lastCreatedAt: max(plate_reviews.createdAt),
        lastUpdatedAt: max(plate_reviews.updatedAt),
      })
      .from(plate_reviews)
      .where(eq(plate_reviews.plateId, plateId)),
    database
      .select({ count: count() })
      .from(user_favorite_plates)
      .where(eq(user_favorite_plates.plateId, plateId)),
    database
      .select({ count: count() })
      .from(review_likes)
      .innerJoin(plate_reviews, eq(review_likes.reviewId, plate_reviews.id))
      .where(eq(plate_reviews.plateId, plateId)),
    database
      .select({
        id: plate_reviews.id,
        rating: plate_reviews.rating,
        comment: plate_reviews.comment,
        createdAt: plate_reviews.createdAt,
        updatedAt: plate_reviews.updatedAt,
        authorId: plate_reviews.userId,
        authorName: users.name,
        authorEmail: users.email,
        likeCount: reviewLikeCounts.likeCount,
      })
      .from(plate_reviews)
      .leftJoin(users, eq(plate_reviews.userId, users.id))
      .leftJoin(reviewLikeCounts, eq(plate_reviews.id, reviewLikeCounts.reviewId))
      .where(eq(plate_reviews.plateId, plateId))
      .orderBy(desc(plate_reviews.createdAt))
      .limit(50),
    database
      .select({
        userId: user_favorite_plates.userId,
        name: users.name,
        email: users.email,
      })
      .from(user_favorite_plates)
      .leftJoin(users, eq(user_favorite_plates.userId, users.id))
      .where(eq(user_favorite_plates.plateId, plateId))
      .orderBy(users.email)
      .limit(12),
  ]);

  const plate = plateRows[0];
  if (!plate) return null;

  const reviewStats = reviewStatsRows[0];

  return {
    plate,
    reviewStats: {
      reviewCount: reviewStats?.reviewCount ?? 0,
      averageRating: nullableNumber(reviewStats?.averageRating),
      lastActivity: latestDate(
        reviewStats?.lastCreatedAt,
        reviewStats?.lastUpdatedAt
      ),
    },
    favoriteCount: firstCount(favoriteCountRows),
    likeCount: firstCount(likeCountRows),
    reviewRows: reviewRows.map((review) => ({
      ...review,
      likeCount: review.likeCount ?? 0,
    })),
    favoriteRows,
  };
}
