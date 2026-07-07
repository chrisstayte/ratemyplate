import 'server-only';

import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { database } from '@/db/database';
import { plate_reviews, plates, review_likes, users } from '@/db/schema';

export async function getAdminCommentsPageData(q?: string) {
  const [siteComments, statesResult] = await Promise.all([
    database
      .select({
        id: plate_reviews.id,
        plateId: plate_reviews.plateId,
        comment: plate_reviews.comment,
        timestamp: plate_reviews.createdAt,
        userEmail: users.email,
        plateNumber: plates.plateNumber,
        state: plates.state,
      })
      .from(plate_reviews)
      .leftJoin(users, eq(plate_reviews.userId, users.id))
      .leftJoin(plates, eq(plate_reviews.plateId, plates.id))
      .where(
        q
          ? or(
              ilike(plates.plateNumber, `%${q}%`),
              ilike(users.email, `%${q}%`),
              ilike(plate_reviews.comment, `%${q}%`)
            )
          : undefined
      )
      .orderBy(desc(plate_reviews.createdAt)),
    database.selectDistinct({ state: plates.state }).from(plates),
  ]);

  return {
    siteComments,
    uniqueStates: statesResult
      .map((r) => r.state)
      .filter((s): s is string => s !== null)
      .sort(),
  };
}

export async function getAdminCommentDetail(commentId: number) {
  const likeCountSubquery = database
    .select({
      reviewId: review_likes.reviewId,
      likeCount: count().as('likeCount'),
    })
    .from(review_likes)
    .groupBy(review_likes.reviewId)
    .as('likeCountSubquery');

  const [commentRows, likedByRows] = await Promise.all([
    database
      .select({
        id: plate_reviews.id,
        plateId: plate_reviews.plateId,
        authorId: plate_reviews.userId,
        rating: plate_reviews.rating,
        comment: plate_reviews.comment,
        createdAt: plate_reviews.createdAt,
        updatedAt: plate_reviews.updatedAt,
        authorName: users.name,
        authorEmail: users.email,
        plateNumber: plates.plateNumber,
        state: plates.state,
        likeCount: likeCountSubquery.likeCount,
      })
      .from(plate_reviews)
      .leftJoin(users, eq(plate_reviews.userId, users.id))
      .leftJoin(plates, eq(plate_reviews.plateId, plates.id))
      .leftJoin(likeCountSubquery, eq(plate_reviews.id, likeCountSubquery.reviewId))
      .where(eq(plate_reviews.id, commentId))
      .limit(1),
    database
      .select({
        userId: review_likes.userId,
        name: users.name,
        email: users.email,
      })
      .from(review_likes)
      .leftJoin(users, eq(review_likes.userId, users.id))
      .where(eq(review_likes.reviewId, commentId))
      .orderBy(desc(users.createdAt))
      .limit(12),
  ]);

  const comment = commentRows[0];
  if (!comment) return null;

  return {
    comment: {
      ...comment,
      likeCount: comment.likeCount ?? 0,
    },
    likedByRows,
  };
}
