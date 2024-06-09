'use client';

import { database } from '@/db/database';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import StatePicker from './state-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { plates } from '@/db/schema';

import { createPlate } from '@/app/actions';

export const formSchema = z.object({
  plate: z.string(),
  state: z.string().length(2),
});

export default function LicensePlateInputCard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: '',
      state: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Create the plate
    createPlate(values);
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Let's find em.</CardTitle>
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
                      <Input placeholder='' {...field} />
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
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function validateLicensePlate(plate: string, country: string): boolean {
  let regex: RegExp;
  switch (country) {
    case 'US':
      regex = /^[A-Z0-9]{1,7}$/;
      break;
    case 'UK':
      regex = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/;
      break;
    case 'DE':
      regex = /^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s[0-9]{1,4}$/;
      break;
    default:
      return false; // Unsupported country format
  }
  return regex.test(plate);
}
