'use client';

import React, { useState } from 'react';
import { Plate } from '@/lib/plates';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createPlate, postComment } from '@/app/actions';
import confetti from 'canvas-confetti';

interface NewCommentFormProps {
  className?: string;
  plate: Plate;
  onClose: () => void;
}

export const newCommentFormSchema = z.object({
  message: z.string().min(5).max(254),
});

const NewCommentForm: React.FC<NewCommentFormProps> = ({
  className,
  plate,
  onClose,
}) => {
  const [error, setSetError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof newCommentFormSchema>>({
    resolver: zodResolver(newCommentFormSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof newCommentFormSchema>) {
    const response = await createPlate(plate);

    if (response.id) {
      // Write message using plate id
      const response2 = postComment(values.message, response.id);
      onClose();
      shootFireworks();

      if (response.status === 500) {
        setSetError(response.message);
      } else {
        form.reset();
        setSetError(null);
      }
    } else {
      setSetError(response.message);
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

  return (
    <Form {...form}>
      <form
        className={cn('grid items-start gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='grid gap-2'>
                  <Label htmlFor='message'>Comment</Label>
                  <Textarea id='message' className='text-[16px]' {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className='text-red-500'>{error}</p>}
        <Button type='submit'>Post</Button>
      </form>
    </Form>
  );
};

export default NewCommentForm;
