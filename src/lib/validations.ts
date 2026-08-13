import { z } from 'zod';
import { validateLicensePlate, type Plate } from '@/lib/plates';
import { US_STATE_CENTERS } from '@/lib/us-state-centers';

export const REVIEW_COMMENT_MIN = 5;
export const REVIEW_COMMENT_MAX = 254;

const usStateCodes = Object.keys(US_STATE_CENTERS) as [string, ...string[]];

export const reviewContentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(
      REVIEW_COMMENT_MIN,
      'Please write a bit more about your experience'
    )
    .max(REVIEW_COMMENT_MAX, 'Review is too long'),
  rating: z
    .number({ error: 'Please select a rating' })
    .int({ error: 'Please select a rating' })
    .min(1, { error: 'Please select a rating' })
    .max(5, { error: 'Please select a rating' }),
});

/** Client form uses `message` instead of `comment`. */
export const newCommentFormSchema = z.object({
  message: reviewContentSchema.shape.comment,
  rating: reviewContentSchema.shape.rating,
});

export const plateInputSchema = z.object({
  state: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => usStateCodes.includes(value), {
      message: 'Invalid state',
    }),
  plateNumber: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => validateLicensePlate(value, 'US'), {
      message: 'Invalid license plate',
    }),
});

export const plateIdSchema = z.number().int().positive('Invalid plate');
export const reviewIdSchema = z.number().int().positive('Invalid review');

export type ReviewContent = z.infer<typeof reviewContentSchema>;
export type PlateInput = z.infer<typeof plateInputSchema>;

export function parseReviewContent(input: {
  comment: unknown;
  rating: unknown;
}):
  | { success: true; data: ReviewContent }
  | { success: false; message: string } {
  const result = reviewContentSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? 'Invalid review',
    };
  }
  return { success: true, data: result.data };
}

export function parsePlateInput(
  plate: Plate
):
  | { success: true; data: PlateInput }
  | { success: false; message: string } {
  const result = plateInputSchema.safeParse(plate);
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? 'Invalid plate',
    };
  }
  return { success: true, data: result.data };
}

export function parsePositiveId(
  value: unknown,
  label: string
):
  | { success: true; data: number }
  | { success: false; message: string } {
  const result = z.number().int().positive().safeParse(value);
  if (!result.success) {
    return { success: false, message: `Invalid ${label}` };
  }
  return { success: true, data: result.data };
}

export function platePath(state: string, plateNumber: string) {
  return `/${state.toUpperCase()}/${plateNumber.toUpperCase()}`;
}

export function plateRelatedPaths(state: string, plateNumber: string) {
  const upperState = state.toUpperCase();
  const upperPlate = plateNumber.toUpperCase();
  return [
    '/',
    `/${upperState}`,
    platePath(upperState, upperPlate),
    '/globe',
    '/map',
  ] as const;
}
