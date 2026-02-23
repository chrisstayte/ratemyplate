'use client';

import { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { licensePlateFont } from '@/lib/fonts';
import Link from 'next/link';

export interface ReviewMarqueeItem {
  id: number;
  rating: number | null;
  comment: string | null;
  createdAt: Date;
  plateNumber: string;
  state: string;
  stateName: string;
}

interface ReviewMarqueeProps {
  reviews: ReviewMarqueeItem[];
  direction: 'ltr' | 'rtl';
  /** Animation duration in seconds (default 60). Higher = slower. */
  duration?: number;
}

const MIN_ITEMS = 6;
const SLOW_RATE = 0.15;
const NORMAL_RATE = 1;
const EASE_FACTOR = 0.08;

export default function ReviewMarquee({
  reviews,
  direction,
  duration = 60,
}: ReviewMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const currentRate = useRef(NORMAL_RATE);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    function tick() {
      const target = hovered.current ? SLOW_RATE : NORMAL_RATE;
      const diff = target - currentRate.current;

      if (Math.abs(diff) < 0.005) {
        currentRate.current = target;
        applyRate(currentRate.current);
        rafId.current = null;
        return;
      }

      currentRate.current += diff * EASE_FACTOR;
      applyRate(currentRate.current);
      rafId.current = requestAnimationFrame(tick);
    }

    function applyRate(rate: number) {
      if (!containerRef.current) return;
      const animations = containerRef.current.getAnimations({ subtree: true });
      for (const anim of animations) {
        anim.playbackRate = rate;
      }
    }

    function onEnter() {
      hovered.current = true;
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(tick);
      }
    }

    function onLeave() {
      hovered.current = false;
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(tick);
      }
    }

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (reviews.length === 0) return null;

  const padded = [...reviews];
  while (padded.length < MIN_ITEMS) {
    padded.push(...reviews);
  }

  const animationClass =
    direction === 'rtl' ? 'animate-marquee-left' : 'animate-marquee-right';

  const style = { animationDuration: `${duration}s` };

  return (
    <div ref={containerRef} className="flex ">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className={`flex shrink-0 gap-4 pr-4 ${animationClass}`}
          style={style}
          aria-hidden={copy === 1}
        >
          {padded.map((review, i) => (
            <Link
              key={`${copy}-${review.id}-${i}`}
              href={`/${review.state}/${review.plateNumber}`}
              className="block w-75 shrink-0"
            >
              <Card className="h-full transition-transform hover:scale-[1.02]">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <Badge className={licensePlateFont.className}>
                      {review.plateNumber}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {review.stateName}
                    </span>
                  </div>
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
                  {review.comment && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {review.comment}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
