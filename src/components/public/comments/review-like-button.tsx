'use client';

import { useState, useRef } from 'react';
import { ThumbsUp } from 'lucide-react';
import { toggleReviewLike } from '@/app/actions';
import { cn } from '@/lib/utils';

interface ReviewLikeButtonProps {
  reviewId: number;
  likeCount: number;
  isLiked: boolean;
  disabled?: boolean;
}

function spawnParticles(button: HTMLButtonElement) {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('span');
    particle.textContent = ['✨', '👍', '💙', '⭐'][Math.floor(Math.random() * 4)];
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: 14px;
      pointer-events: none;
      z-index: 50;
    `;
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.5;
    const distance = 30 + Math.random() * 25;

    particle.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1.2)`,
          opacity: 1,
          offset: 0.4,
        },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * distance * 1.5}px), calc(-50% + ${Math.sin(angle) * distance * 1.5 + 10}px)) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );

    setTimeout(() => particle.remove(), 600);
  }
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  async function handleClick() {
    if (pending) return;
    setPending(true);

    const willLike = !liked;

    // Optimistic update
    setLiked(willLike);
    setCount(liked ? count - 1 : count + 1);

    if (willLike) {
      if (buttonRef.current) spawnParticles(buttonRef.current);
      iconRef.current?.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.5) rotate(-10deg)', offset: 0.4 },
          { transform: 'scale(1)' },
        ],
        { duration: 350, easing: 'ease-out' }
      );
    }

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
      ref={buttonRef}
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
        ref={iconRef}
        className={cn('size-3.5', liked && 'fill-current')}
      />
      <span>{count}</span>
    </button>
  );
}
