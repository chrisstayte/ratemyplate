'use client';

import { useState } from 'react';
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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

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
  const [stateValue, setStateValue] = useState('');

  const form = useForm<z.infer<typeof searchCardFormSchema>>({
    resolver: zodResolver(searchCardFormSchema),
    defaultValues: {
      plate: '',
      state: '',
    },
  });

  async function onSubmit(values: z.infer<typeof searchCardFormSchema>) {
    router.push(
      `/plate?plate=${values.plate.toUpperCase()}&state=${values.state}`
    );
  }

  const plateError = form.formState.errors.plate;
  const stateError = form.formState.errors.state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Let&apos;s find em.</CardTitle>
        <CardDescription>Enter the plate number and state</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FieldGroup className="flex flex-col sm:flex-row gap-5">
            <Field className="basis-1/2" data-invalid={!!plateError}>
              <FieldLabel htmlFor="search-card-plate">License Plate</FieldLabel>
              <Input
                id="search-card-plate"
                className="uppercase text-[16px]"
                placeholder=""
                aria-invalid={!!plateError}
                {...form.register('plate')}
              />
              {plateError && <FieldError errors={[plateError]} />}
            </Field>
            <Field className="basis-1/2" data-invalid={!!stateError}>
              <FieldLabel htmlFor="search-card-state">State</FieldLabel>
              <input type="hidden" {...form.register('state')} />
              <StatePicker
                id="search-card-state"
                onValueChange={(value) => {
                  setStateValue(value);
                  form.setValue('state', value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                value={stateValue}
                ariaInvalid={!!stateError}
              />
              {stateError && <FieldError errors={[stateError]} />}
            </Field>
          </FieldGroup>
          <div className="w-full flex justify-end">
            <Button type="submit">Search</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
