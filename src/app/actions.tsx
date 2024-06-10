'use server';

import { database } from '@/db/database';
import { plates } from '@/db/schema';
import { formSchema } from '@/components/license-plate-input-card';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createPlate(formData: z.infer<typeof formSchema>) {
  const session = await auth();

  console.log('formData', formData);
  try {
    database
      .insert(plates)
      .values({
        plateNumber: formData.plate,
        state: formData.state,
        userId: session!.user!.id,
      })
      .execute();
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }

  return { message: 'Added plate' };
}