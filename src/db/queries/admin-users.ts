import 'server-only';

import {
  avg,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  or,
} from 'drizzle-orm';
import { database } from '@/db/database';
import {
  accounts,
  plates,
  plate_reviews,
  review_likes,
  roles,
  sessions,
  user_favorite_plates,
  user_roles,
  users,
} from '@/db/schema';

function firstCount(rows: { count: number }[]) {
  return rows[0]?.count ?? 0;
}

function nullableNumber(value: string | number | null | undefined) {
  return value == null ? null : Number(value);
}

export async function getAdminUsersPageData(q?: string) {
  const favoriteCountSubquery = database
    .select({
      userId: user_favorite_plates.userId,
      favoriteCount: count().as('favoriteCount'),
    })
    .from(user_favorite_plates)
    .groupBy(user_favorite_plates.userId)
    .as('favoriteCountSubquery');

  const commentCountSubquery = database
    .select({
      userId: plate_reviews.userId,
      commentCount: count().as('commentCount'),
    })
    .from(plate_reviews)
    .groupBy(plate_reviews.userId)
    .as('commentCountSubquery');

  const [userRows, providersResult] = await Promise.all([
    database
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        provider: accounts.providerId,
        favoriteCount: favoriteCountSubquery.favoriteCount,
        commentCount: commentCountSubquery.commentCount,
      })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .leftJoin(favoriteCountSubquery, eq(users.id, favoriteCountSubquery.userId))
      .leftJoin(commentCountSubquery, eq(users.id, commentCountSubquery.userId))
      .where(
        q
          ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`))
          : undefined
      )
      .orderBy(desc(users.createdAt)),
    database.selectDistinct({ provider: accounts.providerId }).from(accounts),
  ]);

  return {
    siteUsers: userRows.map((user) => ({
      ...user,
      favoriteCount: user.favoriteCount ?? 0,
      commentCount: user.commentCount ?? 0,
    })),
    uniqueProviders: providersResult
      .map((r) => r.provider)
      .filter((p): p is string => p !== null)
      .sort(),
  };
}

export async function getAdminUserDetail(id: string) {
  const userPromise = database.query.users.findFirst({
    where: eq(users.id, id),
  });

  const reviewLikeCounts = database
    .select({
      reviewId: review_likes.reviewId,
      likeCount: count().as('likeCount'),
    })
    .from(review_likes)
    .groupBy(review_likes.reviewId)
    .as('reviewLikeCounts');

  const [
    user,
    accountRows,
    roleRows,
    reviewStatsRows,
    favoriteCountRows,
    createdPlateCountRows,
    likedReviewCountRows,
    sessionRows,
    recentReviews,
    createdPlates,
    favoritePlates,
    likedReviews,
  ] = await Promise.all([
    userPromise,
    database
      .select({
        provider: accounts.providerId,
        createdAt: accounts.createdAt,
        updatedAt: accounts.updatedAt,
      })
      .from(accounts)
      .where(eq(accounts.userId, id))
      .orderBy(desc(accounts.createdAt)),
    database
      .select({ name: roles.name })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.roleId, roles.id))
      .where(eq(user_roles.userId, id))
      .orderBy(roles.name),
    database
      .select({
        reviewCount: count(),
        averageRating: avg(plate_reviews.rating),
      })
      .from(plate_reviews)
      .where(eq(plate_reviews.userId, id)),
    database
      .select({ count: count() })
      .from(user_favorite_plates)
      .where(eq(user_favorite_plates.userId, id)),
    database
      .select({ count: count() })
      .from(plates)
      .where(eq(plates.userId, id)),
    database
      .select({ count: count() })
      .from(review_likes)
      .where(eq(review_likes.userId, id)),
    database
      .select({
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
        expiresAt: sessions.expiresAt,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
      })
      .from(sessions)
      .where(eq(sessions.userId, id))
      .orderBy(desc(sessions.updatedAt))
      .limit(5),
    database
      .select({
        id: plate_reviews.id,
        plateId: plates.id,
        rating: plate_reviews.rating,
        comment: plate_reviews.comment,
        createdAt: plate_reviews.createdAt,
        updatedAt: plate_reviews.updatedAt,
        plateNumber: plates.plateNumber,
        state: plates.state,
        likeCount: reviewLikeCounts.likeCount,
      })
      .from(plate_reviews)
      .innerJoin(plates, eq(plate_reviews.plateId, plates.id))
      .leftJoin(reviewLikeCounts, eq(plate_reviews.id, reviewLikeCounts.reviewId))
      .where(eq(plate_reviews.userId, id))
      .orderBy(desc(plate_reviews.createdAt))
      .limit(12),
    database
      .select({
        id: plates.id,
        plateNumber: plates.plateNumber,
        state: plates.state,
        timestamp: plates.timestamp,
        reviewCount: countDistinct(plate_reviews.id),
      })
      .from(plates)
      .leftJoin(plate_reviews, eq(plates.id, plate_reviews.plateId))
      .where(eq(plates.userId, id))
      .groupBy(plates.id)
      .orderBy(desc(plates.timestamp))
      .limit(8),
    database
      .select({
        plateId: plates.id,
        plateNumber: plates.plateNumber,
        state: plates.state,
        timestamp: plates.timestamp,
      })
      .from(user_favorite_plates)
      .innerJoin(plates, eq(user_favorite_plates.plateId, plates.id))
      .where(eq(user_favorite_plates.userId, id))
      .orderBy(desc(plates.timestamp))
      .limit(8),
    database
      .select({
        reviewId: plate_reviews.id,
        plateId: plates.id,
        rating: plate_reviews.rating,
        comment: plate_reviews.comment,
        createdAt: plate_reviews.createdAt,
        plateNumber: plates.plateNumber,
        state: plates.state,
      })
      .from(review_likes)
      .innerJoin(plate_reviews, eq(review_likes.reviewId, plate_reviews.id))
      .innerJoin(plates, eq(plate_reviews.plateId, plates.id))
      .where(eq(review_likes.userId, id))
      .orderBy(desc(plate_reviews.createdAt))
      .limit(6),
  ]);

  if (!user) return null;

  const reviewStats = reviewStatsRows[0];

  return {
    user,
    accountRows,
    roleRows,
    stats: {
      reviewCount: reviewStats?.reviewCount ?? 0,
      favoriteCount: firstCount(favoriteCountRows),
      createdPlateCount: firstCount(createdPlateCountRows),
      likedReviewCount: firstCount(likedReviewCountRows),
      averageRating: nullableNumber(reviewStats?.averageRating),
    },
    sessionRows,
    recentReviews: recentReviews.map((review) => ({
      ...review,
      likeCount: review.likeCount ?? 0,
    })),
    createdPlates,
    favoritePlates,
    likedReviews,
  };
}
