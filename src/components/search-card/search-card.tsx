'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { validateLicensePlate } from '@/lib/plates';

import StatePicker from './state-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BorderBeam } from '@/components/magicui/border-beam';

export const searchCardFormSchema = z
  .object({
    plate: z.string(),
    state: z.string().length(2),
  })
  .refine(
    (data) => {
      return validateLicensePlate(data.plate.toUpperCase(), 'US');
    },
    {
      message: 'Invalid license plate',
      path: ['plate'],
    }
  );

export default function SearchCard() {
  const router = useRouter();

  const form = useForm<z.infer<typeof searchCardFormSchema>>({
    resolver: zodResolver(searchCardFormSchema),
    defaultValues: {
      plate: undefined,
      state: '',
    },
  });

  async function onSubmit(values: z.infer<typeof searchCardFormSchema>) {
    router.push(
      `/plate?plate=${values.plate.toUpperCase()}&state=${values.state}`
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Let&apos;s find em.</CardTitle>
        <CardDescription>Enter the plate number and state</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-5'>
            <div className='flex flex-col sm:flex-row gap-5'>
              <FormField
                control={form.control}
                name='plate'
                render={({ field }) => (
                  <FormItem className='basis-1/2'>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input
                        className='uppercase text-[16px]'
                        placeholder=''
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem className='basis-1/2'>
                    <FormLabel>State</FormLabel>
                    <StatePicker
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-full flex justify-end'>
              <Button type='submit'>Search</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
