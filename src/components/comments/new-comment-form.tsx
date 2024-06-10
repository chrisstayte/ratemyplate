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

interface NewCommentFormProps {
  className?: string;
  plate: Plate;
}

export const newCommentFormSchema = z.object({
  message: z.string().min(5).max(254),
});

const NewCommentForm: React.FC<NewCommentFormProps> = ({
  className,
  plate,
}) => {
  const form = useForm<z.infer<typeof newCommentFormSchema>>({
    resolver: zodResolver(newCommentFormSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof newCommentFormSchema>) {
    console.log('Values: ', values);
  }

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
        <Button type='submit'>Post</Button>
      </form>
    </Form>
  );
};

export default NewCommentForm;
