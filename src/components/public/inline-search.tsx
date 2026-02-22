'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { validateLicensePlate } from '@/lib/plates';
import { Search } from 'lucide-react';
import StatePicker from './search-card/state-picker';

const inlineSearchSchema = z
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

export default function InlineSearch() {
  const router = useRouter();
  const [stateValue, setStateValue] = useState('');

  const form = useForm<z.infer<typeof inlineSearchSchema>>({
    resolver: zodResolver(inlineSearchSchema),
    defaultValues: {
      plate: '',
      state: '',
    },
  });

  async function onSubmit(values: z.infer<typeof inlineSearchSchema>) {
    router.push(`/${values.state}/${values.plate.toUpperCase()}`);
  }

  const plateError = form.formState.errors.plate;
  const stateError = form.formState.errors.state;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
    >
      <div className="flex flex-row gap-2 w-full">
        <Input
          className="uppercase text-[16px] flex-1 bg-card"
          placeholder="Plate number"
          aria-invalid={!!plateError}
          {...form.register('plate')}
        />
        <input type="hidden" {...form.register('state')} />
        <StatePicker
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
      </div>
      <Button type="submit">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  );
}
