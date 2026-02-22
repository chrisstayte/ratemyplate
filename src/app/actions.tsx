'use server';

import { database } from '@/db/database';
import { plates, plate_reviews, user_favorite_plates } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { auth, isCurrentUserAdmin } from '@/auth';
import { eq, and, desc, sql } from 'drizzle-orm';
import { Plate } from '@/lib/plates';

export async function createPlate(plate: Plate): Promise<{ message: string; id: number }> {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!plate.plateNumber || !plate.state) {
    throw new Error('Plate number and state are required');
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

export async function postReview(
  comment: string,
  rating: number,
  plateId: number
): Promise<{ message: string; status: number }> {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (rating < 1 || rating > 5) {
    return { message: 'Rating must be between 1 and 5', status: 400 };
  }

  try {
    await database
      .insert(plate_reviews)
      .values({
        comment: comment,
        rating: rating,
        plateId: plateId,
        userId: session!.user!.id,
      })
      .execute();

    revalidatePath('/', 'layout');
  } catch (error) {
    console.error(error);
    return { message: 'Failed to add review', status: 500 };
  }
  return { message: 'Added review', status: 200 };
}

export async function updateReview(
  reviewId: number,
  comment: string,
  rating: number
): Promise<{ message: string; status: number }> {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (rating < 1 || rating > 5) {
    return { message: 'Rating must be between 1 and 5', status: 400 };
  }

  const existing = await database.query.plate_reviews.findFirst({
    where: (plate_reviews, { eq }) => eq(plate_reviews.id, reviewId),
  });

  if (!existing || existing.userId !== session.user!.id) {
    throw new Error('Unauthorized');
  }

  try {
    await database
      .update(plate_reviews)
      .set({ comment, rating, updatedAt: sql`now()` })
      .where(eq(plate_reviews.id, reviewId))
      .execute();

    revalidatePath('/', 'layout');
  } catch (error) {
    console.error(error);
    return { message: 'Failed to update review', status: 500 };
  }
  return { message: 'Updated review', status: 200 };
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

  await database
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

  await database
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

export async function getRecentCommentsByState(stateAbbreviation: string) {
  const results = await database
    .select({
      commentText: plate_reviews.comment,
      plateNumber: plates.plateNumber,
      timestamp: plate_reviews.createdAt,
    })
    .from(plate_reviews)
    .innerJoin(plates, eq(plate_reviews.plateId, plates.id))
    .where(eq(plates.state, stateAbbreviation))
    .orderBy(desc(plate_reviews.createdAt))
    .limit(20);

  return results;
}

export async function getRandomPlate(): Promise<{ state: string; plateNumber: string } | null> {
  const [result] = await database
    .select({
      plateNumber: plates.plateNumber,
      state: plates.state,
    })
    .from(plates)
    .orderBy(sql`random()`)
    .limit(1);

  return result ?? null;
}

export async function deleteComment(id: number): Promise<boolean> {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!(await isCurrentUserAdmin())) {
    throw new Error('Unauthorized');
  }

  const response = await database.delete(plate_reviews).where(eq(plate_reviews.id, id));
  revalidatePath('/', 'layout');
  return response.length > 0;
}
