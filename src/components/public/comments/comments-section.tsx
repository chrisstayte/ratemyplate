import { eq, and, sql } from 'drizzle-orm';
import { Plate } from '@/lib/plates';
import { desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { plate_reviews, review_likes } from '@/db/schema';
import { database } from '@/db/database';
import LoginDialog from '../login-dialog';
import { auth } from '@/auth';
import NewCommentButton from './new-comment-button';
import { user_favorite_plates } from '@/db/schema';
import FavoritePlateButton from '@/components/public/favorite-plate-button';
import ReviewLikeButton from './review-like-button';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
  state: string;
  plateNumber: string;
}

export default async function CommentsSection({
  state,
  plateNumber,
}: CommentsSectionProps) {
  const session = await auth();

  const databasePlate = await database.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(eq(plates.plateNumber, plateNumber), eq(plates.state, state)),
  });

  var isFavorite: boolean = false;
  var existingReview: { id: number; rating: number | null; comment: string | null } | undefined;

  if (session && databasePlate) {
    isFavorite = await database
      .select()
      .from(user_favorite_plates)
      .where(
        and(
          eq(user_favorite_plates.userId, session!.user!.id!),
          eq(user_favorite_plates.plateId, databasePlate!.id)
        )
      )
      .execute()
      .then((result) => {
        return result.length > 0;
      });

    const userReview = await database.query.plate_reviews.findFirst({
      where: and(
        eq(plate_reviews.plateId, databasePlate.id),
        eq(plate_reviews.userId, session.user!.id!)
      ),
    });

    if (userReview) {
      existingReview = {
        id: userReview.id,
        rating: userReview.rating,
        comment: userReview.comment,
      };
    }
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <p className="text-2xl font-bold w-full leading-none">Reviews</p>
        {!session && <LoginDialog buttonTitle="Sign in to comment" />}
        {session && (
          <div className="w-full flex flex-row gap-8 justify-between items-center sm:justify-end">
            <FavoritePlateButton
              isFavorite={isFavorite}
              plate={{ state, plateNumber }}
            />
            <NewCommentButton
              plate={{ state, plateNumber }}
              existingReview={existingReview}
            />
          </div>
        )}
      </div>
      <Comments plate={{ state, plateNumber }} />
    </div>
  );
}

async function Comments({
  limit = 10,
  plate,
}: {
  limit?: number;
  plate: Plate;
}) {
  const session = await auth();

  const licensePlate = await database.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(
        eq(plates.plateNumber, plate.plateNumber),
        eq(plates.state, plate.state)
      ),
  });

  if (!licensePlate) {
    return <p className="text-muted-foreground">No comments yet</p>;
  }

  const plateComments = await database.query.plate_reviews.findMany({
    where: (plate_reviews, { eq }) =>
      eq(plate_reviews.plateId, licensePlate?.id),
    orderBy: [desc(plate_reviews.createdAt)],
  });

  if (!plateComments || plateComments.length === 0) {
    return <p className="text-muted-foreground">No comments yet</p>;
  }

  // Fetch like counts for all reviews in one query
  const reviewIds = plateComments.map((c) => c.id);
  const likeCounts = await database
    .select({
      reviewId: review_likes.reviewId,
      count: sql<number>`count(*)`.as('count'),
    })
    .from(review_likes)
    .where(sql`${review_likes.reviewId} in ${reviewIds}`)
    .groupBy(review_likes.reviewId);

  const likeCountMap = new Map(likeCounts.map((l) => [l.reviewId, l.count]));

  // Fetch current user's likes
  let userLikedSet = new Set<number>();
  if (session?.user?.id) {
    const userLikes = await database
      .select({ reviewId: review_likes.reviewId })
      .from(review_likes)
      .where(
        and(
          eq(review_likes.userId, session.user.id),
          sql`${review_likes.reviewId} in ${reviewIds}`
        )
      );
    userLikedSet = new Set(userLikes.map((l) => l.reviewId));
  }

  return (
    <div className="flex flex-col gap-4">
      {plateComments.map((comment) => (
        <Card
          key={comment.id}
          className="p-4 gap-0"
        >
          <div className="flex flex-col gap-3">
            {/* Rating stars */}
            {comment.rating !== null && (
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < (comment.rating ?? 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Comment text */}
            {comment.comment && (
              <p className="text-sm text-wrap break-words">
                {comment.comment}
              </p>
            )}

            {/* Timestamp and like */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                {comment.updatedAt > comment.createdAt && (
                  <> · edited {formatDistanceToNow(comment.updatedAt, { addSuffix: true })}</>
                )}
              </span>
              <ReviewLikeButton
                reviewId={comment.id}
                likeCount={likeCountMap.get(comment.id) ?? 0}
                isLiked={userLikedSet.has(comment.id)}
                disabled={!session}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CommentsSkeleton({ limit = 10 }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className="flex flex-col gap-4">
      {skeletons.map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
}

function CommentSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="size-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}
