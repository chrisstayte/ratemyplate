'use server';

import { database } from '@/db/database';
import { comments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteComment(id: number): Promise<boolean> {
  const response = await database.delete(comments).where(eq(comments.id, id));
  return response.length > 0;
}
