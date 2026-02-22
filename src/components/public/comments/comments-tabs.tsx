'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewLikeButton from './review-like-button';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ReviewWithLikes {
  id: number;
  rating: number | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  isLiked: boolean;
}

interface CommentsTabsProps {
  reviews: ReviewWithLikes[];
  isLoggedIn: boolean;
}

function ReviewCard({
  review,
  isLoggedIn,
}: {
  review: ReviewWithLikes;
  isLoggedIn: boolean;
}) {
  return (
    <Card key={review.id} className="p-4 gap-0">
      <div className="flex flex-col gap-3">
        {review.rating !== null && (
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < (review.rating ?? 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/40'
                }`}
              />
            ))}
          </div>
        )}

        {review.comment && (
          <p className="text-sm text-wrap break-words">{review.comment}</p>
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(review.createdAt, { addSuffix: true })}
            {review.updatedAt > review.createdAt && (
              <>
                {' '}
                · edited{' '}
                {formatDistanceToNow(review.updatedAt, { addSuffix: true })}
              </>
            )}
          </span>
          <ReviewLikeButton
            reviewId={review.id}
            likeCount={review.likeCount}
            isLiked={review.isLiked}
            disabled={!isLoggedIn}
          />
        </div>
      </div>
    </Card>
  );
}

function ReviewList({
  reviews,
  isLoggedIn,
  emptyMessage,
}: {
  reviews: ReviewWithLikes[];
  isLoggedIn: boolean;
  emptyMessage: string;
}) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  );
}

export default function CommentsTabs({
  reviews,
  isLoggedIn,
}: CommentsTabsProps) {
  const mostRecent = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ),
    [reviews]
  );

  const topRated = useMemo(
    () =>
      [...reviews].sort((a, b) => {
        if (a.rating === null && b.rating === null) return 0;
        if (a.rating === null) return 1;
        if (b.rating === null) return -1;
        return b.rating - a.rating;
      }),
    [reviews]
  );

  const negative = useMemo(
    () =>
      reviews
        .filter((r) => r.rating !== null && r.rating <= 2)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [reviews]
  );

  const topLiked = useMemo(
    () => [...reviews].sort((a, b) => b.likeCount - a.likeCount),
    [reviews]
  );

  return (
    <Tabs defaultValue="recent">
      <TabsList className="w-full bg-card rounded-md">
        <TabsTrigger value="recent" className="data-active:bg-foreground data-active:text-background dark:data-active:bg-foreground dark:data-active:text-background data-active:hover:text-background dark:data-active:hover:text-background">Most Recent</TabsTrigger>
        <TabsTrigger value="top-rated" className="data-active:bg-foreground data-active:text-background dark:data-active:bg-foreground dark:data-active:text-background data-active:hover:text-background dark:data-active:hover:text-background">Top Rated</TabsTrigger>
        <TabsTrigger value="negative" className="data-active:bg-foreground data-active:text-background dark:data-active:bg-foreground dark:data-active:text-background data-active:hover:text-background dark:data-active:hover:text-background">Negative</TabsTrigger>
        <TabsTrigger value="top-liked" className="data-active:bg-foreground data-active:text-background dark:data-active:bg-foreground dark:data-active:text-background data-active:hover:text-background dark:data-active:hover:text-background">Top Liked</TabsTrigger>
      </TabsList>
      <TabsContent value="recent">
        <ReviewList
          reviews={mostRecent}
          isLoggedIn={isLoggedIn}
          emptyMessage="No reviews yet"
        />
      </TabsContent>
      <TabsContent value="top-rated">
        <ReviewList
          reviews={topRated}
          isLoggedIn={isLoggedIn}
          emptyMessage="No reviews yet"
        />
      </TabsContent>
      <TabsContent value="negative">
        <ReviewList
          reviews={negative}
          isLoggedIn={isLoggedIn}
          emptyMessage="No negative reviews"
        />
      </TabsContent>
      <TabsContent value="top-liked">
        <ReviewList
          reviews={topLiked}
          isLoggedIn={isLoggedIn}
          emptyMessage="No reviews yet"
        />
      </TabsContent>
    </Tabs>
  );
}
