'use server';

import { database } from '@/db/database';
import { plates } from '@/db/schema';
import { formSchema } from '@/components/license-plate-input-card';
import { z } from 'zod';

export async function createPlate(formData: z.infer<typeof formSchema>) {
  console.log('formData', formData);
  try {
    database
      .insert(plates)
      .values({
        plateNumber: formData.plate,
        state: formData.state,
      })
      .execute();
  } catch (error) {
    console.error(error);
  }

  return { message: 'Added plate' };
}
