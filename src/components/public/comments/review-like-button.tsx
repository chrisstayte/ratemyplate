'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { toggleReviewLike } from '@/app/actions';
import { cn } from '@/lib/utils';

interface ReviewLikeButtonProps {
  reviewId: number;
  likeCount: number;
  isLiked: boolean;
  disabled?: boolean;
}

export default function ReviewLikeButton({
  reviewId,
  likeCount,
  isLiked,
  disabled,
}: ReviewLikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);

    // Optimistic update
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      await toggleReviewLike(reviewId);
    } catch {
      // Revert on error
      setLiked(liked);
      setCount(likeCount);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || pending}
      className={cn(
        'flex items-center gap-1 text-xs transition-colors',
        disabled
          ? 'text-muted-foreground cursor-default'
          : liked
            ? 'text-primary hover:text-primary/80 cursor-pointer'
            : 'text-muted-foreground hover:text-foreground cursor-pointer'
      )}
    >
      <ThumbsUp
        className={cn('size-3.5', liked && 'fill-current')}
      />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
