'use server';

import { database } from '@/db/database';
import { plates, plate_reviews, user_favorite_plates, review_likes } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { auth, isCurrentUserAdmin } from '@/auth';
import { eq, and } from 'drizzle-orm';
import { Plate } from '@/lib/plates';
import {
  parsePlateInput,
  parsePositiveId,
  parseReviewContent,
  plateRelatedPaths,
} from '@/lib/validations';

function revalidatePlateRelatedPaths(state: string, plateNumber: string) {
  for (const path of plateRelatedPaths(state, plateNumber)) {
    revalidatePath(path);
  }
}

async function getPlateById(plateId: number) {
  return database.query.plates.findFirst({
    where: (platesTable, { eq: equals }) => equals(platesTable.id, plateId),
  });
}

async function getPlateForReview(reviewId: number) {
  const review = await database.query.plate_reviews.findFirst({
    where: (reviews, { eq: equals }) => equals(reviews.id, reviewId),
    with: { plate: true },
  });
  return review?.plate ?? null;
}

export async function createPlate(plate: Plate): Promise<{ message: string; id: number }> {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const parsed = parsePlateInput(plate);
  if (!parsed.success) {
    throw new Error(parsed.message);
  }

  const { state, plateNumber } = parsed.data;

  const existingPlate = await database.query.plates.findFirst({
    where: (platesTable, { eq: equals }) =>
      and(equals(platesTable.plateNumber, plateNumber), equals(platesTable.state, state)),
  });

  if (existingPlate) {
    return { message: 'Plate already exists', id: existingPlate.id };
  }

  const newPlateList = await database
    .insert(plates)
    .values({
      plateNumber,
      state,
      userId: session.user!.id,
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

  const parsedContent = parseReviewContent({ comment, rating });
  if (!parsedContent.success) {
    return { message: parsedContent.message, status: 400 };
  }

  const parsedPlateId = parsePositiveId(plateId, 'plate');
  if (!parsedPlateId.success) {
    return { message: parsedPlateId.message, status: 400 };
  }

  const plate = await getPlateById(parsedPlateId.data);
  if (!plate) {
    return { message: 'Plate not found', status: 404 };
  }

  try {
    await database
      .insert(plate_reviews)
      .values({
        comment: parsedContent.data.comment,
        rating: parsedContent.data.rating,
        plateId: parsedPlateId.data,
        userId: session.user!.id,
      })
      .execute();

    revalidatePlateRelatedPaths(plate.state, plate.plateNumber);
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

  const parsedReviewId = parsePositiveId(reviewId, 'review');
  if (!parsedReviewId.success) {
    return { message: parsedReviewId.message, status: 400 };
  }

  const parsedContent = parseReviewContent({ comment, rating });
  if (!parsedContent.success) {
    return { message: parsedContent.message, status: 400 };
  }

  const existing = await database.query.plate_reviews.findFirst({
    where: (reviews, { eq: equals }) => equals(reviews.id, parsedReviewId.data),
    with: { plate: true },
  });

  if (!existing || existing.userId !== session.user!.id) {
    throw new Error('Unauthorized');
  }

  try {
    await database
      .update(plate_reviews)
      .set({
        comment: parsedContent.data.comment,
        rating: parsedContent.data.rating,
        updatedAt: new Date(),
      })
      .where(eq(plate_reviews.id, parsedReviewId.data))
      .execute();

    if (existing.plate) {
      revalidatePlateRelatedPaths(existing.plate.state, existing.plate.plateNumber);
    }
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
      userId: session.user!.id,
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

  const parsed = parsePlateInput(plate);
  if (!parsed.success) {
    throw new Error(parsed.message);
  }

  const databasePlate = await database.query.plates.findFirst({
    where: (platesTable, { eq: equals }) =>
      and(
        equals(platesTable.plateNumber, parsed.data.plateNumber),
        equals(platesTable.state, parsed.data.state)
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
        eq(user_favorite_plates.userId, session.user!.id!)
      )
    )
    .execute();

  revalidatePath('/favorites');
}

export async function toggleReviewLike(reviewId: number) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const parsedReviewId = parsePositiveId(reviewId, 'review');
  if (!parsedReviewId.success) {
    throw new Error(parsedReviewId.message);
  }

  const userId = session.user!.id!;
  const plate = await getPlateForReview(parsedReviewId.data);

  const existing = await database
    .select()
    .from(review_likes)
    .where(
      and(
        eq(review_likes.userId, userId),
        eq(review_likes.reviewId, parsedReviewId.data)
      )
    )
    .execute();

  if (existing.length > 0) {
    await database
      .delete(review_likes)
      .where(
        and(
          eq(review_likes.userId, userId),
          eq(review_likes.reviewId, parsedReviewId.data)
        )
      )
      .execute();
    if (plate) {
      revalidatePlateRelatedPaths(plate.state, plate.plateNumber);
    }
    return { liked: false };
  }

  await database
    .insert(review_likes)
    .values({ userId, reviewId: parsedReviewId.data })
    .execute();
  if (plate) {
    revalidatePlateRelatedPaths(plate.state, plate.plateNumber);
  }
  return { liked: true };
}

export async function deleteComment(id: number): Promise<boolean> {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!(await isCurrentUserAdmin())) {
    throw new Error('Unauthorized');
  }

  const parsedId = parsePositiveId(id, 'review');
  if (!parsedId.success) {
    throw new Error(parsedId.message);
  }

  const plate = await getPlateForReview(parsedId.data);

  const response = await database
    .delete(plate_reviews)
    .where(eq(plate_reviews.id, parsedId.data));

  if (plate) {
    revalidatePlateRelatedPaths(plate.state, plate.plateNumber);
  } else {
    revalidatePath('/');
  }

  return response.length > 0;
}
