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
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        disabled
          ? 'border-muted text-muted-foreground cursor-default'
          : liked
            ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
            : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer'
      )}
    >
      <ThumbsUp
        className={cn('size-3.5', liked && 'fill-current')}
      />
      <span>{count}</span>
    </button>
  );
}
