'use server';

import { database } from '@/db/database';
import { plates, comments, user_favorite_plates } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { eq, and } from 'drizzle-orm';
import { Plate } from '@/lib/plates';

export async function createPlate(plate: Plate): Promise<any> {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const existingPlate = await database?.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(
        eq(plates.plateNumber, plate.plateNumber.toUpperCase()),
        eq(plates.state, plate.state)
      ),
  });

  if (existingPlate) {
    return { message: 'Plate already exists', id: existingPlate.id };
  }

  const newPlateList = await database
    ?.insert(plates)
    .values({
      plateNumber: plate.plateNumber.toUpperCase(),
      state: plate.state,
      userId: session!.user!.id,
    })
    .returning();

  return { message: 'Plate created', id: newPlateList[0].id };
}

export async function postComment(
  comment: string,
  plateId: number
): Promise<any> {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    database
      .insert(comments)
      .values({
        comment: comment,
        plateId: plateId,
        userId: session!.user!.id,
      })
      .execute();

    revalidatePath('/plate');
  } catch (error) {
    console.error(error);
    return { message: 'Failed to add comment', status: 500 };
  }
  return { message: 'Added comment', status: 200 };
}

export async function addPlateToFavorites(plate: Plate) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const plateId = (await createPlate(plate)).id;

  if (!plateId) {
    throw new Error('Failed to add plate to favorites');
  }

  database
    .insert(user_favorite_plates)
    .values({
      userId: session!.user!.id,
      plateId: plateId,
    })
    .execute();

  revalidatePath('/favorites');
}

export async function removePlateFromFavorites(plate: Plate) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const databasePlate = await database.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(
        eq(plates.plateNumber, plate.plateNumber),
        eq(plates.state, plate.state)
      ),
  });

  if (!databasePlate) {
    throw new Error('Plate not found');
  }

  database
    .delete(user_favorite_plates)
    .where(
      and(
        eq(user_favorite_plates.plateId, databasePlate.id),
        eq(user_favorite_plates.userId, session!.user!.id!)
      )
    )
    .execute();

  revalidatePath('/favorites');
}

export async function deleteComment(id: number): Promise<boolean> {
  const response = await database.delete(comments).where(eq(comments.id, id));
  revalidatePath('/plate');
  return response.length > 0;
}
