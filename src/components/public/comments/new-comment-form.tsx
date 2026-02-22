'use client';

import React, { useState } from 'react';
import { Plate } from '@/lib/plates';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { createPlate, postReview, updateReview } from '@/app/actions';
import confetti from 'canvas-confetti';
import { Star } from 'lucide-react';

export interface ExistingReview {
  id: number;
  rating: number | null;
  comment: string | null;
}

interface NewCommentFormProps {
  className?: string;
  plate: Plate;
  onClose: () => void;
  existingReview?: ExistingReview;
}

export const newCommentFormSchema = z.object({
  message: z.string().min(5, 'Please write a bit more about your experience').max(254, 'Review is too long'),
  rating: z.number().min(1, 'Please select a rating').max(5),
});

const NewCommentForm: React.FC<NewCommentFormProps> = ({
  className,
  plate,
  onClose,
  existingReview,
}) => {
  const [error, setSetError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const isEditing = !!existingReview;

  const form = useForm<z.infer<typeof newCommentFormSchema>>({
    resolver: zodResolver(newCommentFormSchema),
    defaultValues: {
      message: existingReview?.comment ?? '',
      rating: existingReview?.rating ?? 0,
    },
  });

  const currentRating = form.watch('rating');

  async function onSubmit(values: z.infer<typeof newCommentFormSchema>) {
    if (isEditing) {
      const response = await updateReview(
        existingReview!.id,
        values.message,
        values.rating
      );
      if (response.status === 500) {
        setSetError(response.message);
      } else {
        form.reset();
        setSetError(null);
        onClose();
      }
    } else {
      const response = await createPlate(plate);

      if (response.id) {
        const response2 = await postReview(
          values.message,
          values.rating,
          response.id
        );
        onClose();
        shootFireworks();

        if (response2.status === 500) {
          setSetError(response2.message);
        } else {
          form.reset();
          setSetError(null);
        }
      } else {
        setSetError(response.message);
      }
    }
  }

  const shootFireworks = () => {
    const end = Date.now() + 0.2 * 1000;
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const messageError = form.formState.errors.message;
  const ratingError = form.formState.errors.rating;

  return (
    <form
      className={cn('grid items-start gap-4', className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Field data-invalid={!!ratingError}>
        <FieldLabel>Rating</FieldLabel>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            const isActive =
              starValue <= (hoverRating || currentRating);
            return (
              <button
                key={i}
                type="button"
                className="p-0.5 cursor-pointer"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => form.setValue('rating', starValue, { shouldValidate: true })}
              >
                <Star
                  className={`size-6 transition-colors ${
                    isActive
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/40'
                  }`}
                />
              </button>
            );
          })}
        </div>
        {ratingError && <FieldError errors={[ratingError]} />}
      </Field>
      <Field data-invalid={!!messageError}>
        <FieldLabel htmlFor="new-comment-message">Review</FieldLabel>
        <Textarea
          id="new-comment-message"
          className="text-[16px]"
          aria-invalid={!!messageError}
          {...form.register('message')}
        />
        {messageError && <FieldError errors={[messageError]} />}
      </Field>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">
        {isEditing ? 'Update Review' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default NewCommentForm;
